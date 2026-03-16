import "server-only";

import {
    calculatorCatalog,
    calculatorCategoryLabels,
    normalizeCalculatorSlug,
} from "@/lib/calculator-catalog";
import { sanitizeBlogContentHtml } from "@/lib/blog-shared";
import { DBconnection } from "@/lib/db";
import CalculatorPageContent from "@/models/CalculatorPageContent";

export type CalculatorFaqItemRecord = {
    question: string;
    answer: string;
};

export type CalculatorPageContentRecord = {
    slug: string;
    title: string;
    subTitle: string;
    path: string;
    category: string;
    description: string;
    defaultTitle: string;
    defaultSubTitle: string;
    defaultDescription: string;
    cardTitle: string;
    cardSubTitle: string;
    cardDescription: string;
    pageHeading: string;
    pageIntro: string;
    seoTitle: string;
    seoDescription: string;
    contentTitle: string;
    contentIntro: string;
    contentHtml: string;
    faqItems: CalculatorFaqItemRecord[];
    hasCardOverrides: boolean;
    hasHeroOverrides: boolean;
    hasSeoOverrides: boolean;
    hasCustomContent: boolean;
    updatedAt: string;
};

type CalculatorContentSource = {
    slug?: string;
    cardTitle?: string;
    cardSubTitle?: string;
    cardDescription?: string;
    pageHeading?: string;
    pageIntro?: string;
    seoTitle?: string;
    seoDescription?: string;
    contentTitle?: string;
    contentIntro?: string;
    contentHtml?: string;
    faqItems?: Array<{
        question?: string;
        answer?: string;
    }>;
    updatedAt?: Date | string;
};

const CALCULATOR_INDEX_SLUG = "calculators";

function isKnownManagedCalculatorSlug(slug: string) {
    return slug === CALCULATOR_INDEX_SLUG || calculatorCatalog.some((item) => item.slug === slug);
}

function normalizeManagedSlug(value: string) {
    const normalized = normalizeCalculatorSlug(String(value ?? ""));
    return normalized === CALCULATOR_INDEX_SLUG ? CALCULATOR_INDEX_SLUG : normalized;
}

function normalizeFaqItems(
    input?: Array<{
        question?: string;
        answer?: string;
    }>
) {
    return (input ?? [])
        .map((item) => ({
            question: String(item?.question ?? "").trim(),
            answer: String(item?.answer ?? "").trim(),
        }))
        .filter((item) => item.question.length > 0 || item.answer.length > 0);
}

function toIsoString(value: Date | string | undefined) {
    if (!value) {
        return "";
    }

    const date = value instanceof Date ? value : new Date(value);
    return Number.isNaN(date.getTime()) ? "" : date.toISOString();
}

function buildManagedCalculatorBase(slug: string) {
    if (slug === CALCULATOR_INDEX_SLUG) {
        return {
            slug,
            title: "All Calculators Page",
            subTitle: "",
            path: "/calculators",
            category: "Directory",
            description: "Manage the shared content block shown on the public calculators listing page.",
        };
    }

    const item = calculatorCatalog.find((entry) => entry.slug === slug);

    if (!item) {
        throw new Error("Unknown calculator page.");
    }

    return {
        slug: item.slug,
        title: item.title,
        subTitle: item.subTitle,
        path: item.path,
        category: calculatorCategoryLabels[item.category],
        description: item.description,
    };
}

function serializeCalculatorPageContent(
    base: ReturnType<typeof buildManagedCalculatorBase>,
    source?: CalculatorContentSource | null
): CalculatorPageContentRecord {
    const faqItems = normalizeFaqItems(source?.faqItems);
    const cardTitle = String(source?.cardTitle ?? "").trim();
    const cardSubTitle = String(source?.cardSubTitle ?? "").trim();
    const cardDescription = String(source?.cardDescription ?? "").trim();
    const pageHeading = String(source?.pageHeading ?? "").trim();
    const pageIntro = String(source?.pageIntro ?? "").trim();
    const seoTitle = String(source?.seoTitle ?? "").trim();
    const seoDescription = String(source?.seoDescription ?? "").trim();
    const contentTitle = String(source?.contentTitle ?? "").trim();
    const contentIntro = String(source?.contentIntro ?? "").trim();
    const contentHtml = sanitizeBlogContentHtml(String(source?.contentHtml ?? ""));
    const hasCardOverrides =
        cardTitle.length > 0 || cardSubTitle.length > 0 || cardDescription.length > 0;
    const hasHeroOverrides = pageHeading.length > 0 || pageIntro.length > 0;
    const hasSeoOverrides = seoTitle.length > 0 || seoDescription.length > 0;
    const hasCustomContent =
        contentTitle.length > 0 ||
        contentIntro.length > 0 ||
        contentHtml.length > 0 ||
        faqItems.length > 0;

    return {
        slug: base.slug,
        title: cardTitle || base.title,
        subTitle: cardSubTitle || base.subTitle,
        path: base.path,
        category: base.category,
        description: cardDescription || base.description,
        defaultTitle: base.title,
        defaultSubTitle: base.subTitle,
        defaultDescription: base.description,
        cardTitle,
        cardSubTitle,
        cardDescription,
        pageHeading,
        pageIntro,
        seoTitle,
        seoDescription,
        contentTitle,
        contentIntro,
        contentHtml,
        faqItems,
        hasCardOverrides,
        hasHeroOverrides,
        hasSeoOverrides,
        hasCustomContent,
        updatedAt: toIsoString(source?.updatedAt),
    };
}

