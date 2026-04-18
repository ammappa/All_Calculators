import type { Metadata } from "next";

import CalculatorCategoryPage from "@/components/Calculators/CalculatorCategoryPage";
import { getCalculatorCategoryMetadata } from "@/lib/calculator-metadata";
import { getVisibleCalculatorGroupsSafe } from "@/lib/calculator-visibility";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

export function generateMetadata(): Metadata {
    return getCalculatorCategoryMetadata("math");
}

export default async function MathCalculatorsPage() {
    const groups = await getVisibleCalculatorGroupsSafe();

    return (
        <CalculatorCategoryPage
            category="math"
            label="Math"
            title="Math Calculators"
            description="Explore free math calculators for percentages, algebra, averages, statistics, scientific math, and unit conversions."
            path="/calculators/math"
            items={groups.math}
        />
    );
}
