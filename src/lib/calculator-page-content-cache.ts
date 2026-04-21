import "server-only";

import { getCalculatorPageContentSafe } from "@/lib/calculator-page-content";

export function getCachedCalculatorPageContentSafe(slug: string) {
    return getCalculatorPageContentSafe(slug);
}
