"use client";

import { useEffect } from "react";

import {
    buildCalculatorSeoDescription,
} from "@/lib/calculator-seo";

type CalculatorPageContentRecord = {
    seoDescription: string;
    pageIntro: string;
    description: string;
    defaultDescription: string;
    slug: string;
};

type CalculatorPageContentApiResponse = {
    success: boolean;
    item?: CalculatorPageContentRecord;
};

type ManagedCalculatorSeoOverridesProps = {
    slug: string;
};

function updateMetaTag(selector: string, content: string) {
    const element = document.head.querySelector(selector);

    if (!(element instanceof HTMLMetaElement)) {
        return;
    }

    element.setAttribute("content", content);
}

export default function ManagedCalculatorSeoOverrides({
    slug,
}: ManagedCalculatorSeoOverridesProps) {
    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const loadSeo = async () => {
            try {
                const params = new URLSearchParams({ slug });
                const response = await fetch(`/api/calculator-pages?${params.toString()}`, {
                    cache: "no-store",
                    signal: controller.signal,
                });
                const data: CalculatorPageContentApiResponse = await response.json();

                if (!isMounted || !response.ok || !data.success || !data.item) {
                    return;
                }

                const description = buildCalculatorSeoDescription(data.item);

                updateMetaTag('meta[name="description"]', description);
                updateMetaTag('meta[property="og:description"]', description);
                updateMetaTag('meta[name="twitter:description"]', description);
            } catch (error) {
                if ((error instanceof Error ? error.name : "") !== "AbortError") {
                    console.error("Failed to load calculator SEO overrides:", error);
                }
            }
        };

        void loadSeo();

        return () => {
            isMounted = false;
            controller.abort();
        };
    }, [slug]);

    return null;
}
