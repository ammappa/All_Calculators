import Link from "next/link";
import {
    ArrowRight,
    BriefcaseBusiness,
    CalendarDays,
    CheckCircle2,
    HeartPulse,
    Landmark,
    Sigma,
    Sparkles,
    type LucideIcon,
} from "lucide-react";

import Wrapper from "@/app/Wrapper";
import AdsenseAd from "@/components/AdsenseAd";
import BlogSectionSlider from "@/components/BlogSectionSlider";
import HeroCalculator from "@/components/Home/HeroCalculator";
import Services from "@/components/Home/Services";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    calculatorCategoryLabels,
    calculatorCategoryOrder,
    groupCalculatorsByCategory,
    type CalculatorCategory,
} from "@/lib/calculator-catalog";
import { getVisibleCalculatorCatalogSafe } from "@/lib/calculator-visibility";
import { siteConfig } from "@/lib/siteConfig";

const featuredPriority = [
    "emi-calculator",
    "401k-calculator",
    "currency-converter",
    "health/bmi-calculator",
    "math/percentage-calculator",
    "lifestyle/age-calculator",
    "mortgage-calculator",
    "health/calorie-calculator",
];

const collectionDescriptions: Record<CalculatorCategory, string> = {
    finance: "Loans, mortgages, investing, savings, tax planning, and quick money math.",
    health: "Fitness, body metrics, calories, pregnancy, and wellness tracking tools.",
    lifestyle: "Everyday calculators for time, travel, shopping, school, and planning.",
    math: "Percentages, averages, algebra, scientific math, and unit conversions.",
};

const categoryIconMap: Record<CalculatorCategory, LucideIcon> = {
    finance: Landmark,
    health: HeartPulse,
    lifestyle: Sparkles,
    math: Sigma,
};

const contentSections = [
    {
        eyebrow: "Financial Calculators",
        title: "Financial calculators for smarter money decisions",
        intro: "Financial planning becomes easier when you have the right tools. These calculators help users evaluate loans, investments, retirement savings, inflation, debt payoff, and property decisions with more clarity.",
        icon: Landmark,
        items: [
            "Estimate monthly payments and total interest before taking a loan.",
            "Use mortgage and EMI tools to plan home financing more confidently.",
            "Project long-term growth with compound interest and retirement savings calculators.",
            "Compare rent versus buy, evaluate ROI, and review inflation impact over time.",
            "Check crypto gains, early payoff scenarios, and wealth-building targets in seconds.",
        ],
    },
    {
        eyebrow: "Health and Fitness",
        title: "Health and fitness calculators for a better lifestyle",
        intro: "Wellness calculators make it easier to monitor body metrics, calorie needs, hydration, and planning for important life stages.",
        icon: HeartPulse,
        items: [
            "Estimate body fat percentage and healthy weight ranges.",
            "Calculate macros for weight loss and daily calorie needs with TDEE-based tools.",
            "Review daily water intake goals based on activity and routine.",
            "Track pregnancy timelines with due date planning support.",
        ],
    },
    {
        eyebrow: "Math and Science",
        title: "Math and scientific calculators for study and problem solving",
        intro: "Students, engineers, and professionals often need reliable tools for formulas, conversions, and advanced calculations.",
        icon: Sigma,
        items: [
            "Use a scientific calculator online for trigonometry, logarithms, and exponents.",
            "Solve everyday math with percentage, average, and conversion tools.",
            "Handle algebra-style tasks and technical calculations without switching sites.",
            "Work faster on school, office, or technical problems that require precise answers.",
        ],
    },
    {
        eyebrow: "Salary and Business",
        title: "Salary, freelance, and business calculators",
        intro: "Income planning is easier when employees, freelancers, and businesses can estimate earnings, pricing, and returns from one place.",
        icon: BriefcaseBusiness,
        items: [
            "Estimate net income with salary after tax style calculations.",
            "Set better freelance pricing based on income targets and expenses.",
            "Use ROI-oriented tools to evaluate business and startup decisions.",
            "Compare financial outcomes quickly before committing to a new plan or investment.",
        ],
    },
    {
        eyebrow: "Everyday Planning",
        title: "Everyday planning calculators",
        intro: "Daily decisions often involve budgeting, scheduling, and planning. Simple calculators reduce guesswork and keep those tasks manageable.",
        icon: CalendarDays,
        items: [
            "Plan wedding budgets with cost estimates for venues, catering, and decorations.",
            "Estimate travel budgets for transport, accommodation, and daily expenses.",
            "Calculate exact age from date of birth for records and personal use.",
            "Handle practical day-to-day calculations without relying on spreadsheets.",
        ],
    },
] as const;

