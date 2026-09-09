/** Shapes the desktop's Workshop window reads. Everything here is derived from
 *  public GitHub data on the server, so the visitor's browser never talks to
 *  github.com and the site's connect-src can stay 'self'. */

export interface FeedRepo {
  name: string;
  description: string;
  language: string;
  stars: number;
  pushedAt: string;
  url: string;
}

export interface FeedCommit {
  repo: string;
  message: string;
  at: string;
  url: string;
}

export interface FeedRelease {
  repo: string;
  tag: string;
  name: string;
  at: string;
  url: string;
  prerelease: boolean;
}

export interface WorkshopFeed {
  fetchedAt: string;
  repos: FeedRepo[];
  commits: FeedCommit[];
  releases: FeedRelease[];
}

const asRecord = (value: unknown): Record<string, unknown> | null =>
  value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : null;

const text = (value: unknown, max: number) => (typeof value === "string" ? value.slice(0, max) : "");

const isoDate = (value: unknown) =>
  typeof value === "string" && Number.isFinite(Date.parse(value)) ? value : "";

/** GitHub's own repo names are already URL-safe, but this feed is rendered into
 *  hrefs, so anything with a surprise in it is dropped rather than escaped. */
const isRepoName = (value: unknown): value is string => typeof value === "string" && /^[\w.-]{1,100}$/.test(value);

/** Public, non-fork, non-archived repositories, newest push first. */
export function parseRepos(data: unknown, owner: string): FeedRepo[] {
  if (!Array.isArray(data)) return [];

  return data
    .flatMap((entry) => {
      const repo = asRecord(entry);
      if (!repo) return [];
      if (repo.private !== false || repo.fork !== false || repo.archived !== false) return [];
      if (!isRepoName(repo.name)) return [];

      const pushedAt = isoDate(repo.pushed_at);
      if (!pushedAt) return [];

      return [
        {
          name: repo.name,
          description: text(repo.description, 300),
          language: text(repo.language, 40),
          stars: typeof repo.stargazers_count === "number" && Number.isFinite(repo.stargazers_count) ? Math.max(0, Math.trunc(repo.stargazers_count)) : 0,
          pushedAt,
          url: `https://github.com/${owner}/${repo.name}`,
        } satisfies FeedRepo,
      ];
    })
    .sort((a, b) => Date.parse(b.pushedAt) - Date.parse(a.pushedAt));
}

/** The newest commit of each repository, one entry per repo so a single busy
 *  afternoon cannot fill the whole list.
 *
 *  This reads the per-repo commits API rather than the account's public events
 *  feed: a PushEvent payload now carries only `ref`, `head` and `before`, with
 *  no commit array, so the events feed can no longer name what was actually
 *  pushed. */
export function parseCommits(entries: { repo: string; data: unknown }[], owner: string, limit = 4): FeedCommit[] {
  const commits = entries.flatMap(({ repo, data }) => {
    if (!Array.isArray(data) || !isRepoName(repo)) return [];

    const newest = asRecord(data[0]);
    if (!newest) return [];

    const sha = text(newest.sha, 40);
    if (!/^[0-9a-f]{7,40}$/.test(sha)) return [];

    const detail = asRecord(newest.commit);
    // Only the summary line: commit bodies run long and the widget shows one row.
    const message = text(detail?.message, 300).split("\n")[0]!.trim();
    const at = isoDate(asRecord(detail?.author)?.date) || isoDate(asRecord(detail?.committer)?.date);
    if (!message || !at) return [];

    return [{ repo, message: message.slice(0, 120), at, url: `https://github.com/${owner}/${repo}/commit/${sha}` } satisfies FeedCommit];
  });

  return commits.sort((a, b) => Date.parse(b.at) - Date.parse(a.at)).slice(0, limit);
}

/** Releases arrive per repo; this flattens and sorts them across the account. */
export function parseReleases(entries: { repo: string; data: unknown }[], owner: string, limit = 4): FeedRelease[] {
  const releases = entries.flatMap(({ repo, data }) => {
    if (!Array.isArray(data) || !isRepoName(repo)) return [];

    return data.flatMap((entry) => {
      const release = asRecord(entry);
      if (!release || release.draft === true) return [];

      const tag = text(release.tag_name, 60);
      const at = isoDate(release.published_at);
      if (!tag || !at) return [];

      return [
        {
          repo,
          tag,
          name: text(release.name, 120) || tag,
          at,
          url: `https://github.com/${owner}/${repo}/releases/tag/${encodeURIComponent(tag)}`,
          prerelease: release.prerelease === true,
        } satisfies FeedRelease,
      ];
    });
  });

  return releases.sort((a, b) => Date.parse(b.at) - Date.parse(a.at)).slice(0, limit);
}

/** Guards the client against a truncated or reshaped payload: an empty feed
 *  renders the saved snapshot instead of throwing inside the render loop. */
export function isWorkshopFeed(value: unknown): value is WorkshopFeed {
  const feed = asRecord(value);

  return Boolean(
    feed &&
      typeof feed.fetchedAt === "string" &&
      Array.isArray(feed.repos) &&
      Array.isArray(feed.commits) &&
      Array.isArray(feed.releases),
  );
}
