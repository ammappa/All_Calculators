import type { BlogPostRecord } from "@/lib/blog-shared";
import { stripHtml } from "@/lib/blog-shared";
import type { CalculatorCategory, CalculatorCatalogItem } from "@/lib/calculator-catalog";
import type { CalculatorFaqItemRecord, CalculatorPageContentRecord } from "@/lib/calculator-page-content";
import { siteUrl } from "@/lib/site";
import { siteConfig } from "@/lib/siteConfig";

type BreadcrumbItem = {
    name: string;
    path: string;
};

type FaqItem = {
    question: string;
    answer: string;
};

type CategoryPageInput = {
    category: CalculatorCategory;
    label: string;
    title: string;
    description: string;
    path: string;
    items: CalculatorCatalogItem[];
};

const categoryApplicationMap: Record<CalculatorCategory, string> = {
    finance: "FinanceApplication",
    health: "HealthApplication",
    lifestyle: "UtilitiesApplication",
    math: "EducationalApplication",
};

const healthConditionMap: Partial<Record<string, string>> = {
    "bmi-calculator": "Body mass index",
    "body-fat-calculator": "Body fat percentage",
    "calorie-calculator": "Calorie intake",
    "macro-calculator": "Macronutrient planning",
    "ideal-weight-calculator": "Healthy weight range",
    "pregnancy-calculator": "Pregnancy due date",
    "ovulation-calculator": "Ovulation planning",
    "daily-water-intake-calculator": "Hydration needs",
    "target-heart-rate-calculator": "Target heart rate",
    "tdee-calculator": "Total daily energy expenditure",
    "steps-to-calories-calculator": "Calories burned from walking",
    "blood-alcohol-calculator": "Blood alcohol concentration",
    "vo2-max-calculator": "VO2 max",
    "period-calculator": "Menstrual cycle planning",
    "fitness-age-calculator": "Fitness age",
    "calories-burned-calculator": "Calories burned",
    "lean-body-mass-calculator": "Lean body mass",
    "cost-of-smoking-calculator": "Smoking cost and health impact",
};

export function toAbsoluteUrl(path: string) {
    if (path.startsWith("http://") || path.startsWith("https://")) {
        return path;
    }

    return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

function createQuestionAnswerSchema(faqs: FaqItem[]) {
    return faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
        },
    }));
}

export function buildOrganizationSchema() {
    return {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: siteConfig.legalName,
        url: siteUrl,
        logo: toAbsoluteUrl(siteConfig.logoPath),
        ...(siteConfig.socialProfiles.length > 0 ? { sameAs: [...siteConfig.socialProfiles] } : {}),
    };
}

export function buildLocalBusinessSchema() {
    return {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        name: siteConfig.legalName,
        url: siteUrl,
        image: toAbsoluteUrl(siteConfig.logoPath),
        description: siteConfig.description,
        email: siteConfig.contactEmail,
        ...(siteConfig.contactPhone ? { telephone: siteConfig.contactPhone } : {}),
        priceRange: siteConfig.priceRange,
        areaServed: siteConfig.serviceArea,
        hasMap: siteConfig.businessProfileUrl,
        contactPoint: {
            "@type": "ContactPoint",
            contactType: "customer support",
            email: siteConfig.contactEmail,
            ...(siteConfig.contactPhone ? { telephone: siteConfig.contactPhone } : {}),
            areaServed: siteConfig.serviceArea,
            availableLanguage: ["en"],
        },
        sameAs: [...siteConfig.socialProfiles],
    };
}

export function buildWebsiteSchema() {
    return {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: siteConfig.name,
        url: siteUrl,
        potentialAction: {
            "@type": "SearchAction",
            target: `${siteUrl}${siteConfig.searchPath}?q={search_term_string}`,
            "query-input": "required name=search_term_string",
        },
    };
}

export function buildWebPageSchema(input: {
    name: string;
    description: string;
    path: string;
    speakableSelectors?: string[];
}) {
    return {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: input.name,
        description: input.description,
        url: toAbsoluteUrl(input.path),
        ...(input.speakableSelectors && input.speakableSelectors.length > 0
            ? {
                  speakable: {
                      "@type": "SpeakableSpecification",
                      cssSelector: input.speakableSelectors,
                  },
              }
            : {}),
    };
}

