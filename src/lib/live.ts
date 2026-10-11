// The small shared state behind the terminal commands: calling the train,
// the guestbook and who is on the site. All of it lives in the Upstash Redis
// the contact form already uses; without its env vars every helper answers
// "unavailable" instead of throwing.
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const env = (key: string): string | undefined => process.env[key] ?? (import.meta.env as Record<string, string | undefined> | undefined)?.[key];

let redis: Redis | null | undefined;
export function getRedis(): Redis | null {
  if (redis !== undefined) return redis;
  const url = env("KV_REST_API_URL") ?? env("UPSTASH_REDIS_REST_URL");
  const token = env("KV_REST_API_TOKEN") ?? env("UPSTASH_REDIS_REST_TOKEN");
  redis = url && token ? new Redis({ url, token }) : null;
  return redis;
}

const limiters = new Map<string, Ratelimit>();
/** True when the caller may go ahead; also true when Redis is missing, so local dev works. */
export async function allow(kind: string, key: string, tokens: number, window: `${number} ${"s" | "m" | "h"}`): Promise<boolean> {
  const client = getRedis();
  if (!client) return true;
  let limiter = limiters.get(kind);
  if (!limiter) {
    limiter = new Ratelimit({ redis: client, limiter: Ratelimit.slidingWindow(tokens, window), prefix: `ratelimit:${kind}`, analytics: false });
    limiters.set(kind, limiter);
  }
  return (await limiter.limit(key)).success;
}

export const clientIp = (request: Request) =>
  request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? request.headers.get("x-real-ip") ?? "unknown";

// The page asks for a short token and shows a curl command with it. Ringing
// that token sets a flag the same tab polls for, so a train only ever drives
// through the page of the person who typed the command.

const ZUG_TTL = 600;
const ALPHABET = "abcdefghjkmnpqrstuvwxyz23456789";
export const isZugToken = (token: string) => /^[a-z2-9]{5}$/.test(token);

export async function createZugToken(): Promise<string | null> {
  const client = getRedis();
  if (!client) return null;
  for (let attempt = 0; attempt < 5; attempt++) {
    const bytes = crypto.getRandomValues(new Uint8Array(5));
    const token = [...bytes].map((byte) => ALPHABET[byte % ALPHABET.length]).join("");
    if (await client.set(`zug:${token}`, 0, { ex: ZUG_TTL, nx: true })) return token;
  }
  return null;
}

/** Rings a token; false when it is unknown or expired. */
export async function ringZug(token: string): Promise<boolean> {
  const client = getRedis();
  if (!client || !isZugToken(token)) return false;
  return Boolean(await client.set(`zug:${token}`, 1, { xx: true, keepTtl: true }));
}

/** "rang" once per ring: reading resets the flag so the next curl sends another train. */
export async function pollZug(token: string): Promise<"rang" | "waiting" | "expired"> {
  const client = getRedis();
  if (!client || !isZugToken(token)) return "expired";
  const value = await client.get<number>(`zug:${token}`);
  if (value === null) return "expired";
  if (Number(value) === 1) {
    await client.set(`zug:${token}`, 0, { xx: true, keepTtl: true });
    return "rang";
  }
  return "waiting";
}

// Each open tab sends a random id every two minutes while visible. The id is
// made up per page load, never stored in the browser, and nothing else about
// the visitor is kept. Ids older than the window drop out.

const WHO_KEY = "who";
const WHO_WINDOW_MS = 150_000;
export const isPresenceId = (id: string) => /^[a-z0-9]{8,32}$/.test(id);

export async function markHere(id: string): Promise<number | null> {
  const client = getRedis();
  if (!client || !isPresenceId(id)) return null;
  const now = Date.now();
  const [, , count] = await client
    .pipeline()
    .zadd(WHO_KEY, { score: now, member: id })
    .zremrangebyscore(WHO_KEY, 0, now - WHO_WINDOW_MS)
    .zcard(WHO_KEY)
    .exec<[number, number, number]>();
  return count;
}

export async function countHere(): Promise<number | null> {
  const client = getRedis();
  if (!client) return null;
  return client.zcount(WHO_KEY, Date.now() - WHO_WINDOW_MS, "+inf");
}

// Entries arrive by curl, wait for Johannes to approve them from a mail, and
// only then show up on the site. Pending entries expire after a week.

export interface GuestbookEntry {
  id: string;
  text: string;
  at: string;
}

export const GUESTBOOK_MAX = 140;
const PENDING_TTL = 7 * 24 * 3600;
const LIST_KEY = "gb:list";
const LIST_LENGTH = 30;

/** One line of plain text: no control characters, collapsed whitespace, at most GUESTBOOK_MAX characters. */
export function cleanGuestbookText(raw: string): string {
  // eslint-disable-next-line no-control-regex
  const text = raw.replace(/[\u0000-\u001f\u007f-\u009f\u200b-\u200f\u202a-\u202e\u2066-\u2069]/g, " ").replace(/\s+/g, " ").trim();
  return [...text].slice(0, GUESTBOOK_MAX).join("");
}

export async function addPending(text: string): Promise<GuestbookEntry | null> {
  const client = getRedis();
  if (!client) return null;
  const entry: GuestbookEntry = { id: crypto.randomUUID().replaceAll("-", "").slice(0, 16), text, at: new Date().toISOString() };
  await client.set(`gb:pending:${entry.id}`, entry, { ex: PENDING_TTL });
  return entry;
}

export async function getPending(id: string): Promise<GuestbookEntry | null> {
  const client = getRedis();
  if (!client || !/^[a-f0-9]{16}$/.test(id)) return null;
  return client.get<GuestbookEntry>(`gb:pending:${id}`);
}

export async function decidePending(id: string, approve: boolean): Promise<GuestbookEntry | null> {
  const client = getRedis();
  const entry = await getPending(id);
  if (!client || !entry) return null;
  await client.del(`gb:pending:${id}`);
  if (approve) {
    await client.lpush(LIST_KEY, entry);
    await client.ltrim(LIST_KEY, 0, LIST_LENGTH - 1);
  }
  return entry;
}

export async function listGuestbook(limit = 10): Promise<GuestbookEntry[]> {
  const client = getRedis();
  if (!client) return [];
  return client.lrange<GuestbookEntry>(LIST_KEY, 0, limit - 1);
}

/** HMAC for the review link in the mail, so only the mail can approve an entry. */
export async function signReview(id: string): Promise<string | null> {
  const secret = env("GUESTBOOK_SECRET");
  if (!secret) return null;
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const mac = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(`gb:${id}`));
  return [...new Uint8Array(mac)].map((byte) => byte.toString(16).padStart(2, "0")).join("").slice(0, 32);
}

export async function checkReview(id: string, signature: string): Promise<boolean> {
  const expected = await signReview(id);
  if (!expected || signature.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) diff |= expected.charCodeAt(i) ^ signature.charCodeAt(i);
  return diff === 0;
}

export { env as readEnv };
