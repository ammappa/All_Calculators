import Link from "next/link";
import { BookOpen, CheckCircle2 } from "lucide-react";

import Wrapper from "@/app/Wrapper";

const principles = [
    "Content is written to be clear, practical, and useful for real-world decision making.",
    "Calculator explanations are reviewed for consistency with the formulas used on the site.",
    "We revise content when tools, assumptions, or user needs change.",
    "Educational content is not a substitute for licensed legal, financial, tax, or medical advice.",
];

export default function EditorialPolicyPage() {
    return (
        <Wrapper>
            <div className="min-h-screen bg-slate-50">
                <div className="mx-auto max-w-5xl px-4 py-16 md:px-8">
                    <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm md:p-10">
                        <div className="flex items-center gap-4">
                            <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-800">
                                <BookOpen className="h-5 w-5" />
                            </span>
                            <div>
                                <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
                                    Editorial Policy
                                </h1>
                                <p className="mt-2 text-sm text-slate-600">
                                    How content is prepared and maintained across WITHINSECS.
                                </p>
                            </div>
                        </div>

                        <div className="mt-8 space-y-6 text-slate-600">
                            <p className="leading-8">
                                WITHINSECS publishes calculator content, supporting explanations,
                                and informational articles to help users understand formulas,
                                assumptions, and use cases more easily.
                            </p>
                            <p className="leading-8">
                                Our goal is to keep calculator pages understandable, consistent,
                                and useful for everyday financial, health, lifestyle, and math
                                decisions.
                            </p>
                        </div>

                        <div className="mt-8 grid gap-4">
                            {principles.map((item) => (
                                <div key={item} className="flex gap-3 rounded-2xl bg-slate-50 p-4">
                                    <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-sky-600" />
                                    <p className="text-sm leading-7 text-slate-700">{item}</p>
                                </div>
                            ))}
                        </div>

                        <div className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                            <p className="text-sm text-slate-600">
                                Questions about our content standards?
                            </p>
                            <Link
                                href="/contact"
                                className="mt-3 inline-flex text-sm font-medium text-slate-900 hover:text-slate-700"
                            >
                                Contact Us
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </Wrapper>
    );
}
