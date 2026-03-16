import "server-only";

import {
    calculatorCatalog,
    calculatorCategoryOrder,
    groupCalculatorsByCategory,
    isKnownCalculatorSlug,
    normalizeCalculatorSlug,
    type CalculatorCatalogItem,
} from "@/lib/calculator-catalog";
import { DBconnection } from "@/lib/db";
import CalculatorPageContent from "@/models/CalculatorPageContent";
import CalculatorSettings from "@/models/CalculatorSettings";

const CALCULATOR_SETTINGS_KEY = "global";

export type ManagedCalculatorItem = CalculatorCatalogItem & {
    enabled: boolean;
};

export function buildCalculatorVisibilitySummary(items: ManagedCalculatorItem[]) {
    const enabledCount = items.filter((item) => item.enabled).length;

    return {
        total: items.length,
        enabled: enabledCount,
        disabled: items.length - enabledCount,
    };
}

function sortManagedCalculators(items: ManagedCalculatorItem[]) {
    return [...items].sort((left, right) => {
        const categoryDifference =
            calculatorCategoryOrder.indexOf(left.category) -
            calculatorCategoryOrder.indexOf(right.category);

        if (categoryDifference !== 0) {
            return categoryDifference;
        }

        return left.title.localeCompare(right.title);
    });
}

function sanitizeDisabledSlugs(slugs: string[]) {
    return Array.from(
        new Set(
            slugs
                .map((slug) => normalizeCalculatorSlug(String(slug)))
                .filter((slug) => slug.length > 0 && isKnownCalculatorSlug(slug))
        )
    );
}

async function readDisabledSlugs() {
    await DBconnection();

    const settings = await CalculatorSettings.findOne({
        key: CALCULATOR_SETTINGS_KEY,
    }).lean();

    return sanitizeDisabledSlugs(settings?.disabledSlugs ?? []);
}

async function getCalculatorCardOverrideMap() {
    await DBconnection();

    const docs = await CalculatorPageContent.find(
        {},
        {
            slug: 1,
            cardTitle: 1,
            cardSubTitle: 1,
            cardDescription: 1,
        }
    ).lean();

    return new Map(
        docs.map((doc) => [
            doc.slug,
            {
                cardTitle: typeof doc.cardTitle === "string" ? doc.cardTitle.trim() : "",
                cardSubTitle:
                    typeof doc.cardSubTitle === "string" ? doc.cardSubTitle.trim() : "",
                cardDescription:
                    typeof doc.cardDescription === "string" ? doc.cardDescription.trim() : "",
            },
        ])
    );
}

function applyCalculatorCardOverrides(
    items: CalculatorCatalogItem[],
    overrideMap: Map<
        string,
        {
            cardTitle: string;
            cardSubTitle: string;
            cardDescription: string;
        }
    >
) {
    return items.map((item) => {
        const override = overrideMap.get(item.slug);

        if (!override) {
            return item;
        }

        return {
            ...item,
            title: override.cardTitle || item.title,
            subTitle: override.cardSubTitle || item.subTitle,
            description: override.cardDescription || item.description,
        };
    });
}

export async function getDisabledCalculatorSlugs() {
    return readDisabledSlugs();
}

export async function getManagedCalculators() {
    const [disabledSlugs, overrideMap] = await Promise.all([
        readDisabledSlugs(),
        getCalculatorCardOverrideMap(),
    ]);
    const disabledSlugSet = new Set(disabledSlugs);
    const catalogWithOverrides = applyCalculatorCardOverrides(calculatorCatalog, overrideMap);

    return sortManagedCalculators(
        catalogWithOverrides.map((item) => ({
            ...item,
            enabled: !disabledSlugSet.has(item.slug),
        }))
    );
}

export async function getVisibleCalculatorCatalog() {
    const [disabledSlugs, overrideMap] = await Promise.all([
        readDisabledSlugs(),
        getCalculatorCardOverrideMap(),
    ]);
    const disabledSlugSet = new Set(disabledSlugs);
    const catalogWithOverrides = applyCalculatorCardOverrides(calculatorCatalog, overrideMap);

    return catalogWithOverrides.filter((item) => !disabledSlugSet.has(item.slug));
}

export async function getVisibleCalculatorGroups() {
    return groupCalculatorsByCategory(await getVisibleCalculatorCatalog());
}

export async function getVisibleCalculatorCatalogSafe() {
    try {
        return await getVisibleCalculatorCatalog();
    } catch (error) {
        console.error("Failed to load calculator visibility settings:", error);
        return calculatorCatalog;
    }
}

export async function getVisibleCalculatorGroupsSafe() {
    return groupCalculatorsByCategory(await getVisibleCalculatorCatalogSafe());
}

export async function getCalculatorVisibility(slug: string) {
    const normalizedSlug = normalizeCalculatorSlug(slug);

    if (!normalizedSlug || !isKnownCalculatorSlug(normalizedSlug)) {
        return {
            known: false,
            enabled: false,
            slug: normalizedSlug,
        };
    }

    const disabledSlugs = new Set(await readDisabledSlugs());

    return {
        known: true,
        enabled: !disabledSlugs.has(normalizedSlug),
        slug: normalizedSlug,
    };
}

export async function setCalculatorEnabled(slug: string, enabled: boolean) {
    const normalizedSlug = normalizeCalculatorSlug(slug);

    if (!normalizedSlug || !isKnownCalculatorSlug(normalizedSlug)) {
        throw new Error("Unknown calculator slug.");
    }

    await DBconnection();

    await CalculatorSettings.updateOne(
        { key: CALCULATOR_SETTINGS_KEY },
        enabled
            ? {
                  $setOnInsert: { key: CALCULATOR_SETTINGS_KEY },
                  $pull: { disabledSlugs: normalizedSlug },
              }
            : {
                  $setOnInsert: { key: CALCULATOR_SETTINGS_KEY },
                  $addToSet: { disabledSlugs: normalizedSlug },
              },
        { upsert: true }
    );

    const items = await getManagedCalculators();
    const updatedItem = items.find((item) => item.slug === normalizedSlug);

    if (!updatedItem) {
        throw new Error("Failed to load updated calculator settings.");
    }

    return {
        item: updatedItem,
        items,
    };
}

export async function getCalculatorVisibilitySummary() {
    return buildCalculatorVisibilitySummary(await getManagedCalculators());
}
