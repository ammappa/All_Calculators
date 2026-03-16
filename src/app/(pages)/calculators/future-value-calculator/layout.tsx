import type { Metadata } from "next";
import type { ReactNode } from "react";

import { getCalculatorPageMetadata } from "@/lib/calculator-metadata";

export async function generateMetadata(): Promise<Metadata> {
    return getCalculatorPageMetadata("future-value-calculator");
}

export default function CalculatorRouteLayout({
    children,
}: {
    children: ReactNode;
}) {
    return children;
}
