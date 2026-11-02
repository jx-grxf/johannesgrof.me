export {};

// Loops muted demo videos only while they are on screen. With reduced motion
// the poster frame stays, and nothing is downloaded until the video is visible.
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
const videos = document.querySelectorAll<HTMLVideoElement>("video[data-autoplay]");

if (!reduceMotion && videos.length > 0 && "IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const video = entry.target as HTMLVideoElement;
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      }
    },
    { threshold: 0.4 },
  );
  videos.forEach((video) => observer.observe(video));
}
