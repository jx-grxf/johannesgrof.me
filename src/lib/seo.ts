/** Whole sentences from the start of `text` that fit in `max` characters; a single long sentence is cut at a word. */
export function leadSentences(text: string, max: number): string {
  const sentences = text.trim().split(/(?<=[.!?])\s+/);
  let out = "";
  for (const sentence of sentences) {
    const next = out ? `${out} ${sentence}` : sentence;
    if (next.length > max) break;
    out = next;
  }
  if (out) return out;
  const room = max - 1;
  const cut = text[room] === " " ? text.slice(0, room) : text.slice(0, text.lastIndexOf(" ", room));
  return `${cut.replace(/[,;:]$/, "")}…`;
}
