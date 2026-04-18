import type { Metadata } from "next";

import CalculatorCategoryPage from "@/components/Calculators/CalculatorCategoryPage";
import { getCalculatorCategoryMetadata } from "@/lib/calculator-metadata";
import { getVisibleCalculatorGroupsSafe } from "@/lib/calculator-visibility";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

export function generateMetadata(): Metadata {
    return getCalculatorCategoryMetadata("lifestyle");
}

export default async function LifestyleCalculatorsPage() {
    const groups = await getVisibleCalculatorGroupsSafe();

    return (
        <CalculatorCategoryPage
            category="lifestyle"
            label="Lifestyle"
            title="Lifestyle Calculators"
            description="Explore free lifestyle calculators for dates, shopping, travel, budgeting, school, and practical daily planning."
            path="/calculators/lifestyle"
            items={groups.lifestyle}
        />
    );
}