export function buildBreadcrumbSchema(items: BreadcrumbItem[]) {
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: item.name,
            item: toAbsoluteUrl(item.path),
        })),
    };
}

export function buildFaqSchema(faqs: FaqItem[]) {
    return {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: createQuestionAnswerSchema(faqs),
    };
}

export function buildHomePageSchemas(calculatorCount: number, blogCount: number) {
    const pageTitle = `${siteConfig.name} Calculators`;
    const pageDescription = siteConfig.description;

    return [
        buildWebPageSchema({
            name: pageTitle,
            description: pageDescription,
            path: "/",
            speakableSelectors: [".page-summary", ".page-summary-secondary"],
        }),
        {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: pageTitle,
            description: pageDescription,
            url: siteUrl,
            about: [
                "Finance calculators",
                "Health calculators",
                "Lifestyle calculators",
                "Math calculators",
            ],
        },
        {
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "Featured resources on WithinSecs",
            itemListElement: [
                {
                    "@type": "ListItem",
                    position: 1,
                    name: "Calculators",
                    url: toAbsoluteUrl("/calculators"),
                },
                {
                    "@type": "ListItem",
                    position: 2,
                    name: "Blog",
                    url: toAbsoluteUrl("/blog"),
                },
            ],
            numberOfItems: 2,
        },
        buildFaqSchema([
            {
                question: `What can I calculate on ${siteConfig.name}?`,
                answer: `${siteConfig.name} offers ${calculatorCount}+ free online calculators for finance, health, lifestyle, and math topics, plus blog guides that explain how to use them effectively.`,
            },
            {
                question: `Are the calculators on ${siteConfig.name} free to use?`,
                answer: `Yes. Every calculator on ${siteConfig.name} is available online without a paid subscription, so users can estimate payments, health metrics, conversions, and more in seconds.`,
            },
            {
                question: `Does ${siteConfig.name} publish educational content too?`,
                answer: `Yes. The platform includes calculator-driven blog articles and explainers, with ${blogCount}+ published posts covering finance, AI tools, and practical decision-making topics.`,
            },
        ]),
    ];
}

export function buildCollectionPageSchemas(input: CategoryPageInput) {
    const collectionPage = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: input.title,
        description: input.description,
        url: toAbsoluteUrl(input.path),
    };

    const itemList = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: `${input.label} calculators`,
        numberOfItems: input.items.length,
        itemListElement: input.items.map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: item.title,
            url: toAbsoluteUrl(item.path),
        })),
    };

    const breadcrumb = buildBreadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "Calculators", path: "/calculators" },
        ...(input.path !== "/calculators" ? [{ name: input.label, path: input.path }] : []),
    ]);

    const faqs = buildFaqSchema([
        {
            question:
                input.path === "/calculators"
                    ? "What calculators are available on WithinSecs?"
                    : `What can I do with ${input.label.toLowerCase()} calculators on WithinSecs?`,
            answer:
                input.path === "/calculators"
                    ? `WithinSecs groups its calculators into finance, health, lifestyle, and math collections so users can quickly find the right tool for the job.`
                    : `WithinSecs ${input.label.toLowerCase()} calculators help users solve practical problems with accurate formulas, instant results, and simple inputs.`,
        },
        {
            question:
                input.path === "/calculators"
                    ? "Are the calculators on this page free?"
                    : `How do I choose the best ${input.label.toLowerCase()} calculator?`,
            answer:
                input.path === "/calculators"
                    ? "Yes. Every calculator listed in this directory is free to use online."
                    : `Start with the calculator that best matches your goal, review the required inputs, and use the result as a quick reference for planning and decision-making.`,
        },
    ]);

    return [collectionPage, itemList, breadcrumb, faqs];
}

function normalizeFaqItems(
    faqs: CalculatorFaqItemRecord[] | undefined,
    fallbackFaqs: FaqItem[]
) {
    const normalized = (faqs ?? [])
        .map((faq) => ({
            question: faq.question.trim(),
            answer: faq.answer.trim(),
        }))
        .filter((faq) => faq.question.length > 0 && faq.answer.length > 0);

    return normalized.length > 0 ? normalized : fallbackFaqs;
}

