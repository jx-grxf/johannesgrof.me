// A year of GitHub activity as a pixel grid. Pure helpers, so the shaping
// can be tested without the API.

export interface CalendarDay {
  date: string;
  contributionCount: number;
}

export interface RepoContributions {
  repository: { name: string; isPrivate: boolean };
  contributions: { nodes: { occurredAt: string; commitCount: number }[] };
}

export interface GridDay {
  date: string;
  count: number;
  /** 0 for none, 1 to 4 by quartile of the active days. */
  level: 0 | 1 | 2 | 3 | 4;
  /** Public repos with commits that day, most commits first. Private repos never appear by name. */
  repos: string[];
}

export interface ContributionGrid {
  weeks: GridDay[][];
  total: number;
  activeDays: number;
  longestStreak: number;
  currentStreak: number;
  busiest: { date: string; count: number } | null;
  from: string;
  to: string;
}

const viennaDate = (iso: string) =>
  new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Vienna", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date(iso));

const quantile = (sorted: number[], q: number) => sorted[Math.min(sorted.length - 1, Math.floor(q * sorted.length))] ?? 0;

export function buildContributionGrid(weeks: { contributionDays: CalendarDay[] }[], repos: RepoContributions[]): ContributionGrid {
  const commitsByDay = new Map<string, Map<string, number>>();
  for (const repo of repos) {
    if (repo.repository.isPrivate) continue;
    for (const node of repo.contributions.nodes) {
      const day = viennaDate(node.occurredAt);
      const perRepo = commitsByDay.get(day) ?? new Map<string, number>();
      perRepo.set(repo.repository.name, (perRepo.get(repo.repository.name) ?? 0) + node.commitCount);
      commitsByDay.set(day, perRepo);
    }
  }

  const days = weeks.flatMap((week) => week.contributionDays);
  const active = days.map((day) => day.contributionCount).filter((count) => count > 0).sort((a, b) => a - b);
  const cuts = [quantile(active, 0.25), quantile(active, 0.5), quantile(active, 0.75)];
  const level = (count: number): GridDay["level"] => {
    if (count <= 0) return 0;
    if (count <= cuts[0]!) return 1;
    if (count <= cuts[1]!) return 2;
    if (count <= cuts[2]!) return 3;
    return 4;
  };

  let longestStreak = 0;
  let run = 0;
  for (const day of days) {
    run = day.contributionCount > 0 ? run + 1 : 0;
    longestStreak = Math.max(longestStreak, run);
  }
  // Today may still be empty in the morning; the streak counts until yesterday then.
  let currentStreak = 0;
  for (let i = days.length - 1; i >= 0; i--) {
    if (days[i]!.contributionCount > 0) currentStreak++;
    else if (i === days.length - 1) continue;
    else break;
  }

  const busiestDay = days.reduce<CalendarDay | null>((best, day) => (!best || day.contributionCount > best.contributionCount ? day : best), null);

  return {
    weeks: weeks.map((week) =>
      week.contributionDays.map((day) => ({
        date: day.date,
        count: day.contributionCount,
        level: level(day.contributionCount),
        repos: [...(commitsByDay.get(day.date) ?? new Map<string, number>()).entries()].sort((a, b) => b[1] - a[1]).map(([name]) => name),
      })),
    ),
    total: days.reduce((sum, day) => sum + day.contributionCount, 0),
    activeDays: active.length,
    longestStreak,
    currentStreak,
    busiest: busiestDay && busiestDay.contributionCount > 0 ? { date: busiestDay.date, count: busiestDay.contributionCount } : null,
    from: days[0]?.date ?? "",
    to: days.at(-1)?.date ?? "",
  };
}
