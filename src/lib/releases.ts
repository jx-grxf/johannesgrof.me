export type DownloadPlatform = "macos" | "windows" | "linux" | "archive";
export type DownloadArchitecture = "arm64" | "x64" | "universal";

export interface DownloadAsset {
  kind: DownloadPlatform;
  architecture?: DownloadArchitecture;
}

export function classifyDownload(name: string, platforms: string[] = []): DownloadAsset | undefined {
  // Source archives and update metadata are not application installers.
  if (/(?:^|[-_.])(?:source|src)(?:[-_.]|$)/i.test(name)) return undefined;
  if (!/\.(?:dmg|pkg|app\.zip|exe|msi|msix|zip|tar\.gz|tgz|appimage|deb|rpm)$/i.test(name)) return undefined;

  const architecture = /(?:^|[-_.])(?:aarch64|arm64)(?:[-_.]|$)/i.test(name) ? "arm64"
    : /(?:^|[-_.])(?:x86_64|amd64|x64)(?:[-_.]|$)/i.test(name) ? "x64"
    : /(?:^|[-_.])universal(?:[-_.]|$)/i.test(name) ? "universal" : undefined;
  let kind: DownloadPlatform = "archive";
  if (/\.(?:dmg|pkg|app\.zip)$/i.test(name) || /(?:^|[-_.])(?:macos|darwin|osx)(?:[-_.]|$)/i.test(name)) kind = "macos";
  else if (/\.(?:exe|msi|msix)$/i.test(name) || /(?:^|[-_.])(?:windows|win32|win64)(?:[-_.]|$)/i.test(name)) kind = "windows";
  else if (/\.(?:appimage|deb|rpm)$/i.test(name) || /(?:^|[-_.])linux(?:[-_.]|$)/i.test(name)) kind = "linux";
  else {
    const known = platforms.filter(p => /^(?:macOS|Windows|Linux)(?:\s|$)/i.test(p));
    if (known.length === 1) kind = /^macos/i.test(known[0]!) ? "macos" : /^windows/i.test(known[0]!) ? "windows" : "linux";
  }
  return { kind, architecture };
}

export function downloadPlatformLabel(asset: DownloadAsset, lang: "en" | "de"): string {
  const platform = { macos: "macOS", windows: "Windows", linux: "Linux", archive: lang === "de" ? "Paket" : "Package" }[asset.kind];
  const architecture = asset.architecture === "arm64" ? (asset.kind === "macos" ? "Apple Silicon" : "ARM64")
    : asset.architecture === "x64" ? (asset.kind === "macos" ? "Intel" : "x64")
    : asset.architecture === "universal" ? "Universal" : undefined;
  return architecture ? `${platform} · ${architecture}` : platform;
}

export function downloadLabel(asset: DownloadAsset, name: string, lang: "en" | "de"): string {
  const platform = downloadPlatformLabel(asset, lang);
  const format = name.match(/\.(tar\.gz|tgz|zip|dmg|pkg|exe|msi|msix|appimage|deb|rpm)$/i)?.[1]?.toUpperCase();
  if (asset.kind === "archive") return `${lang === "de" ? "Paket laden" : "Download package"}${format ? ` · ${format}` : ""}`;
  return `${lang === "de" ? "Für" : "For"} ${platform}`;
}

export function downloadSize(bytes: number, lang: "en" | "de"): string {
  if (!bytes) return "GitHub Releases";
  const size = new Intl.NumberFormat(lang === "de" ? "de-AT" : "en", { maximumFractionDigits: bytes >= 10 * 1024 * 1024 ? 0 : 1 }).format(bytes / 1024 / 1024);
  return `${size} MB · GitHub Releases`;
}
