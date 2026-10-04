import type { Project } from "./projects";
import { classifyDownload, type DownloadArchitecture, type DownloadPlatform } from "../lib/releases";

interface GitHubAsset {
  name: string;
  browser_download_url: string;
  size: number;
  download_count?: number;
}

interface GitHubRelease {
  tag_name: string;
  name?: string;
  html_url: string;
  prerelease: boolean;
  published_at: string;
  assets: GitHubAsset[];
}

interface GitHubRepo {
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  html_url: string;
  pushed_at: string;
}

interface GitHubFetchOptions {
  warnOnFailure?: boolean;
}

export interface ProjectReleaseDownload {
  tag: string;
  name: string;
  url: string;
  assetName: string;
  assetUrl: string;
  size: number;
  kind: DownloadPlatform;
  architecture?: DownloadArchitecture;
  prerelease: boolean;
}

export interface ProjectReleaseGroup {
  versionBase: string;
  stable?: ProjectReleaseDownload;
  stableDownloads: ProjectReleaseDownload[];
  prereleases: ProjectReleaseDownload[];
}

export interface ProjectCommand {
  label: string;
  command: string;
}

export interface ProjectGitHubInfo {
  metadataState: "live" | "partial" | "fallback";
  version: string;
  releaseUrl: string;
  stars: number;
  forks: number;
  language: string;
  updatedAt: string;
  downloadGroup?: ProjectReleaseGroup;
  commands: ProjectCommand[];
}

const gitHubHeaders = () => {
  const token = import.meta.env.GITHUB_TOKEN ?? import.meta.env.GH_TOKEN;

  return {
    Accept: "application/vnd.github+json",
    "User-Agent": "johannesgrof-me-build",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const requestTimeoutMs = 8000;
const warnedFallbacks = new Set<string>();

const normalizeRepoName = (repo: Project["repo"]) => repo.split("/")[1] ?? repo;

const extractVersionBase = (value: string) => {
  const match = value.match(/\d+(?:\.\d+)*/);
  return match?.[0] ?? value.toLowerCase();
};

const getAssetPriority = (asset: GitHubAsset) => {
  if (/\.dmg$/i.test(asset.name)) {
    return 0;
  }

  if (classifyDownload(asset.name)?.kind === "macos") {
    return 1;
  }

  if (/\.pkg$/i.test(asset.name)) {
    return 2;
  }

  if (/\.(?:exe|msi|msix)$/i.test(asset.name)) {
    return 3;
  }

  if (classifyDownload(asset.name)?.kind === "archive") {
    return 4;
  }

  return 99;
};

const warnFallback = (project: Project, reason: string) => {
  const key = `${project.repo}:${reason}`;

  if (warnedFallbacks.has(key)) {
    return;
  }

  warnedFallbacks.add(key);
  console.warn(`[github] using fallback data for ${project.repo}: ${reason}`);
};

const fetchGitHubJson = async <T>(url: string, project: Project, options: GitHubFetchOptions = {}): Promise<T | undefined> => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), requestTimeoutMs);

  try {
    const response = await fetch(url, {
      headers: gitHubHeaders(),
      signal: controller.signal,
    });

    if (!response.ok) {
      if (options.warnOnFailure) {
        warnFallback(project, `${response.status} ${response.statusText} from ${url}`);
      }

      return undefined;
    }

    return (await response.json()) as T;
  } catch (error) {
    if (options.warnOnFailure) {
      const reason = error instanceof Error ? error.message : "unknown fetch error";
      warnFallback(project, reason);
    }

    return undefined;
  } finally {
    clearTimeout(timeout);
  }
};

const toDownload = (release: GitHubRelease, asset: GitHubAsset, project: Project): ProjectReleaseDownload | undefined => {
  const classification = classifyDownload(asset.name, project.npmPackage ? [] : project.platformLabels);

  if (!classification) {
    return undefined;
  }

  return {
    tag: release.tag_name,
    name: release.name || release.tag_name,
    url: release.html_url,
    assetName: asset.name,
    assetUrl: asset.browser_download_url,
    size: asset.size,
    ...classification,
    prerelease: release.prerelease,
  };
};

const buildFallbackDownloadGroup = (project: Project): ProjectReleaseGroup | undefined => {
  const fallbackDownloads = project.fallbackDownloads ?? (project.fallbackDownload ? [project.fallbackDownload] : []);

  if (fallbackDownloads.length === 0) {
    return undefined;
  }

  const downloads: ProjectReleaseDownload[] = fallbackDownloads
    .map((fallbackDownload) => ({
      tag: project.fallbackVersion,
      name: project.fallbackVersion,
      url: project.releaseUrl,
      assetName: fallbackDownload.assetName,
      assetUrl: fallbackDownload.assetUrl,
      size: fallbackDownload.size,
      ...(classifyDownload(fallbackDownload.assetName, project.platformLabels) ?? { kind: fallbackDownload.kind }),
      prerelease: false,
    }))
    .sort((a, b) => getAssetPriority({ name: a.assetName, browser_download_url: a.assetUrl, size: 0 }) - getAssetPriority({ name: b.assetName, browser_download_url: b.assetUrl, size: 0 }) || a.assetName.localeCompare(b.assetName));

  return {
    versionBase: extractVersionBase(project.fallbackVersion),
    stable: downloads[0],
    stableDownloads: downloads,
    prereleases: [],
  };
};

