import { getSitemapIndexXml, sitemapXmlResponse } from "@/lib/sitemaps";

export const runtime = "nodejs";

export function GET() {
    return sitemapXmlResponse(getSitemapIndexXml());
}
