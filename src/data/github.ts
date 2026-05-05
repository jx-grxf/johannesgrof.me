import type { Project } from "./projects";

interface GitHubAsset {
  name: string;
  browser_download_url: string;
  size: number;
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

export interface ProjectReleaseDownload {
  tag: string;
  name: string;
  url: string;
  assetName: string;
  assetUrl: string;
  label: string;
  detail: string;
  kind: "macos" | "windows" | "archive" | "release";
  prerelease: boolean;
}

export interface ProjectReleaseGroup {
  versionBase: string;
  stable?: ProjectReleaseDownload;
  prereleases: ProjectReleaseDownload[];
}

export interface ProjectCommand {
  label: string;
  command: string;
}

export interface ProjectGitHubInfo {
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

const normalizeRepoName = (repo: Project["repo"]) => repo.split("/")[1] ?? repo;

const extractVersionBase = (value: string) => {
  const match = value.match(/\d+(?:\.\d+)*/);
  return match?.[0] ?? value.toLowerCase();
};

const isSourceArchive = (assetName: string) => /(?:source|src)[-.].*\.(?:zip|tar\.gz)$/i.test(assetName);

const classifyAsset = (assetName: string): ProjectReleaseDownload["kind"] | null => {
  if (/\.dmg$/i.test(assetName)) {
    return "macos";
  }

  if (/\.exe$/i.test(assetName)) {
    return "windows";
  }

  if (/\.(?:zip|tar\.gz)$/i.test(assetName) && !isSourceArchive(assetName)) {
    return "archive";
  }

  return null;
};

const getAssetPriority = (asset: GitHubAsset) => {
  if (/\.dmg$/i.test(asset.name)) {
    return 0;
  }

  if (/\.exe$/i.test(asset.name)) {
    return 1;
  }

  if (/\.(?:zip|tar\.gz)$/i.test(asset.name) && !isSourceArchive(asset.name)) {
    return 2;
  }

  return 99;
};

const findBestDownloadAsset = (release: GitHubRelease) =>
  release.assets
    .filter((asset) => classifyAsset(asset.name) !== null)
    .sort((a, b) => getAssetPriority(a) - getAssetPriority(b) || a.name.localeCompare(b.name))[0];

const formatBytes = (bytes: number) => {
  if (!bytes) {
    return "GitHub release asset";
  }

  const mib = bytes / 1024 / 1024;
  return `${mib >= 10 ? Math.round(mib) : mib.toFixed(1)} MB from GitHub Releases`;
};

const labelForAsset = (assetName: string, kind: ProjectReleaseDownload["kind"]) => {
  if (kind === "macos") {
    return "Download DMG";
  }

  if (kind === "windows") {
    return "Download EXE";
  }

  const extension = assetName.match(/\.(tar\.gz|zip)$/i)?.[1]?.toUpperCase() ?? "Asset";
  return `Download ${extension}`;
};

const toDownload = (release: GitHubRelease, asset: GitHubAsset): ProjectReleaseDownload | undefined => {
  const kind = classifyAsset(asset.name);

  if (!kind) {
    return undefined;
  }

  return {
    tag: release.tag_name,
    name: release.name || release.tag_name,
    url: release.html_url,
    assetName: asset.name,
    assetUrl: asset.browser_download_url,
    label: labelForAsset(asset.name, kind),
    detail: formatBytes(asset.size),
    kind,
    prerelease: release.prerelease,
  };
};

const buildDownloadGroup = (releases: GitHubRelease[]): ProjectReleaseGroup | undefined => {
  const releaseDownloads = releases
    .map((release) => {
      const asset = findBestDownloadAsset(release);
      return asset ? toDownload(release, asset) : undefined;
    })
    .filter((download): download is ProjectReleaseDownload => Boolean(download));

  const stable = releaseDownloads.find((download) => !download.prerelease);
  const primary = stable ?? releaseDownloads[0];

  if (!primary) {
    return undefined;
  }

  const versionBase = extractVersionBase(primary.tag);
  const prereleases = releaseDownloads.filter(
    (download) => download.prerelease && extractVersionBase(download.tag) === versionBase
  );

  return {
    versionBase,
    stable,
    prereleases,
  };
};

const buildCommands = (project: Project, releaseUrl: string, downloadGroup?: ProjectReleaseGroup): ProjectCommand[] => {
  const repoName = normalizeRepoName(project.repo);
  const commands: ProjectCommand[] = [
    {
      label: "source without GitHub CLI",
      command: `git clone https://github.com/${project.repo}.git && cd ${repoName}`,
    },
    {
      label: "source with GitHub CLI",
      command: `gh repo clone ${project.repo} && cd ${repoName}`,
    },
    {
      label: "latest release",
      command: `open ${releaseUrl}`,
    },
  ];

  const download = downloadGroup?.stable ?? downloadGroup?.prereleases[0];

  if (download) {
    commands.push({
      label: `download ${download.prerelease ? "pre-release" : "stable"} with GitHub CLI`,
      command: `gh release download ${download.tag} -R ${project.repo} -p '${download.assetName}'`,
    });
  }

  return commands;
};

export async function getProjectGitHubInfo(project: Project): Promise<ProjectGitHubInfo> {
  const fallback: ProjectGitHubInfo = {
    version: project.fallbackVersion,
    releaseUrl: project.releaseUrl,
    stars: 0,
    forks: 0,
    language: project.stack[0] ?? "Code",
    updatedAt: "",
    commands: buildCommands(project, project.releaseUrl),
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
    const releaseUrl = release?.html_url ?? fallback.releaseUrl;
    const downloadGroup = buildDownloadGroup(releases);

    return {
      version: release?.tag_name ?? fallback.version,
      releaseUrl,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      language: repo.language ?? fallback.language,
      updatedAt: repo.pushed_at,
      downloadGroup,
      commands: buildCommands(project, releaseUrl, downloadGroup),
    };
  } catch {
    return fallback;
  }
}
