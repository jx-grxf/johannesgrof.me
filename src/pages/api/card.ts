import type { APIRoute } from "astro";
import { handleCard } from "@/lib/curlHandler";

// Local stand-in for the _curl function: curl localhost:4321/api/card?lang=de
export const prerender = false;

export const GET: APIRoute = ({ request }) => handleCard(request);
