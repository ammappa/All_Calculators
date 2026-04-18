import type { Metadata } from "next";

import CalculatorCategoryPage from "@/components/Calculators/CalculatorCategoryPage";
import { getCalculatorCategoryMetadata } from "@/lib/calculator-metadata";
import { getVisibleCalculatorGroupsSafe } from "@/lib/calculator-visibility";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

export function generateMetadata(): Metadata {
    return getCalculatorCategoryMetadata("finance");
}

export default async function FinanceCalculatorsPage() {
    const groups = await getVisibleCalculatorGroupsSafe();

    return (
        <CalculatorCategoryPage
            category="finance"
            label="Finance"
            title="Finance Calculators"
            description="Explore free finance calculators for loans, investing, retirement planning, taxes, and money decisions."
            path="/calculators/finance"
            items={groups.finance}
        />
    );
}
