import type { Metadata } from "next";
import type { ReactNode } from "react";

import { getCalculatorPageMetadata } from "@/lib/calculator-metadata";

export async function generateMetadata(): Promise<Metadata> {
    return getCalculatorPageMetadata("lifestyle/steps-to-miles");
}

export default function CalculatorRouteLayout({
    children,
}: {
    children: ReactNode;
}) {
    return children;
}
