import type { APIRoute } from "astro";
import { env, json } from "@/lib/env";
import { parseCommits, parseReleases, parseRepos, type WorkshopFeed } from "@/lib/githubFeed";

// On-demand function: the visitor's browser used to call api.github.com itself,
// which handed GitHub every visitor's IP and shared one 60-requests-an-hour
// unauthenticated budget across everyone on the same network. This calls GitHub
// once per cache window from the server instead.
export const prerender = false;

const OWNER = "jx-grxf";
const REQUEST_TIMEOUT_MS = 8000;

// Fifteen minutes of edge cache, a day of stale-while-revalidate. A visitor
// always gets an instant answer, and the worst case upstream is four refreshes
// an hour — about 36 GitHub requests, comfortably inside the 60 an hour a build
// without GITHUB_TOKEN gets, and nothing at all against the 5000 it gets with one.
const CACHE_CONTROL = "public, s-maxage=900, stale-while-revalidate=86400";

// Repositories whose releases are worth surfacing. Asking for the releases of
// all ~26 public repos would spend the rate limit on repos that have none.
const RELEASE_REPOS = ["BriskEdit", "MacPhone", "PatchPilot", "CCrab"];

// How many of the most recently pushed repos get a commit lookup.
const COMMIT_REPOS = 4;

const headers = () => {
  const token = env("GITHUB_TOKEN") ?? env("GH_TOKEN");

  return {
    Accept: "application/vnd.github+json",
    "User-Agent": "johannesgrof-me",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const fetchJson = async (url: string): Promise<unknown> => {
  try {
    const response = await fetch(url, { headers: headers(), signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS) });
    if (!response.ok) {
      console.warn(`[api/github] ${response.status} from ${url}`);
      return undefined;
    }
    return await response.json();
  } catch (error) {
    console.warn(`[api/github] ${error instanceof Error ? error.message : "request failed"} for ${url}`);
    return undefined;
  }
};

export const GET: APIRoute = async () => {
  const [reposData, ...releaseData] = await Promise.all([
    fetchJson(`https://api.github.com/users/${OWNER}/repos?sort=pushed&per_page=100`),
    ...RELEASE_REPOS.map((repo) => fetchJson(`https://api.github.com/repos/${OWNER}/${repo}/releases?per_page=3`)),
  ]);

  const repos = parseRepos(reposData, OWNER);
  const releases = parseReleases(
    RELEASE_REPOS.map((repo, index) => ({ repo, data: releaseData[index] })),
    OWNER,
  );

  // Which repos to ask for commits is only known once the repo list is sorted
  // by push date, so this is a second wave rather than part of the fan-out above.
  // A handful per repo rather than one, so a run of merge commits cannot hide
  // the last commit that actually says something.
  // The profile README repository is rewritten by a scheduled workflow, so its
  // newest commit is never something I pushed.
  const recent = repos.filter((repo) => repo.name.toLowerCase() !== OWNER.toLowerCase()).slice(0, COMMIT_REPOS);
  const commitData = await Promise.all(recent.map((repo) => fetchJson(`https://api.github.com/repos/${OWNER}/${repo.name}/commits?per_page=8`)));
  const commits = parseCommits(
    recent.map((repo, index) => ({ repo: repo.name, data: commitData[index] })),
    OWNER,
  );

  // Every source failing at once means GitHub is down or the token expired.
  // Say so with a status the client can act on, rather than caching an empty
  // feed at the edge for fifteen minutes.
  if (!repos.length && !commits.length && !releases.length) {
    return json(503, { error: "github_unavailable" });
  }

  const feed: WorkshopFeed = { fetchedAt: new Date().toISOString(), repos, commits, releases };

  return json(200, feed, CACHE_CONTROL);
};
