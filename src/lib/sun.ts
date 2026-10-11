// Is the sun up in Vienna? NOAA's approximation, accurate to a few minutes,
// which is plenty for switching the paper. Self-contained on purpose: BaseHead
// inlines this function's source so it can run before the first paint.
export function isViennaDaylight(now: Date): boolean {
  const rad = Math.PI / 180;
  const lat = 48.2082 * rad;
  const lng = 16.3738;
  const startOfYear = Date.UTC(now.getUTCFullYear(), 0, 0);
  const dayOfYear = Math.floor((now.getTime() - startOfYear) / 864e5);
  const g = ((2 * Math.PI) / 365) * (dayOfYear - 0.5);
  const eqTime = 229.18 * (0.000075 + 0.001868 * Math.cos(g) - 0.032077 * Math.sin(g) - 0.014615 * Math.cos(2 * g) - 0.040849 * Math.sin(2 * g));
  const decl = 0.006918 - 0.399912 * Math.cos(g) + 0.070257 * Math.sin(g) - 0.006758 * Math.cos(2 * g) + 0.000907 * Math.sin(2 * g) - 0.002697 * Math.cos(3 * g) + 0.00148 * Math.sin(3 * g);
  const hourAngle = Math.acos(Math.cos(90.833 * rad) / (Math.cos(lat) * Math.cos(decl)) - Math.tan(lat) * Math.tan(decl)) / rad;
  const sunrise = 720 - 4 * (lng + hourAngle) - eqTime;
  const sunset = 720 - 4 * (lng - hourAngle) - eqTime;
  const minutes = now.getUTCHours() * 60 + now.getUTCMinutes();
  return minutes >= sunrise && minutes < sunset;
}
