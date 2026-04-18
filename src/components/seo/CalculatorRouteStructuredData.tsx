"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";

import JsonLd from "@/components/seo/JsonLd";
import { calculatorCatalog } from "@/lib/calculator-catalog";
import { buildCalculatorSchemas } from "@/lib/seo";

const categoryRoots = new Set([
    "/calculators",
    "/calculators/finance",
    "/calculators/health",
    "/calculators/lifestyle",
    "/calculators/math",
]);

export default function CalculatorRouteStructuredData() {
    const pathname = usePathname();

    const schemas = useMemo(() => {
        if (!pathname?.startsWith("/calculators/") || categoryRoots.has(pathname)) {
            return [];
        }

        const slug = pathname.replace(/^\/calculators\//, "").replace(/\/$/, "");
        const item = calculatorCatalog.find((entry) => entry.slug === slug);

        if (!item) {
            return [];
        }

        return buildCalculatorSchemas({ item });
    }, [pathname]);

    if (schemas.length === 0) {
        return null;
    }

    return <JsonLd id="calculator-route-schema" data={schemas} />;
}
