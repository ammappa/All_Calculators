import type { CalculatorCategory, CalculatorCatalogItem } from "@/lib/calculator-catalog";

import JsonLd from "@/components/seo/JsonLd";
import CalculatorCard from "@/components/Calculators/CalculatorCard";
import { buildCollectionPageSchemas } from "@/lib/seo";

type CalculatorCategoryPageProps = {
    category: CalculatorCategory;
    label: string;
    title: string;
    description: string;
    path: string;
    items: CalculatorCatalogItem[];
};

export default function CalculatorCategoryPage({
    category,
    label,
    title,
    description,
    path,
    items,
}: CalculatorCategoryPageProps) {
    return (
        <>
            <JsonLd
                id={`calculator-category-schema-${category}`}
                data={buildCollectionPageSchemas({
                    category,
                    label,
                    title,
                    description,
                    path,
                    items,
                })}
            />

            <div className="container mx-auto px-4 md:px-6 2xl:max-w-[1400px]">
                <div className="mx-auto mt-8 max-w-3xl text-center md:mt-16">
                    <h1 className="text-3xl font-semibold lg:text-4xl">{title}</h1>
                    <p className="page-summary text-muted-foreground mt-4 text-xl">
                        {description}
                    </p>
                </div>
            </div>

            <div className="mx-auto my-8 max-w-7xl p-5 md:my-16 md:px-12">
                {items.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
                        {items.map((item) => (
                            <CalculatorCard key={item.slug} {...item} />
                        ))}
                    </div>
                ) : (
                    <div className="rounded-xl border border-dashed px-6 py-14 text-center text-sm text-muted-foreground">
                        No {label.toLowerCase()} calculators are enabled right now.
                    </div>
                )}
            </div>
        </>
    );
}
