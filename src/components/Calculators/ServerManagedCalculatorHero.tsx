import type { CalculatorPageContentRecord } from "@/lib/calculator-page-content";

type ServerManagedCalculatorHeroProps = {
    item: CalculatorPageContentRecord;
};

export default function ServerManagedCalculatorHero({
    item,
}: ServerManagedCalculatorHeroProps) {
    if (!item.hasHeroOverrides) {
        return null;
    }

    const heading = item.pageHeading || item.defaultTitle || item.title;
    const intro = item.pageIntro || item.defaultDescription || item.description;

    return (
        <div className="container mx-auto px-4 md:px-6 2xl:max-w-[1400px]">
            <div className="mx-auto mt-8 max-w-4xl text-center md:mt-16">
                <h1 className="text-3xl font-semibold tracking-tight text-slate-950 lg:text-4xl">
                    {heading}
                </h1>
                {intro ? (
                    <div
                        className="mt-4 text-lg leading-8 text-slate-600 md:text-xl [&_a]:text-primary [&_a]:underline [&_blockquote]:border-l-4 [&_blockquote]:border-primary/30 [&_blockquote]:pl-4 [&_blockquote]:italic [&_h2]:mt-6 [&_h2]:text-2xl [&_h2]:font-semibold [&_h3]:mt-5 [&_h3]:text-xl [&_h3]:font-semibold [&_li]:mb-2 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:mb-4 [&_strong]:font-semibold [&_ul]:list-disc [&_ul]:pl-6"
                        dangerouslySetInnerHTML={{ __html: intro }}
                    />
                ) : null}
            </div>
        </div>
    );
}