export async function getManagedCalculatorPageContentItems() {
    await DBconnection();

    const docs = await CalculatorPageContent.find({}).lean();
    const docMap = new Map(docs.map((doc) => [doc.slug, doc]));
    const orderedSlugs = [CALCULATOR_INDEX_SLUG, ...calculatorCatalog.map((item) => item.slug)];

    return orderedSlugs.map((slug) =>
        serializeCalculatorPageContent(
            buildManagedCalculatorBase(slug),
            docMap.get(slug) ?? null
        )
    );
}

export async function getCalculatorPageContent(slug: string) {
    const normalizedSlug = normalizeManagedSlug(slug);

    if (!normalizedSlug || !isKnownManagedCalculatorSlug(normalizedSlug)) {
        throw new Error("Unknown calculator page.");
    }

    await DBconnection();

    const doc = await CalculatorPageContent.findOne({
        slug: normalizedSlug,
    }).lean();

    return serializeCalculatorPageContent(
        buildManagedCalculatorBase(normalizedSlug),
        doc ?? null
    );
}

export async function getCalculatorPageContentSafe(slug: string) {
    const normalizedSlug = normalizeManagedSlug(slug);

    try {
        return await getCalculatorPageContent(normalizedSlug);
    } catch (error) {
        console.error("Failed to load calculator page content:", error);

        if (!normalizedSlug || !isKnownManagedCalculatorSlug(normalizedSlug)) {
            return serializeCalculatorPageContent(
                buildManagedCalculatorBase(CALCULATOR_INDEX_SLUG),
                null
            );
        }

        return serializeCalculatorPageContent(
            buildManagedCalculatorBase(normalizedSlug),
            null
        );
    }
}

type UpdateCalculatorPageContentInput = {
    cardTitle?: string;
    cardSubTitle?: string;
    cardDescription?: string;
    pageHeading?: string;
    pageIntro?: string;
    seoTitle?: string;
    seoDescription?: string;
    contentTitle?: string;
    contentIntro?: string;
    contentHtml?: string;
    faqItems?: CalculatorFaqItemRecord[];
};

export async function updateCalculatorPageContent(
    slug: string,
    input: UpdateCalculatorPageContentInput
) {
    const normalizedSlug = normalizeManagedSlug(slug);

    if (!normalizedSlug || !isKnownManagedCalculatorSlug(normalizedSlug)) {
        throw new Error("Unknown calculator page.");
    }

    const cardTitle = String(input.cardTitle ?? "").trim();
    const cardSubTitle = String(input.cardSubTitle ?? "").trim();
    const cardDescription = String(input.cardDescription ?? "").trim();
    const pageHeading = String(input.pageHeading ?? "").trim();
    const pageIntro = String(input.pageIntro ?? "").trim();
    const seoTitle = String(input.seoTitle ?? "").trim();
    const seoDescription = String(input.seoDescription ?? "").trim();
    const contentTitle = String(input.contentTitle ?? "").trim();
    const contentIntro = String(input.contentIntro ?? "").trim();
    const contentHtml = sanitizeBlogContentHtml(String(input.contentHtml ?? ""));
    const faqItems = normalizeFaqItems(input.faqItems);
    const hasManagedContent =
        cardTitle.length > 0 ||
        cardSubTitle.length > 0 ||
        cardDescription.length > 0 ||
        pageHeading.length > 0 ||
        pageIntro.length > 0 ||
        seoTitle.length > 0 ||
        seoDescription.length > 0 ||
        contentTitle.length > 0 ||
        contentIntro.length > 0 ||
        contentHtml.length > 0 ||
        faqItems.length > 0;

    await DBconnection();

    if (!hasManagedContent) {
        await CalculatorPageContent.deleteOne({
            slug: normalizedSlug,
        });

        return getCalculatorPageContent(normalizedSlug);
    }

    await CalculatorPageContent.updateOne(
        { slug: normalizedSlug },
        {
            $set: {
                slug: normalizedSlug,
                cardTitle,
                cardSubTitle,
                cardDescription,
                pageHeading,
                pageIntro,
                seoTitle,
                seoDescription,
                contentTitle,
                contentIntro,
                contentHtml,
                faqItems,
            },
        },
        { upsert: true }
    );

    return getCalculatorPageContent(normalizedSlug);
}
