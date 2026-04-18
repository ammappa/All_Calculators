import type { Metadata } from "next";

import CalculatorCategoryPage from "@/components/Calculators/CalculatorCategoryPage";
import { getCalculatorCategoryMetadata } from "@/lib/calculator-metadata";
import { getVisibleCalculatorGroupsSafe } from "@/lib/calculator-visibility";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

export function generateMetadata(): Metadata {
    return getCalculatorCategoryMetadata("health");
}

export default async function HealthCalculatorsPage() {
    const groups = await getVisibleCalculatorGroupsSafe();

    return (
        <CalculatorCategoryPage
            category="health"
            label="Health"
            title="Health Calculators"
            description="Explore free health calculators for BMI, calories, hydration, pregnancy planning, and everyday wellness tracking."
            path="/calculators/health"
            items={groups.health}
        />
    );
}