const whyUsePoints = [
    "Simple and user-friendly calculators",
    "Accurate formulas and reliable results",
    "Free tools available instantly online",
    "Useful for students, professionals, and businesses",
    "Wide range of financial, health, math, and lifestyle calculators",
];

const explorePoints = [
    "Manage loans and personal finances",
    "Plan investments and retirement savings",
    "Track health and fitness metrics",
    "Solve mathematical and scientific problems",
    "Plan events, travel, and daily activities",
];

export default async function Page() {
    const visibleCalculators = await getVisibleCalculatorCatalogSafe();
    const groupedCalculators = groupCalculatorsByCategory(visibleCalculators);
    const prioritizedFeaturedCalculators = featuredPriority
        .map((slug) => visibleCalculators.find((calculator) => calculator.slug === slug))
        .filter(
            (calculator): calculator is (typeof visibleCalculators)[number] =>
                calculator !== undefined
        );
    const featuredCalculatorSlugs = new Set(
        prioritizedFeaturedCalculators.map((calculator) => calculator.slug)
    );
    const featuredCalculators = [
        ...prioritizedFeaturedCalculators,
        ...visibleCalculators.filter((calculator) => !featuredCalculatorSlugs.has(calculator.slug)),
    ].slice(0, 6);

    const collections = calculatorCategoryOrder.map((category) => ({
        key: category,
        title: calculatorCategoryLabels[category],
        description: collectionDescriptions[category],
        count: groupedCalculators[category].length,
    }));

    const heroStats = [
        {
            label: "Live calculators",
            value: `${visibleCalculators.length}+`,
        },
        {
            label: "Collections",
            value: `${collections.length}`,
        },
        {
            label: "Quick picks",
            value: `${featuredCalculators.length}`,
        },
    ];

    return (
        <Wrapper className="overflow-x-hidden">
            <section className="relative overflow-hidden pb-14 pt-8 md:pb-24 md:pt-12">
                <div className="absolute inset-x-0 top-0 -z-10 h-[42rem] bg-[linear-gradient(180deg,rgba(239,246,255,0.95)_0%,rgba(255,255,255,0.9)_55%,rgba(255,255,255,0)_100%)]" />
                <div className="absolute left-0 top-10 -z-10 h-72 w-72 rounded-full bg-sky-200/50 blur-3xl" />
                <div className="absolute right-0 top-28 -z-10 h-80 w-80 rounded-full bg-slate-300/35 blur-3xl" />

                <div className="mx-auto grid max-w-7xl gap-10 px-5 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
                    <div className="space-y-8">
                        <Badge
                            variant="outline"
                            className="rounded-full border-slate-200 bg-white/85 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-600 shadow-sm backdrop-blur"
                        >
                            {siteConfig.name} Calculator Studio
                        </Badge>

                        <div className="space-y-5">
                            <h1 className="max-w-4xl text-5xl font-bold tracking-tight text-balance text-slate-950 md:text-6xl xl:text-6xl">
                                Free online calculators for finance, health, math, and everyday life.
                            </h1>
                            <p className="max-w-3xl text-lg leading-8 text-slate-600 md:text-xl">
                                Welcome to {siteConfig.name}, a growing platform of free online
                                calculators built to solve financial, health, math, and daily
                                planning problems within seconds. Estimate loan payments, review
                                investment returns, calculate calorie needs, or plan retirement
                                savings from one clear and easy-to-use place.
                            </p>
                            <p className="max-w-3xl text-base leading-8 text-slate-600 md:text-lg">
                                Our mission is simple: make calculations easy for everyone. From
                                personal finance to scientific math, {siteConfig.name} helps
                                individuals, students, professionals, and businesses make smarter
                                decisions with fast and user-friendly tools.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <Button asChild size="lg" className="rounded-full px-7">
                                <Link href="/calculators">
                                    Browse Calculators
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                            <Button asChild size="lg" variant="outline" className="rounded-full px-7">
                                <Link href="/blog">Read Blog Guides</Link>
                            </Button>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-3">
                            {heroStats.map((item) => (
                                <div
                                    key={item.label}
                                    className="rounded-[24px] border border-slate-200/80 bg-white/80 px-5 py-4 shadow-[0_14px_40px_-28px_rgba(15,23,42,0.35)] backdrop-blur"
                                >
                                    <p className="text-3xl font-semibold text-slate-950">
                                        {item.value}
                                    </p>
                                    <p className="mt-1 text-sm text-slate-600">{item.label}</p>
                                </div>
                            ))}
                        </div>

                        <div className="rounded-[30px] border border-slate-200/80 bg-white/78 p-5 shadow-[0_24px_70px_-40px_rgba(15,23,42,0.45)] backdrop-blur">
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-500">
                                        Featured Calculators
                                    </p>
                                    <p className="mt-2 text-sm leading-7 text-slate-600">
                                        Jump directly into the most useful tools for finance,
                                        wellness, and everyday calculations.
                                    </p>
                                </div>

                                <Link
                                    href="/calculators"
                                    className="inline-flex items-center gap-2 text-sm font-medium text-slate-900"
                                >
                                    View all
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                            </div>

                            <div className="mt-5 flex flex-wrap gap-3">
                                {featuredCalculators.map((calculator) => {
                                    const Icon = categoryIconMap[calculator.category];

                                    return (
                                        <Link
                                            key={calculator.slug}
                                            href={calculator.path}
                                            className="group inline-flex items-center gap-3 rounded-full border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:text-slate-950"
                                        >
                                            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-700">
                                                <Icon className="h-4 w-4" />
                                            </span>
                                            <span>{calculator.title}</span>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <HeroCalculator />

                        <div className="grid gap-3 sm:grid-cols-3">
                            {collections.slice(0, 3).map((collection) => {
                                const Icon = categoryIconMap[collection.key];

                                return (
                                    <div
                                        key={collection.key}
                                        className="rounded-[24px] border border-slate-200/80 bg-white/85 px-4 py-4 shadow-[0_16px_40px_-32px_rgba(15,23,42,0.4)] backdrop-blur"
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                                                <Icon className="h-4 w-4" />
                                            </span>
                                            <div>
                                                <p className="text-sm font-semibold text-slate-950">
                                                    {collection.title}
                                                </p>
                                                <p className="text-xs text-slate-500">
                                                    {collection.count} live tools
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>

            <AdsenseAd placement="homeTop" />

            <div className="mt-14 md:mt-20">
                <Services collections={collections} />
            </div>

            <div className="container mx-auto mt-14 px-4 md:mt-20 2xl:max-w-[1400px]">
                <div className="rounded-[34px] border border-slate-200/80 bg-white p-6 shadow-[0_30px_90px_-55px_rgba(15,23,42,0.45)] md:p-10">
                    <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.34em] text-slate-500">
                                Welcome to {siteConfig.name}
                            </p>
                            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 md:text-5xl">
                                Powerful calculators built for faster everyday decisions.
                            </h2>
                        </div>
                        <div className="space-y-5 text-base leading-8 text-slate-600 md:text-lg">
                            <p>
                                Financial planning becomes easier when you have the right tools,
                                and the same is true for health tracking, study support, and
                                personal planning. This platform brings those calculators together
                                in one place so users can solve real problems without jumping across
                                multiple websites.
                            </p>
                            <p>
                                Whether you want to estimate a loan payment, understand inflation,
                                plan your savings, calculate body metrics, solve math problems, or
                                organize life events, {siteConfig.name} is designed to give you
                                accurate answers quickly and keep the experience easy to follow.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto mt-14 px-4 md:mt-20 2xl:max-w-[1400px]">
                <div className="grid gap-5 xl:grid-cols-2">
                    {contentSections.map((section) => {
                        const Icon = section.icon;

                        return (
                            <section
                                key={section.title}
                                className="rounded-[30px] border border-slate-200/80 bg-white p-6 shadow-[0_24px_70px_-52px_rgba(15,23,42,0.38)] md:p-8"
                            >
                                <div className="flex items-start gap-4">
                                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-800">
                                        <Icon className="h-5 w-5" />
                                    </span>
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                                            {section.eyebrow}
                                        </p>
                                        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950 md:text-3xl">
                                            {section.title}
                                        </h2>
                                        <p className="mt-4 text-base leading-8 text-slate-600">
                                            {section.intro}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-6 space-y-4">
                                    {section.items.map((item) => (
                                        <div key={item} className="flex items-start gap-3 rounded-2xl bg-slate-50 px-4 py-4">
                                            <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-sky-600" />
                                            <p className="text-sm leading-7 text-slate-700 md:text-base">
                                                {item}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        );
                    })}
                </div>
            </div>

            <div className="container mx-auto mt-14 px-4 md:mt-20 2xl:max-w-[1400px]">
                <div className="overflow-hidden rounded-[34px] border border-slate-200/80 bg-[linear-gradient(135deg,#ffffff_0%,#eff6ff_45%,#f8fafc_100%)] p-6 shadow-[0_30px_90px_-55px_rgba(15,23,42,0.45)] md:p-8">
                    <div className="max-w-2xl">
                        <p className="text-xs font-semibold uppercase tracking-[0.34em] text-slate-500">
                            Why Use {siteConfig.name}
                        </p>
                        <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 md:text-5xl">
                            Fast, accurate, and easy-to-use calculators for users around the world.
                        </h2>
                        <p className="mt-4 text-base leading-8 text-slate-600 md:text-lg">
                            Whether you are calculating loan payments, planning retirement savings,
                            tracking fitness goals, or solving math problems, {siteConfig.name}
                            provides the tools you need to complete calculations within seconds.
                        </p>
                    </div>

                    <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                        {whyUsePoints.map((point) => (
                            <div
                                key={point}
                                className="rounded-[24px] border border-white/70 bg-white/85 p-5 shadow-[0_18px_45px_-35px_rgba(15,23,42,0.35)]"
                            >
                                <CheckCircle2 className="h-5 w-5 text-sky-600" />
                                <p className="mt-4 text-sm leading-7 text-slate-700">{point}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="mt-14 md:mt-20">
                <BlogSectionSlider />
            </div>

            <AdsenseAd placement="homeBottom" />

            <div className="mt-14 mb-10 md:mt-20">
                <div className="mx-auto max-w-6xl px-4">
                    <div className="overflow-hidden rounded-[36px] border border-slate-200/20 bg-[linear-gradient(140deg,#0f172a_0%,#111827_45%,#164e63_100%)] px-6 py-12 text-center shadow-[0_34px_80px_-45px_rgba(8,15,32,0.65)] md:px-10 md:py-16">
                        <p className="text-xs font-semibold uppercase tracking-[0.36em] text-sky-200">
                            Explore Our Calculators
                        </p>

                        <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white md:text-5xl">
                            Start exploring our calculators today.
                        </h2>

                        <p className="mx-auto mt-4 max-w-3xl text-lg leading-8 text-slate-300">
                            Browse our complete collection of tools and discover calculators that
                            help you manage loans, plan investments, track health metrics, solve
                            mathematical problems, and organize everyday life with less guesswork.
                        </p>

                        <div className="mx-auto mt-8 grid max-w-4xl gap-3 text-left md:grid-cols-2 xl:grid-cols-5">
                            {explorePoints.map((point) => (
                                <div key={point} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm leading-7 text-slate-200">
                                    {point}
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                            <Button asChild size="lg" variant="secondary" className="rounded-full px-7">
                                <Link href="/calculators">
                                    See All Calculators
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                            <Button asChild size="lg" variant="outline" className="rounded-full border-white/30 bg-white/5 px-7 text-white hover:bg-white/10 hover:text-white">
                                <Link href="/about">Learn More</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </Wrapper>
    );
}
