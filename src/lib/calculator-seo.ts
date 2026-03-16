export type CalculatorSeoSource = {
    slug: string;
    description?: string;
    defaultDescription?: string;
    pageIntro?: string;
    seoDescription?: string;
};

export const calculatorsPageDescription =
    "Explore our comprehensive range of calculators designed to assist you with various financial, health, lifestyle, and mathematical needs.";

export function buildCalculatorSeoDescription(item: CalculatorSeoSource) {
    if (item.seoDescription) {
        return item.seoDescription;
    }

    if (item.pageIntro) {
        return item.pageIntro;
    }

    if (item.slug === "calculators") {
        return calculatorsPageDescription;
    }

    return item.defaultDescription || item.description || calculatorsPageDescription;
}
