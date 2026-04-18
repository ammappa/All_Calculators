import { getCalculatorCategorySitemapXml, sitemapXmlResponse } from "@/lib/sitemaps";

export const runtime = "nodejs";

export async function GET() {
    return sitemapXmlResponse(await getCalculatorCategorySitemapXml("finance"));
}
