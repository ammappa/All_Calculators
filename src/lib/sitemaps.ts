import { getBlogPosts } from "@/lib/blog";
import { calculatorCategoryOrder, calculatorCategoryLabels, type CalculatorCategory } from "@/lib/calculator-catalog";
import { getVisibleCalculatorCatalogSafe } from "@/lib/calculator-visibility";
import { siteUrl } from "@/lib/site";

type SitemapUrlEntry = {
    loc: string;
    lastmod?: string;
    changefreq?: string;
    priority?: number;
};

const staticPages = [
    { path: "/", changefreq: "daily", priority: 1 },
    { path: "/about", changefreq: "monthly", priority: 0.6 },
    { path: "/contact", changefreq: "monthly", priority: 0.6 },
    { path: "/privacy-policy", changefreq: "monthly", priority: 0.4 },
    { path: "/cookie-policy", changefreq: "monthly", priority: 0.4 },
    { path: "/terms", changefreq: "monthly", priority: 0.4 },
    { path: "/disclaimer", changefreq: "monthly", priority: 0.4 },
    { path: "/editorial-policy", changefreq: "monthly", priority: 0.5 },
    { path: "/blog", changefreq: "daily", priority: 0.8 },
    { path: "/search", changefreq: "weekly", priority: 0.5 },
];

function escapeXml(value: string) {
    return value
        .replace(/&/g, "&amp;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}

function buildUrlSet(entries: SitemapUrlEntry[]) {
    const body = entries
        .map((entry) => {
            const parts = [`<loc>${escapeXml(entry.loc)}</loc>`];

            if (entry.lastmod) {
                parts.push(`<lastmod>${escapeXml(entry.lastmod)}</lastmod>`);
            }

            if (entry.changefreq) {
                parts.push(`<changefreq>${escapeXml(entry.changefreq)}</changefreq>`);
            }

            if (typeof entry.priority === "number") {
                parts.push(`<priority>${entry.priority.toFixed(1)}</priority>`);
            }

            return `<url>${parts.join("")}</url>`;
        })
        .join("");

    return `<?xml version="1.0" encoding="UTF-8"?>` +
        `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${body}</urlset>`;
}

function buildSitemapIndex(paths: string[]) {
    const body = paths
        .map((path) => `<sitemap><loc>${escapeXml(`${siteUrl}${path}`)}</loc></sitemap>`)
        .join("");

    return `<?xml version="1.0" encoding="UTF-8"?>` +
        `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${body}</sitemapindex>`;
}

export function sitemapXmlResponse(xml: string) {
    return new Response(xml, {
        headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        },
    });
}

export function getSitemapIndexXml() {
    return buildSitemapIndex([
        "/sitemap-calculators-finance.xml",
        "/sitemap-calculators-health.xml",
        "/sitemap-calculators-lifestyle.xml",
        "/sitemap-calculators-math.xml",
        "/sitemap-blog.xml",
    ]);
}

export function getPagesSitemapXml() {
    return buildUrlSet(
        staticPages.map((page) => ({
            loc: `${siteUrl}${page.path}`,
            changefreq: page.changefreq,
            priority: page.priority,
        }))
    );
}

export async function getCalculatorsSitemapXml() {
    const calculators = await getVisibleCalculatorCatalogSafe();

    return buildUrlSet(
        calculators.map((calculator) => ({
            loc: `${siteUrl}${calculator.path}`,
            changefreq: "weekly",
            priority: 0.9,
        }))
    );
}

function getPriorityForCategory(category: CalculatorCategory) {
    switch (category) {
        case "finance":
            return 0.9;
        case "health":
            return 0.8;
        case "lifestyle":
            return 0.8;
        case "math":
        default:
            return 0.8;
    }
}

function getChangefreqForCategory(category: CalculatorCategory) {
    switch (category) {
        case "finance":
            return "monthly";
        case "health":
        case "lifestyle":
        case "math":
        default:
            return "monthly";
    }
}

function todayDateString() {
    return new Date().toISOString().slice(0, 10);
}

export async function getCalculatorCategorySitemapXml(category: CalculatorCategory) {
    const calculators = await getVisibleCalculatorCatalogSafe();
    const filtered = calculators.filter((calculator) => calculator.category === category);
    const today = todayDateString();

    return buildUrlSet([
        {
            loc: `${siteUrl}/`,
            lastmod: today,
            changefreq: "weekly",
            priority: 1,
        },
        ...filtered.map((calculator) => ({
            loc: `${siteUrl}${calculator.path}`,
            lastmod: today,
            changefreq: getChangefreqForCategory(category),
            priority: getPriorityForCategory(category),
        })),
    ]);
}

export function getCategoriesSitemapXml() {
    const entries: SitemapUrlEntry[] = [
        {
            loc: `${siteUrl}/calculators`,
            changefreq: "weekly",
            priority: 0.9,
        },
        {
            loc: `${siteUrl}/blog`,
            changefreq: "daily",
            priority: 0.8,
        },
        ...calculatorCategoryOrder.map((category) => ({
            loc: `${siteUrl}/calculators/${category}`,
            changefreq: "weekly",
            priority: 0.7,
        })),
    ];

    return buildUrlSet(entries);
}

export async function getBlogsSitemapXml() {
    const posts = await getBlogPosts({ publishedOnly: true });

    return buildUrlSet(
        posts.map((post) => ({
            loc: `${siteUrl}/blog/${post.slug}`,
            lastmod: post.updatedAt || post.createdAt || undefined,
            changefreq: "daily",
            priority: 0.7,
        }))
    );
}

export async function getBlogSitemapXml() {
    const posts = await getBlogPosts({ publishedOnly: true });

    return buildUrlSet(
        posts.map((post) => ({
            loc: `${siteUrl}/blog/${post.slug}`,
            lastmod: post.updatedAt || post.createdAt || undefined,
            changefreq: "weekly",
            priority: 0.8,
        }))
    );
}

export async function getNewsSitemapXml() {
    const posts = await getBlogPosts({ publishedOnly: true });
    const cutoff = Date.now() - 48 * 60 * 60 * 1000;
    const recentPosts = posts.filter((post) => {
        const publishedTime = Date.parse(post.createdAt || "");
        return Number.isFinite(publishedTime) && publishedTime >= cutoff;
    });

    return buildUrlSet(
        recentPosts.map((post) => ({
            loc: `${siteUrl}/blog/${post.slug}`,
            lastmod: post.updatedAt || post.createdAt || undefined,
            changefreq: "daily",
            priority: 0.8,
        }))
    );
}

export function getCategorySummary() {
    return calculatorCategoryOrder.map((category) => ({
        slug: category,
        label: calculatorCategoryLabels[category],
    }));
}
