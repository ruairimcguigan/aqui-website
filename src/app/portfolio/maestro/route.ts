import { readFileSync } from "fs";
import { join } from "path";

// Serve the Maestro static site's index.html directly at the clean URL
// /portfolio/maestro/ (standalone — not wrapped in the site layout). Its
// sibling files (assets/, privacy.html, support.html) continue to be served
// as real static files from public/portfolio/maestro/, and the page's
// relative paths resolve against /portfolio/maestro/ thanks to trailingSlash.
export const dynamic = "force-static";

export function GET() {
  const html = readFileSync(
    join(process.cwd(), "public", "portfolio", "maestro", "index.html"),
    "utf8",
  );
  return new Response(html, {
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}