function buildCalculatorFallbackFaqs(
    title: string,
    description: string,
    category: CalculatorCategory
): FaqItem[] {
    return [
        {
            question: `What does the ${title} do?`,
            answer: `${description} This free ${category} calculator on WithinSecs is designed to give quick results with clear inputs and outputs.`,
        },
        {
            question: `How do I use the ${title}?`,
            answer: `Enter the values requested by the ${title}, review the calculated result, and adjust the inputs to compare different scenarios before making a decision.`,
        },
        {
            question: `Is the ${title} free to use online?`,
            answer: `Yes. The ${title} is available for free on WithinSecs and works in a web browser without extra software.`,
        },
    ];
}

function inferFinanceCategory(title: string) {
    const lowerTitle = title.toLowerCase();

    if (lowerTitle.includes("mortgage") || lowerTitle.includes("loan") || lowerTitle.includes("emi")) {
        return "Loan";
    }

    if (lowerTitle.includes("401k") || lowerTitle.includes("pension") || lowerTitle.includes("nps")) {
        return "Retirement";
    }

    if (lowerTitle.includes("sip") || lowerTitle.includes("fd") || lowerTitle.includes("investment")) {
        return "Investment";
    }

    return "Finance";
}

export function buildCalculatorSchemas(input: {
    item: CalculatorCatalogItem;
    pageContent?: CalculatorPageContentRecord | null;
}) {
    const description =
        input.pageContent?.seoDescription ||
        input.pageContent?.pageIntro ||
        input.item.description;
    const name =
        input.pageContent?.seoTitle ||
        input.pageContent?.pageHeading ||
        input.item.title;
    const breadcrumbItems: BreadcrumbItem[] = [
        { name: "Home", path: "/" },
        { name: "Calculators", path: "/calculators" },
    ];

    if (input.item.category !== "finance") {
        breadcrumbItems.push({
            name: input.item.category.charAt(0).toUpperCase() + input.item.category.slice(1),
            path: `/calculators/${input.item.category}`,
        });
    } else {
        breadcrumbItems.push({ name: "Finance", path: "/calculators/finance" });
    }

    breadcrumbItems.push({ name, path: input.item.path });

    const fallbackFaqs = buildCalculatorFallbackFaqs(name, description, input.item.category);
    const faqItems = normalizeFaqItems(input.pageContent?.faqItems, fallbackFaqs);
    const schemas: Record<string, unknown>[] = [
        buildWebPageSchema({
            name,
            description,
            path: input.item.path,
        }),
        {
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name,
            applicationCategory: categoryApplicationMap[input.item.category],
            operatingSystem: "All",
            url: toAbsoluteUrl(input.item.path),
            description,
            offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
            },
            publisher: {
                "@type": "Organization",
                name: siteConfig.legalName,
                url: siteUrl,
            },
        },
        {
            "@context": "https://schema.org",
            "@type": "Dataset",
            name: `${name} calculation data`,
            description: `Input and output data model used by the ${name} on WithinSecs.`,
            url: toAbsoluteUrl(input.item.path),
            creator: {
                "@type": "Organization",
                name: siteConfig.legalName,
            },
        },
        buildBreadcrumbSchema(breadcrumbItems),
        buildFaqSchema(faqItems),
    ];

    if (input.item.category === "finance") {
        schemas.push({
            "@context": "https://schema.org",
            "@type": "FinancialProduct",
            name,
            category: inferFinanceCategory(name),
            description,
            url: toAbsoluteUrl(input.item.path),
        });
    }

    if (input.item.category === "health") {
        schemas.push({
            "@context": "https://schema.org",
            "@type": "MedicalWebPage",
            about: {
                "@type": "MedicalCondition",
                name: healthConditionMap[input.item.slug.split("/").pop() ?? ""] ?? name,
            },
            url: toAbsoluteUrl(input.item.path),
            description,
        });
    }

    return schemas;
}

function extractFaqsFromHtml(html: string) {
    const matches = Array.from(
        html.matchAll(
            /<(h2|h3)>(.*?)<\/\1>\s*<p>(.*?)<\/p>/gi
        )
    );

    return matches
        .map((match) => ({
            question: stripHtml(match[2] ?? "").trim(),
            answer: stripHtml(match[3] ?? "").trim(),
        }))
        .filter((item) => item.question.endsWith("?") && item.answer.length > 0)
        .slice(0, 5);
}