const buildFallbackInfo = (project: Project): ProjectGitHubInfo => {
  const downloadGroup = project.downloadsDisabled ? undefined : buildFallbackDownloadGroup(project);

  return {
    metadataState: "fallback",
    version: project.fallbackVersion,
    releaseUrl: project.releaseUrl,
    stars: 0,
    forks: 0,
    language: project.stack[0] ?? "Code",
    updatedAt: "",
    downloadGroup,
    commands: buildCommands(project),
  };
};

const getReleaseDownloads = (release: GitHubRelease, project: Project) =>
  release.assets
    .map((asset) => toDownload(release, asset, project))
    .filter((download): download is ProjectReleaseDownload => Boolean(download))
    .sort((a, b) => getAssetPriority({ name: a.assetName, browser_download_url: a.assetUrl, size: 0 }) - getAssetPriority({ name: b.assetName, browser_download_url: b.assetUrl, size: 0 }) || a.assetName.localeCompare(b.assetName));

const buildDownloadGroup = (releases: GitHubRelease[], project: Project): ProjectReleaseGroup | undefined => {
  const releaseDownloads = releases
    .flatMap((release) => getReleaseDownloads(release, project));

  const stable = releaseDownloads.find((download) => !download.prerelease);
  const prerelease = releaseDownloads.find((download) => download.prerelease);
  const primary = stable ?? prerelease ?? releaseDownloads[0];

  if (!primary) {
    return undefined;
  }

  const versionBase = extractVersionBase(primary.tag);
  const stableDownloads = releaseDownloads.filter(
    (download) => !download.prerelease && download.tag === primary.tag
  );
  const prereleases = releaseDownloads.filter(
    (download) => download.prerelease && download.tag === prerelease?.tag
  );

  return {
    versionBase,
    stable: stableDownloads[0] ?? stable,
    stableDownloads,
    prereleases,
  };
};

// Only the commands someone would actually type. This used to emit up to seven
// blocks per project — git clone and gh repo clone for the same job, `open` on
// a release URL that is already a button, and a `gh release download` naming
// the exact asset the download button hands over. That is documentation-shaped
// filler, not documentation.
const buildCommands = (project: Project): ProjectCommand[] => {
  const repoName = normalizeRepoName(project.repo);
  const commands: ProjectCommand[] = [];

  // Planned/private repos have no clonable source yet — skip the clone command
  // so the page never points at a 404.
  if (project.downloadsDisabled || project.visibility !== "public") {
    return commands;
  }

  if (project.npmPackage) {
    commands.push({
      label: "install",
      command: `npm install -g ${project.npmPackage}`,
    });
  }

  commands.push({
    label: "clone",
    command: `git clone https://github.com/${project.repo}.git && cd ${repoName}`,
  });

  return commands;
};

// One build renders both locales of the homepage plus two project pages per
// project, and each of those asked GitHub again — well past the 60 requests an
// hour an unauthenticated build gets, so nearly every card fell back to static
// data. Resolve each repo once per build and share the result.
const infoByRepo = new Map<string, Promise<ProjectGitHubInfo>>();

export function getProjectGitHubInfo(project: Project): Promise<ProjectGitHubInfo> {
  const cached = infoByRepo.get(project.repo);

  if (cached) {
    return cached;
  }

  const pending = fetchProjectGitHubInfo(project);
  infoByRepo.set(project.repo, pending);

  return pending;
}

async function fetchProjectGitHubInfo(project: Project): Promise<ProjectGitHubInfo> {
  const fallback = buildFallbackInfo(project);

  if (project.visibility !== "public") {
    return fallback;
  }

  try {
    if (project.downloadsDisabled) {
      const repo = await fetchGitHubJson<GitHubRepo>(`https://api.github.com/repos/${project.repo}`, project, { warnOnFailure: true });

      return {
        ...fallback,
        metadataState: repo ? "live" : fallback.metadataState,
        stars: repo?.stargazers_count ?? fallback.stars,
        forks: repo?.forks_count ?? fallback.forks,
        language: repo?.language ?? fallback.language,
        updatedAt: repo?.pushed_at ?? fallback.updatedAt,
      };
    }

    const [repo, releases] = await Promise.all([
      fetchGitHubJson<GitHubRepo>(`https://api.github.com/repos/${project.repo}`, project, { warnOnFailure: true }),
      fetchGitHubJson<GitHubRelease[]>(`https://api.github.com/repos/${project.repo}/releases?per_page=10`, project, {
        warnOnFailure: true,
      }),
    ]);

    if (!repo) {
      return fallback;
    }

    const releaseList = releases ?? [];
    const release = releaseList.find((item) => !item.prerelease) ?? releaseList[0];
    const releaseUrl = release?.html_url ?? fallback.releaseUrl;
    const releaseDownloadGroup = buildDownloadGroup(releaseList, project);
    const downloadGroup = releaseDownloadGroup ?? fallback.downloadGroup;
    const metadataState = releases ? "live" : "partial";

    return {
      metadataState,
      version: release?.tag_name ?? fallback.version,
      releaseUrl,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      language: repo.language ?? fallback.language,
      updatedAt: repo.pushed_at,
      downloadGroup,
      commands: buildCommands(project),
    };
  } catch (error) {
    const reason = error instanceof Error ? error.message : "unknown GitHub data error";
    warnFallback(project, reason);
    return fallback;
  }
}
