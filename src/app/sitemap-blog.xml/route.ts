import { getBlogSitemapXml, sitemapXmlResponse } from "@/lib/sitemaps";

export const runtime = "nodejs";

export async function GET() {
    return sitemapXmlResponse(await getBlogSitemapXml());
}
