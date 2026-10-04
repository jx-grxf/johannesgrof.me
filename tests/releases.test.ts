import test from "node:test";
import assert from "node:assert/strict";
import { classifyDownload, downloadPlatformLabel } from "../src/lib/releases.ts";

test("real cross-platform release files identify platform and architecture", () => {
  const cases = [
    ["agent-presence-v0.3.0-aarch64-apple-darwin.tar.gz", "macos", "arm64", "macOS · Apple Silicon"],
    ["agent-presence-v0.3.0-x86_64-apple-darwin.tar.gz", "macos", "x64", "macOS · Intel"],
    ["agent-presence-v0.3.0-x86_64-pc-windows-msvc.zip", "windows", "x64", "Windows · x64"],
    ["agent-presence-v0.3.0-x86_64-unknown-linux-gnu.tar.gz", "linux", "x64", "Linux · x64"],
  ];
  for (const [name, kind, architecture, label] of cases) {
    const asset = classifyDownload(name!);
    assert.equal(asset?.kind, kind);
    assert.equal(asset?.architecture, architecture);
    assert.equal(downloadPlatformLabel(asset!, "de"), label);
  }
});

test("source archives, updater feeds and checksums are not app downloads", () => {
  for (const name of ["SlamX-0.3.5-source.zip", "SlamX-0.3.5-source.tar.gz", "source-code.zip", "appcast.xml", "SHA256SUMS", "appcast.xml.sig"]) {
    assert.equal(classifyDownload(name), undefined, name);
  }
});

test("a plain archive uses an explicit single platform without guessing for multiple platforms", () => {
  assert.equal(classifyDownload("BriskEdit-0.6.2.zip", ["macOS"])?.kind, "macos");
  assert.equal(classifyDownload("bundle.zip", ["macOS", "Windows", "Linux"])?.kind, "archive");
  assert.equal(classifyDownload("Tool-universal.dmg")?.architecture, "universal");
});
