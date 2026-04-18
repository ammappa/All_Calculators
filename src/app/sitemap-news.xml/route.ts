import { getNewsSitemapXml, sitemapXmlResponse } from "@/lib/sitemaps";

export const runtime = "nodejs";

export async function GET() {
    return sitemapXmlResponse(await getNewsSitemapXml());
}