function buildBlogFallbackFaqs(post: BlogPostRecord): FaqItem[] {
    return [
        {
            question: `What is this article about?`,
            answer: post.excerpt || `This article explains ${post.title.toLowerCase()} and helps readers understand the topic with practical guidance.`,
        },
        {
            question: `How can this article help me?`,
            answer: `This guide is designed to help readers learn faster, compare options, and take the next step using related calculators and educational content on WithinSecs.`,
        },
    ];
}

function shouldIncludeHowTo(post: BlogPostRecord) {
    const normalizedTitle = post.title.toLowerCase();
    return (
        normalizedTitle.startsWith("how to") ||
        normalizedTitle.includes("guide") ||
        normalizedTitle.includes("tips")
    );
}

function extractHowToSteps(post: BlogPostRecord) {
    const headingMatches = Array.from(post.content.matchAll(/<(h2|h3)>(.*?)<\/\1>/gi))
        .map((match) => stripHtml(match[2] ?? "").trim())
        .filter(Boolean)
        .slice(0, 5);

    const steps = headingMatches.length > 0
        ? headingMatches
        : [
              `Understand the goal of ${post.title.toLowerCase()}.`,
              "Review the main factors, numbers, or choices involved.",
              "Use the related WithinSecs calculator or guide to compare outcomes.",
          ];

    return steps.map((text, index) => ({
        "@type": "HowToStep",
        position: index + 1,
        name: text,
        text,
    }));
}

export function buildBlogSchemas(post: BlogPostRecord) {
    const faqs = extractFaqsFromHtml(post.content);
    const fallbackFaqs = buildBlogFallbackFaqs(post);
    const faqItems = faqs.length > 0 ? faqs : fallbackFaqs;
    const schemas: Record<string, unknown>[] = [
        {
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.title,
            description: post.excerpt,
            image: post.imageUrl ? [post.imageUrl] : undefined,
            author: {
                "@type": "Person",
                name: siteConfig.authorName,
            },
            publisher: {
                "@type": "Organization",
                name: siteConfig.legalName,
                logo: {
                    "@type": "ImageObject",
                    url: toAbsoluteUrl(siteConfig.logoPath),
                },
            },
            datePublished: post.createdAt || undefined,
            dateModified: post.updatedAt || post.createdAt || undefined,
            mainEntityOfPage: toAbsoluteUrl(`/blog/${post.slug}`),
        },
        buildWebPageSchema({
            name: post.title,
            description: post.excerpt,
            path: `/blog/${post.slug}`,
            speakableSelectors: [".page-summary", ".article-summary"],
        }),
        buildBreadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blog" },
            { name: post.title, path: `/blog/${post.slug}` },
        ]),
        buildFaqSchema(faqItems),
    ];

    if (shouldIncludeHowTo(post)) {
        schemas.push({
            "@context": "https://schema.org",
            "@type": "HowTo",
            name: post.title,
            description: post.excerpt,
            step: extractHowToSteps(post),
        });
    }

    return schemas;
}

export function buildBlogListingSchemas(posts: BlogPostRecord[]) {
    return [
        {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "WithinSecs Blog",
            description: "Calculator guides, finance explainers, and practical articles published on WithinSecs.",
            url: toAbsoluteUrl("/blog"),
        },
        {
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "Recent blog posts",
            itemListElement: posts.slice(0, 12).map((post, index) => ({
                "@type": "ListItem",
                position: index + 1,
                name: post.title,
                url: toAbsoluteUrl(`/blog/${post.slug}`),
            })),
        },
        buildBreadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blog" },
        ]),
    ];
}

export function buildSearchResultsSchemas(query: string, resultCount: number) {
    return [
        {
            "@context": "https://schema.org",
            "@type": "SearchResultsPage",
            name: query ? `Search results for ${query}` : "Search",
            description: query
                ? `Search results for ${query} across calculators and blog content on WithinSecs.`
                : "Search WithinSecs calculators and blog content.",
            url: toAbsoluteUrl(`/search${query ? `?q=${encodeURIComponent(query)}` : ""}`),
        },
        buildBreadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Search", path: "/search" },
        ]),
        {
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: query ? `Results for ${query}` : "Search results",
            numberOfItems: resultCount,
        },
    ];
}
