/** Keep every title bar reachable, including after a display-size change.
 *
 *  Pure so it can be tested without a DOM: the desktop calls it on every drag,
 *  resize and viewport change, and a window that ends up with its title bar
 *  off-screen can never be moved back. */
export function clampWindow(x: number, y: number, width: number, height: number, viewportWidth: number, viewportHeight: number) {
  const w = Math.min(Math.max(width, 320), Math.max(280, viewportWidth - 16));
  const h = Math.min(Math.max(height, 240), Math.max(200, viewportHeight - 128));

  return {
    x: Math.max(8, Math.min(x, viewportWidth - w - 8)),
    y: Math.max(8, Math.min(y, viewportHeight - h - 120)),
    width: w,
    height: h,
  };
}
