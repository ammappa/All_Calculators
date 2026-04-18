import type { Metadata } from "next";
import Link from "next/link";

import Wrapper from "@/app/Wrapper";
import JsonLd from "@/components/seo/JsonLd";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getBlogPosts } from "@/lib/blog";
import { calculatorCatalog } from "@/lib/calculator-catalog";
import { buildSearchResultsSchemas } from "@/lib/seo";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

export const metadata: Metadata = {
    title: "Search",
    description: "Search WithinSecs calculators and blog content.",
    alternates: {
        canonical: "/search",
    },
};

export default async function SearchPage(props: {
    searchParams: Promise<{ q?: string }>;
}) {
    const searchParams = await props.searchParams;
    const query = String(searchParams.q ?? "").trim();
    const normalizedQuery = query.toLowerCase();
    const calculators = normalizedQuery
        ? calculatorCatalog.filter((item) => {
              const haystack = `${item.title} ${item.subTitle} ${item.description}`.toLowerCase();
              return haystack.includes(normalizedQuery);
          })
        : [];
    const posts = normalizedQuery ? await getBlogPosts({ search: query, publishedOnly: true }) : [];
    const resultCount = calculators.length + posts.length;

    return (
        <Wrapper>
            <div className="container mx-auto px-4 py-10 md:px-6 2xl:max-w-[1400px]">
                <JsonLd id="search-page-schema" data={buildSearchResultsSchemas(query, resultCount)} />

                <div className="mx-auto max-w-3xl text-center">
                    <h1 className="text-3xl font-semibold tracking-tight lg:text-4xl">Search</h1>
                    <p className="page-summary mt-4 text-lg text-muted-foreground">
                        Search calculators and articles across WithinSecs.
                    </p>
                    <form action="/search" className="mt-6">
                        <Input
                            name="q"
                            defaultValue={query}
                            placeholder="Search calculators or blog articles"
                            className="h-12"
                        />
                    </form>
                </div>

                <div className="mx-auto mt-10 max-w-5xl space-y-8">
                    {query ? (
                        <p className="text-sm text-muted-foreground">
                            {resultCount} result{resultCount === 1 ? "" : "s"} for &quot;{query}&quot;.
                        </p>
                    ) : (
                        <p className="text-sm text-muted-foreground">
                            Enter a search term to find calculators and blog content.
                        </p>
                    )}

                    {calculators.length > 0 ? (
                        <section className="space-y-4">
                            <div className="flex items-center gap-2">
                                <Badge variant="outline">Calculators</Badge>
                                <span className="text-sm text-muted-foreground">
                                    {calculators.length} matches
                                </span>
                            </div>
                            <div className="grid gap-4 md:grid-cols-2">
                                {calculators.map((calculator) => (
                                    <Card key={calculator.slug}>
                                        <CardContent className="p-5">
                                            <Link href={calculator.path} className="text-lg font-semibold hover:underline">
                                                {calculator.title}
                                            </Link>
                                            <p className="mt-2 text-sm text-muted-foreground">
                                                {calculator.description}
                                            </p>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </section>
                    ) : null}

                    {posts.length > 0 ? (
                        <section className="space-y-4">
                            <div className="flex items-center gap-2">
                                <Badge variant="outline">Blog</Badge>
                                <span className="text-sm text-muted-foreground">
                                    {posts.length} matches
                                </span>
                            </div>
                            <div className="space-y-4">
                                {posts.map((post) => (
                                    <Card key={post.id}>
                                        <CardContent className="p-5">
                                            <Link href={`/blog/${post.slug}`} className="text-lg font-semibold hover:underline">
                                                {post.title}
                                            </Link>
                                            <p className="mt-2 text-sm text-muted-foreground">
                                                {post.excerpt}
                                            </p>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </section>
                    ) : null}

                    {query && resultCount === 0 ? (
                        <div className="rounded-xl border border-dashed px-6 py-12 text-center text-sm text-muted-foreground">
                            No results found. Try a shorter phrase or a specific calculator name.
                        </div>
                    ) : null}
                </div>
            </div>
        </Wrapper>
    );
}
