import type { Project } from "./projects";

interface GitHubRelease {
  tag_name: string;
  name?: string;
  html_url: string;
  prerelease: boolean;
  published_at: string;
}

interface GitHubRepo {
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  html_url: string;
  pushed_at: string;
}

export interface ProjectGitHubInfo {
  version: string;
  releaseUrl: string;
  stars: number;
  forks: number;
  language: string;
  updatedAt: string;
}

const gitHubHeaders = () => {
  const token = import.meta.env.GITHUB_TOKEN ?? import.meta.env.GH_TOKEN;

  return {
    Accept: "application/vnd.github+json",
    "User-Agent": "johannesgrof-me-build",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export async function getProjectGitHubInfo(project: Project): Promise<ProjectGitHubInfo> {
  const fallback: ProjectGitHubInfo = {
    version: project.fallbackVersion,
    releaseUrl: `${project.githubUrl}/releases`,
    stars: 0,
    forks: 0,
    language: project.stack[0] ?? "Code",
    updatedAt: "",
  };

  try {
    const [repoResponse, releaseResponse] = await Promise.all([
      fetch(`https://api.github.com/repos/${project.repo}`, { headers: gitHubHeaders() }),
      fetch(`https://api.github.com/repos/${project.repo}/releases`, { headers: gitHubHeaders() }),
    ]);

    if (!repoResponse.ok) {
      return fallback;
    }

    const repo = (await repoResponse.json()) as GitHubRepo;
    const releases = releaseResponse.ok ? ((await releaseResponse.json()) as GitHubRelease[]) : [];
    const release = releases.find((item) => !item.prerelease) ?? releases[0];

    return {
      version: release?.tag_name ?? fallback.version,
      releaseUrl: release?.html_url ?? fallback.releaseUrl,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      language: repo.language ?? fallback.language,
      updatedAt: repo.pushed_at,
    };
  } catch {
    return fallback;
  }
}
