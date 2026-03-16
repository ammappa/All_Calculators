"use client";

import { useEffect } from "react";

type CalculatorPageContentRecord = {
    pageHeading: string;
    pageIntro: string;
};

type CalculatorPageContentApiResponse = {
    success: boolean;
    item?: CalculatorPageContentRecord;
};

type ManagedCalculatorHeroOverridesProps = {
    slug: string;
};

function updateElementText(element: Element | null, nextValue: string) {
    if (!(element instanceof HTMLElement)) {
        return;
    }

    if (!element.dataset.managedOriginalText) {
        element.dataset.managedOriginalText = element.textContent ?? "";
    }

    element.textContent = nextValue || element.dataset.managedOriginalText;
}

function findIntroParagraph(root: Element, heading: HTMLHeadingElement) {
    const paragraphs = Array.from(root.querySelectorAll("p"));

    return (
        paragraphs.find(
            (paragraph) =>
                Boolean(heading.compareDocumentPosition(paragraph) & Node.DOCUMENT_POSITION_FOLLOWING)
        ) ?? null
    );
}

export default function ManagedCalculatorHeroOverrides({
    slug,
}: ManagedCalculatorHeroOverridesProps) {
    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const loadOverrides = async () => {
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

                const root = document.querySelector("[data-page-content-root]");

                if (!(root instanceof HTMLElement)) {
                    return;
                }

                const heading = root.querySelector("h1");
                const introParagraph =
                    heading instanceof HTMLHeadingElement ? findIntroParagraph(root, heading) : null;

                updateElementText(heading, data.item.pageHeading);
                updateElementText(introParagraph, data.item.pageIntro);
            } catch (error) {
                if ((error instanceof Error ? error.name : "") !== "AbortError") {
                    console.error("Failed to load calculator hero overrides:", error);
                }
            }
        };

        void loadOverrides();

        return () => {
            isMounted = false;
            controller.abort();
        };
    }, [slug]);

    return null;
}
