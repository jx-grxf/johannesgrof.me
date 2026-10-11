import type { APIRoute } from "astro";
import { handleHi } from "@/lib/curlHandler";

// Local stand-in for the _curl function, e.g.
// curl "localhost:4321/api/card?lang=de&path=/oeffi/schottentor"
export const prerender = false;

export const GET: APIRoute = ({ request }) => handleHi(request);
export const POST: APIRoute = ({ request }) => handleHi(request);
