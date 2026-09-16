import assert from "node:assert/strict";
import test from "node:test";
import { parseCommits, parseReleases, parseRepos } from "../src/lib/githubFeed.ts";

const repo = (overrides: Record<string, unknown> = {}) => ({
  name: "BriskEdit",
  description: "A native macOS editor",
  language: "Swift",
  stargazers_count: 3,
  pushed_at: "2026-09-05T21:57:46Z",
  private: false,
  fork: false,
  archived: false,
  ...overrides,
});

test("only public, non-fork, non-archived repositories reach the feed", () => {
  const feed = parseRepos(
    [repo(), repo({ name: "a-fork", fork: true }), repo({ name: "old", archived: true }), repo({ name: "secret", private: true })],
    "jx-grxf",
  );

  assert.deepEqual(
    feed.map((entry) => entry.name),
    ["BriskEdit"],
  );
  assert.equal(feed[0]!.url, "https://github.com/jx-grxf/BriskEdit");
});

test("repositories are ordered by most recent push", () => {
  const feed = parseRepos(
    [repo({ name: "older", pushed_at: "2026-01-01T00:00:00Z" }), repo({ name: "newest", pushed_at: "2026-09-08T00:00:00Z" }), repo({ name: "middle", pushed_at: "2026-05-01T00:00:00Z" })],
    "jx-grxf",
  );

  assert.deepEqual(
    feed.map((entry) => entry.name),
    ["newest", "middle", "older"],
  );
});

test("a repository name that could break out of a URL is dropped", () => {
  const feed = parseRepos([repo({ name: "../../evil" }), repo({ name: "a b" })], "jx-grxf");

  assert.deepEqual(feed, []);
});

test("malformed payloads produce an empty feed rather than throwing", () => {
  assert.deepEqual(parseRepos(null, "jx-grxf"), []);
  assert.deepEqual(parseRepos({ message: "Not Found" }, "jx-grxf"), []);
  assert.deepEqual(parseRepos([null, 42, "nope"], "jx-grxf"), []);
  assert.deepEqual(parseRepos([repo({ pushed_at: "not a date" })], "jx-grxf"), []);
});

const commit = (overrides: Record<string, unknown> = {}) => ({
  sha: "86ced5978b1494adad8d902a3e02df7131136684",
  commit: { message: "fix(ui): repair the resize handle\n\nLonger body text", author: { date: "2026-09-05T21:57:46Z" } },
  ...overrides,
});

test("a commit contributes only its summary line", () => {
  const [entry] = parseCommits([{ repo: "BriskEdit", data: [commit()] }], "jx-grxf");

  assert.equal(entry!.message, "fix(ui): repair the resize handle");
  assert.equal(entry!.repo, "BriskEdit");
  assert.equal(entry!.url, "https://github.com/jx-grxf/BriskEdit/commit/86ced5978b1494adad8d902a3e02df7131136684");
});

test("commits are merged across repositories, newest first, and capped", () => {
  const entries = parseCommits(
    [
      { repo: "one", data: [commit({ commit: { message: "old", author: { date: "2026-01-01T00:00:00Z" } } })] },
      { repo: "two", data: [commit({ commit: { message: "new", author: { date: "2026-09-08T00:00:00Z" } } })] },
    ],
    "jx-grxf",
    1,
  );

  assert.equal(entries.length, 1);
  assert.equal(entries[0]!.message, "new");
});

test("a commit with no sha, message or date is skipped", () => {
  assert.deepEqual(parseCommits([{ repo: "one", data: [commit({ sha: "zzz" })] }], "jx-grxf"), []);
  assert.deepEqual(parseCommits([{ repo: "one", data: [commit({ commit: { message: "", author: { date: "2026-09-08T00:00:00Z" } } })] }], "jx-grxf"), []);
  assert.deepEqual(parseCommits([{ repo: "one", data: [commit({ commit: { message: "hi" } })] }], "jx-grxf"), []);
  assert.deepEqual(parseCommits([{ repo: "one", data: [] }], "jx-grxf"), []);
});

