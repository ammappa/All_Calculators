"use client";

import Link from "next/link";
import { ExternalLink, FileText, Plus, RefreshCw, Save, Search, Trash2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import RichTextEditor from "@/components/dashboard/RichTextEditor";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type CalculatorFaqItemRecord = {
    question: string;
    answer: string;
};

type CalculatorPageContentRecord = {
    slug: string;
    title: string;
    subTitle: string;
    path: string;
    category: string;
    description: string;
    defaultTitle: string;
    defaultSubTitle: string;
    defaultDescription: string;
    cardTitle: string;
    cardSubTitle: string;
    cardDescription: string;
    pageHeading: string;
    pageIntro: string;
    seoTitle: string;
    seoDescription: string;
    contentTitle: string;
    contentIntro: string;
    contentHtml: string;
    faqItems: CalculatorFaqItemRecord[];
    hasCardOverrides: boolean;
    hasHeroOverrides: boolean;
    hasSeoOverrides: boolean;
    hasCustomContent: boolean;
    updatedAt: string;
};

type CalculatorPagesApiResponse = {
    success: boolean;
    items: CalculatorPageContentRecord[];
    message?: string;
};

type CalculatorPageUpdateResponse = {
    success: boolean;
    item: CalculatorPageContentRecord;
    message?: string;
};

const emptyFaqItem = (): CalculatorFaqItemRecord => ({
    question: "",
    answer: "",
});

export default function DashboardCalculatorPagesPage() {
    const [items, setItems] = useState<CalculatorPageContentRecord[]>([]);
    const [selectedSlug, setSelectedSlug] = useState("calculators");
    const [draft, setDraft] = useState<CalculatorPageContentRecord | null>(null);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [dirty, setDirty] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const selectedSlugRef = useRef(selectedSlug);

    const loadItems = useCallback(async (showRefreshingState = false) => {
        if (showRefreshingState) {
            setRefreshing(true);
        } else {
            setLoading(true);
        }

        try {
            const response = await fetch("/api/admin/calculator-pages", {
                cache: "no-store",
            });
            const data: CalculatorPagesApiResponse = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.message ?? "Failed to load calculator pages.");
            }

            setItems(data.items);

            const currentSelectedSlug = selectedSlugRef.current;
            const nextSelectedSlug = data.items.some((item) => item.slug === currentSelectedSlug)
                ? currentSelectedSlug
                : data.items[0]?.slug ?? "calculators";
            const selectedItem =
                data.items.find((item) => item.slug === nextSelectedSlug) ?? data.items[0] ?? null;

            selectedSlugRef.current = nextSelectedSlug;
            setSelectedSlug(nextSelectedSlug);
            setDraft(selectedItem ? { ...selectedItem, faqItems: [...selectedItem.faqItems] } : null);
            setDirty(false);
            setError("");
        } catch (loadError) {
            console.error("Failed to load calculator pages:", loadError);
            setError(
                loadError instanceof Error
                    ? loadError.message
                    : "Failed to load calculator pages."
            );
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        void loadItems();
    }, [loadItems]);

    const filteredItems = useMemo(() => {
        const normalizedSearch = search.trim().toLowerCase();

        if (!normalizedSearch) {
            return items;
        }

        return items.filter((item) =>
            [item.title, item.subTitle, item.category, item.slug, item.path, item.description]
                .join(" ")
                .toLowerCase()
                .includes(normalizedSearch)
        );
    }, [items, search]);

    function selectItem(item: CalculatorPageContentRecord) {
        selectedSlugRef.current = item.slug;
        setSelectedSlug(item.slug);
        setDraft({
            ...item,
            faqItems: item.faqItems.map((faqItem) => ({
                ...faqItem,
            })),
        });
        setDirty(false);
        setError("");
        setSuccess("");
    }

    function updateDraft(
        field:
            | "cardTitle"
            | "cardSubTitle"
            | "cardDescription"
            | "pageHeading"
            | "pageIntro"
            | "seoTitle"
            | "seoDescription"
            | "contentTitle"
            | "contentIntro"
            | "contentHtml",
        value: string
    ) {
        setDraft((current) => (current ? { ...current, [field]: value } : current));
        setDirty(true);
        setSuccess("");
        setError("");
    }

    function updateFaqItem(
        index: number,
        field: "question" | "answer",
        value: string
    ) {
        setDraft((current) => {
            if (!current) {
                return current;
            }

            return {
                ...current,
                faqItems: current.faqItems.map((faqItem, faqIndex) =>
                    faqIndex === index
                        ? {
                              ...faqItem,
                              [field]: value,
                          }
                        : faqItem
                ),
            };
        });
        setDirty(true);
        setSuccess("");
        setError("");
    }

    function addFaqItem() {
        setDraft((current) =>
            current
                ? {
                      ...current,
                      faqItems: [...current.faqItems, emptyFaqItem()],
                  }
                : current
        );
        setDirty(true);
        setSuccess("");
        setError("");
    }

    function removeFaqItem(index: number) {
        setDraft((current) =>
            current
                ? {
                      ...current,
                      faqItems: current.faqItems.filter((_, faqIndex) => faqIndex !== index),
                  }
                : current
        );
        setDirty(true);
        setSuccess("");
        setError("");
    }

    async function handleSave() {
        if (!draft) {
            return;
        }

        setSaving(true);
        setError("");
        setSuccess("");

        try {
            const response = await fetch("/api/admin/calculator-pages", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    slug: draft.slug,
                    cardTitle: draft.cardTitle,
                    cardSubTitle: draft.cardSubTitle,
                    cardDescription: draft.cardDescription,
                    pageHeading: draft.pageHeading,
                    pageIntro: draft.pageIntro,
                    seoTitle: draft.seoTitle,
                    seoDescription: draft.seoDescription,
                    contentTitle: draft.contentTitle,
                    contentIntro: draft.contentIntro,
                    contentHtml: draft.contentHtml,
                    faqItems: draft.faqItems,
                }),
            });
            const data: CalculatorPageUpdateResponse = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.message ?? "Failed to save calculator page content.");
            }

            setItems((current) =>
                current.map((item) => (item.slug === data.item.slug ? data.item : item))
            );
            setDraft({
                ...data.item,
                faqItems: data.item.faqItems.map((faqItem) => ({
                    ...faqItem,
                })),
            });
            setDirty(false);
            setSuccess(data.message ?? "Calculator page content updated successfully.");
        } catch (saveError) {
            console.error("Failed to save calculator page content:", saveError);
            setError(
                saveError instanceof Error
                    ? saveError.message
                    : "Failed to save calculator page content."
            );
        } finally {
            setSaving(false);
        }
    }

    const selectedItemMeta = draft ?? items.find((item) => item.slug === selectedSlug) ?? null;
    const customContentCount = items.filter(
        (item) =>
            item.hasCustomContent ||
            item.hasCardOverrides ||
            item.hasHeroOverrides ||
            item.hasSeoOverrides
    ).length;
    const canEditCardContent = draft?.slug !== "calculators";

    return (
        <div className="flex w-full flex-col gap-6 p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Calculator Page Content
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Manage calculator card text plus the editable bottom content and FAQ
                        sections without changing calculator logic.
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <Badge variant="outline">{customContentCount} customized</Badge>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => void loadItems(true)}
                        disabled={loading || refreshing || saving}
                    >
                        <RefreshCw
                            className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
                        />
                        Refresh
                    </Button>
                    <Button
                        type="button"
                        onClick={() => void handleSave()}
                        disabled={!draft || loading || saving || !dirty}
                    >
                        <Save className="mr-2 h-4 w-4" />
                        {saving ? "Saving..." : "Save Content"}
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
                <Card className="h-fit shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-base">All Calculator Pages</CardTitle>
                        <CardDescription>
                            Pick a calculator, then edit its card content, SEO, and page content.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="relative">
                            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                                className="pl-9"
                                placeholder="Search calculators"
                            />
                        </div>

                        <div className="max-h-[70vh] space-y-2 overflow-y-auto pr-1">
                            {filteredItems.map((item) => (
                                <button
                                    key={item.slug}
                                    type="button"
                                    onClick={() => selectItem(item)}
                                    className={`w-full rounded-lg border p-3 text-left transition ${
                                        selectedSlug === item.slug
                                            ? "border-primary bg-primary/5"
                                            : "border-border hover:border-primary/40 hover:bg-muted/30"
                                    }`}
                                >
                                    <div className="flex items-start justify-between gap-2">
                                        <div>
                                            <p className="text-sm font-medium">{item.title}</p>
                                            <p className="mt-1 text-xs text-muted-foreground">
                                                {item.path}
                                            </p>
                                        </div>
                                        <Badge
                                            variant={
                                                item.hasCustomContent ||
                                                item.hasCardOverrides ||
                                                item.hasHeroOverrides ||
                                                item.hasSeoOverrides
                                                    ? "default"
                                                    : "outline"
                                            }
                                        >
                                            {item.hasCustomContent ||
                                            item.hasCardOverrides ||
                                            item.hasHeroOverrides ||
                                            item.hasSeoOverrides
                                                ? "Custom"
                                                : "Default"}
                                        </Badge>
                                    </div>
                                    <p className="mt-2 text-xs text-muted-foreground">
                                        {item.category}
                                    </p>
                                </button>
                            ))}

                            {!loading && filteredItems.length === 0 ? (
                                <div className="rounded-lg border border-dashed px-4 py-8 text-center text-sm text-muted-foreground">
                                    No calculator pages matched your search.
                                </div>
                            ) : null}
                        </div>
                    </CardContent>
                </Card>

                <div className="space-y-6">
                    <Card className="shadow-sm">
                        <CardHeader>
                            <div className="flex flex-wrap items-start justify-between gap-4">
                                <div>
                                    <CardTitle className="text-base">
                                        {selectedItemMeta?.title ?? "Select a page"}
                                    </CardTitle>
                                    <CardDescription>
                                        {selectedItemMeta?.description ??
                                            "Choose a calculator page from the left to start editing."}
                                    </CardDescription>
                                </div>
                                {selectedItemMeta ? (
                                    <Button asChild variant="outline" size="sm">
                                        <Link href={selectedItemMeta.path} target="_blank">
                                            <ExternalLink className="mr-2 h-4 w-4" />
                                            View Page
                                        </Link>
                                    </Button>
                                ) : null}
                            </div>
                        </CardHeader>

                        <CardContent className="space-y-5">
                            {selectedItemMeta ? (
                                <>
                                    <div className="grid gap-4 md:grid-cols-3">
                                        <div className="rounded-lg border bg-muted/20 px-4 py-3">
                                            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                                                Category
                                            </p>
                                            <p className="mt-2 text-sm font-medium">
                                                {selectedItemMeta.category}
                                            </p>
                                        </div>
                                        <div className="rounded-lg border bg-muted/20 px-4 py-3">
                                            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                                                Route
                                            </p>
                                            <p className="mt-2 text-sm font-medium">
                                                {selectedItemMeta.path}
                                            </p>
                                        </div>
                                        <div className="rounded-lg border bg-muted/20 px-4 py-3">
                                            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                                                Card Status
                                            </p>
                                            <p className="mt-2 text-sm font-medium">
                                                {selectedItemMeta.hasCardOverrides
                                                    ? "Customized"
                                                    : "Using defaults"}
                                            </p>
                                        </div>
                                        <div className="rounded-lg border bg-muted/20 px-4 py-3">
                                            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                                                Top Hero
                                            </p>
                                            <p className="mt-2 text-sm font-medium">
                                                {selectedItemMeta.hasHeroOverrides
                                                    ? "Customized"
                                                    : "Using defaults"}
                                            </p>
                                        </div>
                                        <div className="rounded-lg border bg-muted/20 px-4 py-3">
                                            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                                                SEO
                                            </p>
                                            <p className="mt-2 text-sm font-medium">
                                                {selectedItemMeta.hasSeoOverrides
                                                    ? "Customized"
                                                    : "Using defaults"}
                                            </p>
                                        </div>
                                        <div className="rounded-lg border bg-muted/20 px-4 py-3">
                                            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                                                Bottom Content
                                            </p>
                                            <p className="mt-2 text-sm font-medium">
                                                {selectedItemMeta.hasCustomContent
                                                    ? "Customized"
                                                    : "Using defaults"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="rounded-lg border bg-slate-50/70 px-4 py-3 text-sm text-muted-foreground">
                                        Card fields control the calculator cards on the public
                                        calculators listing. Top hero fields control the heading and
                                        intro on the calculator page. SEO fields control the title
                                        tag and meta description. Bottom section fields control the extra
                                        content and FAQ shown below the calculator tool.
                                    </div>
                                </>
                            ) : (
                                <p className="text-sm text-muted-foreground">
                                    Select a calculator page from the list.
                                </p>
                            )}
                        </CardContent>
                    </Card>

                    {error ? (
                        <div className="rounded-lg border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive">
                            {error}
                        </div>
                    ) : null}

                    {success ? (
                        <div className="rounded-lg border border-emerald-500/40 bg-emerald-500/5 p-4 text-sm text-emerald-700">
                            {success}
                        </div>
                    ) : null}

                    {draft ? (
                        <Card className="shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-base">
                                    Managed Content Editor
                                </CardTitle>
                                <CardDescription>
                                    Edit calculator card text, the top hero copy, SEO metadata,
                                    and the bottom content section.
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="space-y-8">
                                {canEditCardContent ? (
                                    <div className="space-y-5">
                                        <div>
                                            <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                                                Calculator Card
                                            </h3>
                                            <p className="mt-1 text-sm text-muted-foreground">
                                                This controls the title, subtitle, and description on
                                                the calculator cards page.
                                            </p>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="card-title">Card Title</Label>
                                            <Input
                                                id="card-title"
                                                value={draft.cardTitle}
                                                onChange={(event) =>
                                                    updateDraft("cardTitle", event.target.value)
                                                }
                                                placeholder={draft.defaultTitle}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="card-sub-title">Card Subtitle</Label>
                                            <Input
                                                id="card-sub-title"
                                                value={draft.cardSubTitle}
                                                onChange={(event) =>
                                                    updateDraft("cardSubTitle", event.target.value)
                                                }
                                                placeholder={draft.defaultSubTitle}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="card-description">Card Description</Label>
                                            <Textarea
                                                id="card-description"
                                                value={draft.cardDescription}
                                                onChange={(event) =>
                                                    updateDraft("cardDescription", event.target.value)
                                                }
                                                placeholder={draft.defaultDescription}
                                                className="min-h-24"
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="rounded-lg border bg-slate-50/70 px-4 py-3 text-sm text-muted-foreground">
                                        The main calculators directory does not have a single public
                                        card, so only bottom content is editable for this page.
                                    </div>
                                )}

                                <div className="space-y-5">
                                    <div>
                                        <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                                            Top Page Hero
                                        </h3>
                                        <p className="mt-1 text-sm text-muted-foreground">
                                            This controls the main heading and intro paragraph at the
                                            top of the calculator page. Leave blank to keep the
                                            current hardcoded text.
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="page-heading">Top Page Heading</Label>
                                        <Input
                                            id="page-heading"
                                            value={draft.pageHeading}
                                            onChange={(event) =>
                                                updateDraft("pageHeading", event.target.value)
                                            }
                                            placeholder="Leave blank to keep the current heading"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="page-intro">Top Intro Paragraph</Label>
                                        <RichTextEditor
                                            value={draft.pageIntro}
                                            onChange={(value) => updateDraft("pageIntro", value)}
                                            placeholder="Leave blank to keep the current intro paragraph"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-5">
                                    <div>
                                        <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                                            SEO Settings
                                        </h3>
                                        <p className="mt-1 text-sm text-muted-foreground">
                                            This controls the title tag and search engine meta
                                            description for this calculator page.
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="seo-title">SEO Title</Label>
                                        <Input
                                            id="seo-title"
                                            value={draft.seoTitle}
                                            onChange={(event) =>
                                                updateDraft("seoTitle", event.target.value)
                                            }
                                            placeholder={
                                                draft.pageHeading ||
                                                draft.defaultTitle ||
                                                "Enter an SEO page title"
                                            }
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="seo-description">SEO Meta Description</Label>
                                        <Textarea
                                            id="seo-description"
                                            value={draft.seoDescription}
                                            onChange={(event) =>
                                                updateDraft("seoDescription", event.target.value)
                                            }
                                            placeholder={
                                                draft.pageIntro ||
                                                draft.defaultDescription ||
                                                "Enter a short SEO description"
                                            }
                                            className="min-h-24"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-5">
                                    <div>
                                        <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                                            Bottom Section
                                        </h3>
                                        <p className="mt-1 text-sm text-muted-foreground">
                                            This appears below the calculator tool on the public
                                            page.
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="content-title">Bottom Section Title</Label>
                                        <Input
                                            id="content-title"
                                            value={draft.contentTitle}
                                            onChange={(event) =>
                                                updateDraft("contentTitle", event.target.value)
                                            }
                                            placeholder={`More about ${draft.title}`}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="content-intro">Bottom Section Intro</Label>
                                        <RichTextEditor
                                            value={draft.contentIntro}
                                            onChange={(value) => updateDraft("contentIntro", value)}
                                            placeholder="Add a short explanation for the section."
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Bottom Rich Content</Label>
                                        <RichTextEditor
                                            value={draft.contentHtml}
                                            onChange={(value) => updateDraft("contentHtml", value)}
                                            placeholder="Write the long-form calculator content here..."
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between gap-3">
                                        <div>
                                            <Label>FAQ Items</Label>
                                            <p className="mt-1 text-xs text-muted-foreground">
                                                Add optional FAQs shown below the bottom content section.
                                            </p>
                                        </div>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={addFaqItem}
                                        >
                                            <Plus className="mr-2 h-4 w-4" />
                                            Add FAQ
                                        </Button>
                                    </div>

                                    <div className="space-y-4">
                                        {draft.faqItems.length > 0 ? (
                                            draft.faqItems.map((faqItem, index) => (
                                                <div
                                                    key={`${draft.slug}-faq-${index}`}
                                                    className="rounded-lg border p-4"
                                                >
                                                    <div className="mb-4 flex items-center justify-between gap-3">
                                                        <div className="flex items-center gap-2">
                                                            <FileText className="h-4 w-4 text-muted-foreground" />
                                                            <p className="text-sm font-medium">
                                                                FAQ {index + 1}
                                                            </p>
                                                        </div>
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => removeFaqItem(index)}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>

                                                    <div className="space-y-4">
                                                        <div className="space-y-2">
                                                            <Label
                                                                htmlFor={`${draft.slug}-faq-question-${index}`}
                                                            >
                                                                Question
                                                            </Label>
                                                            <Input
                                                                id={`${draft.slug}-faq-question-${index}`}
                                                                value={faqItem.question}
                                                                onChange={(event) =>
                                                                    updateFaqItem(
                                                                        index,
                                                                        "question",
                                                                        event.target.value
                                                                    )
                                                                }
                                                                placeholder="Enter the FAQ question"
                                                            />
                                                        </div>

                                                        <div className="space-y-2">
                                                            <Label
                                                                htmlFor={`${draft.slug}-faq-answer-${index}`}
                                                            >
                                                                Answer
                                                            </Label>
                                                            <Textarea
                                                                id={`${draft.slug}-faq-answer-${index}`}
                                                                value={faqItem.answer}
                                                                onChange={(event) =>
                                                                    updateFaqItem(
                                                                        index,
                                                                        "answer",
                                                                        event.target.value
                                                                    )
                                                                }
                                                                placeholder="Enter the FAQ answer"
                                                                className="min-h-24"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="rounded-lg border border-dashed px-4 py-8 text-center text-sm text-muted-foreground">
                                                No FAQs added yet for this calculator page.
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ) : null}
                </div>
            </div>
        </div>
    );
}
