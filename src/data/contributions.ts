import { buildContributionGrid, type CalendarDay, type ContributionGrid, type RepoContributions } from "@/lib/contributions";

// Read once per build. The calendar counts are the same ones GitHub shows on
// the public profile; repo names are only kept for public repos.
const QUERY = `query {
  user(login: "jx-grxf") {
    contributionsCollection {
      contributionCalendar { weeks { contributionDays { date contributionCount } } }
      commitContributionsByRepository(maxRepositories: 40) {
        repository { name isPrivate }
        contributions(first: 100, orderBy: { field: OCCURRED_AT, direction: DESC }) { nodes { occurredAt commitCount } }
      }
    }
  }
}`;

let cached: Promise<ContributionGrid | null> | undefined;

async function load(): Promise<ContributionGrid | null> {
  const token = import.meta.env.GITHUB_TOKEN ?? import.meta.env.GH_TOKEN;
  if (!token) return null;
  try {
    const response = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", "User-Agent": "johannesgrof-me-build" },
      body: JSON.stringify({ query: QUERY }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!response.ok) throw new Error(`${response.status}`);
    const body = await response.json();
    const collection = body?.data?.user?.contributionsCollection;
    if (!collection) throw new Error(body?.errors?.[0]?.message ?? "no data");
    return buildContributionGrid(
      collection.contributionCalendar.weeks as { contributionDays: CalendarDay[] }[],
      collection.commitContributionsByRepository as RepoContributions[],
    );
  } catch (error) {
    console.warn(`[github] contribution grid left out: ${(error as Error).message}`);
    return null;
  }
}

export const getContributionGrid = () => (cached ??= load());
