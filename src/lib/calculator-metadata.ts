import "server-only";

import type { Metadata } from "next";
import { unstable_cache } from "next/cache";

import { getCalculatorPageContentSafe } from "@/lib/calculator-page-content";
import { siteUrl } from "@/lib/site";

const getCachedCalculatorSeo = unstable_cache(
    async (slug: string) => getCalculatorPageContentSafe(slug),
    ["calculator-page-metadata"],
    {
        tags: ["calculator-page-metadata"],
    }
);

export async function getCalculatorPageMetadata(slug: string): Promise<Metadata> {
    const item = await getCachedCalculatorSeo(slug);
    const title =
        item.seoTitle ||
        item.pageHeading ||
        (item.slug === "calculators" ? "All Calculators" : item.defaultTitle || item.title);
    const description =
        item.seoDescription ||
        item.pageIntro ||
        item.defaultDescription ||
        item.description;
    const canonicalUrl = `${siteUrl}${item.path}`;

    return {
        title,
        description,
        alternates: {
            canonical: item.path,
        },
        openGraph: {
            title,
            description,
            url: canonicalUrl,
            type: "website",
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
        },
    };
}
