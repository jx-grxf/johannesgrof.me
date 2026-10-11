// Refreshes src/data/viennaStops.json from the Wiener Linien open data stop
// list (CC BY 4.0, Stadt Wien). Run by hand when stops change:
//   node tools/vienna-stops.mjs
import { writeFile } from "node:fs/promises";

const SOURCE = "https://www.wienerlinien.at/ogd_realtime/doku/ogd/wienerlinien-ogd-haltestellen.csv";

const csv = await (await fetch(SOURCE)).text();
const [header, ...rows] = csv.trim().split(/\r?\n/);
const columns = header.split(";");
const diva = columns.indexOf("DIVA");
const name = columns.indexOf("PlatformText");
const seen = new Set();
const stops = rows
  .map((row) => row.split(";"))
  .map((cells) => [Number(cells[diva]), cells[name]?.trim() ?? ""])
  .filter(([id, label]) => Number.isFinite(id) && label && !seen.has(id) && seen.add(id))
  .sort((a, b) => a[1].localeCompare(b[1], "de"));

await writeFile(new URL("../src/data/viennaStops.json", import.meta.url), `${JSON.stringify(stops)}\n`);
console.log(`${stops.length} stops written`);