test("releases sort across repositories and drop drafts", () => {
  const releases = parseReleases(
    [
      { repo: "BriskEdit", data: [{ tag_name: "v0.6.0", name: "BriskEdit 0.6.0", published_at: "2026-09-05T22:05:47Z", prerelease: false }] },
      { repo: "NotchTray", data: [{ tag_name: "v1.0.0", published_at: "2026-08-02T18:53:05Z", prerelease: false }] },
      { repo: "Draft", data: [{ tag_name: "v9", published_at: "2026-09-09T00:00:00Z", draft: true }] },
    ],
    "jx-grxf",
  );

  assert.deepEqual(
    releases.map((entry) => entry.repo),
    ["BriskEdit", "NotchTray"],
  );
  // A release without a name falls back to its tag.
  assert.equal(releases[1]!.name, "v1.0.0");
});

test("a release tag is escaped into its URL", () => {
  const [release] = parseReleases([{ repo: "Tools", data: [{ tag_name: "v1.0 beta", published_at: "2026-09-05T00:00:00Z" }] }], "jx-grxf");

  assert.equal(release!.url, "https://github.com/jx-grxf/Tools/releases/tag/v1.0%20beta");
});

test("merge commits and bots are skipped in favour of the newest real commit", () => {
  const merge = {
    sha: "1111111111111111111111111111111111111111",
    parents: [{ sha: "a" }, { sha: "b" }],
    commit: { message: "Merge pull request #52 from jx-grxf/dependabot/npm_and_yarn/promo", author: { date: "2026-09-09T10:00:00Z" } },
  };
  const bot = {
    sha: "2222222222222222222222222222222222222222",
    author: { login: "dependabot[bot]" },
    commit: { message: "bump nanoid from 3.3.7 to 3.3.18", author: { date: "2026-09-08T10:00:00Z" } },
  };
  const real = {
    sha: "3333333333333333333333333333333333333333",
    commit: { message: "fix(editor): keep the caret visible while wrapping", author: { date: "2026-09-07T10:00:00Z" } },
  };

  const [entry] = parseCommits([{ repo: "BriskEdit", data: [merge, bot, real] }], "jx-grxf");

  assert.equal(entry!.message, "fix(editor): keep the caret visible while wrapping");
  assert.ok(entry!.url.endsWith("/commit/3333333333333333333333333333333333333333"));
});

test("a repository with nothing but merges still appears", () => {
  const merge = (sha: string, date: string) => ({
    sha,
    parents: [{ sha: "a" }, { sha: "b" }],
    commit: { message: `Merge branch 'main' into ${sha}`, author: { date } },
  });

  const [entry] = parseCommits(
    [{ repo: "homebrew-tap", data: [merge("4444444444444444444444444444444444444444", "2026-09-09T10:00:00Z"), merge("5555555555555555555555555555555555555555", "2026-09-01T10:00:00Z")] }],
    "jx-grxf",
  );

  assert.equal(entry!.repo, "homebrew-tap");
  assert.ok(entry!.message.startsWith("Merge branch"));
});

test("a commit a hosting service wrote on repository creation is skipped", () => {
  const generated = {
    sha: "6666666666666666666666666666666666666666",
    commit: { message: "Initial commit from Mintlify hosted docs", author: { date: "2026-09-16T14:46:29Z" } },
  };
  const real = {
    sha: "7777777777777777777777777777777777777777",
    commit: { message: "docs: describe the install steps", author: { date: "2026-09-16T15:00:00Z" } },
  };

  const [entry] = parseCommits([{ repo: "docs", data: [generated, real] }], "jx-grxf");

  assert.equal(entry!.message, "docs: describe the install steps");
});

test("a repository holding only its generated first commit is left out", () => {
  const generated = {
    sha: "8888888888888888888888888888888888888888",
    commit: { message: "Initial commit from Mintlify hosted docs", author: { date: "2026-09-16T14:46:29Z" } },
  };

  assert.equal(parseCommits([{ repo: "docs", data: [generated] }], "jx-grxf").length, 0);
});
