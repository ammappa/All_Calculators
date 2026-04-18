import "server-only";

import type { Metadata } from "next";

import {
    calculatorCategoryLabels,
    type CalculatorCategory,
} from "@/lib/calculator-catalog";
import { getCachedCalculatorPageContentSafe } from "@/lib/calculator-page-content-cache";
import { siteUrl } from "@/lib/site";

export async function getCalculatorPageMetadata(slug: string): Promise<Metadata> {
    const item = await getCachedCalculatorPageContentSafe(slug);
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

export function getCalculatorCategoryMetadata(category: CalculatorCategory): Metadata {
    const label = calculatorCategoryLabels[category];
    const path = `/calculators/${category}`;
    const title = `${label} Calculators`;
    const description = `Explore free ${label.toLowerCase()} calculators on WithinSecs to solve practical problems faster with clear inputs and instant results.`;

    return {
        title,
        description,
        alternates: {
            canonical: path,
        },
        openGraph: {
            title,
            description,
            url: `${siteUrl}${path}`,
            type: "website",
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
        },
    };
}
