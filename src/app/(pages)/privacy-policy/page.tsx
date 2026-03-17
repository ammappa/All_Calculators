import Link from "next/link";
import { LockKeyhole, ShieldCheck } from "lucide-react";

import Wrapper from "@/app/Wrapper";

const sections = [
    "We may collect information you provide directly through contact forms and dashboard workflows.",
    "Basic analytics, browser, or technical data may be used to improve site performance and usability.",
    "We do not sell personal information to third parties.",
    "Users can contact us to ask questions about how their information is handled.",
];

export default function PrivacyPolicyPage() {
    return (
        <Wrapper>
            <div className="min-h-screen bg-slate-50">
                <div className="mx-auto max-w-5xl px-4 py-16 md:px-8">
                    <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm md:p-10">
                        <div className="flex items-center gap-4">
                            <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-800">
                                <LockKeyhole className="h-5 w-5" />
                            </span>
                            <div>
                                <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
                                    Privacy Policy
                                </h1>
                                <p className="mt-2 text-sm text-slate-600">
                                    A brief overview of how information is handled on WITHINSECS.
                                </p>
                            </div>
                        </div>

                        <div className="mt-8 grid gap-4">
                            {sections.map((item) => (
                                <div key={item} className="flex gap-3 rounded-2xl bg-slate-50 p-4">
                                    <ShieldCheck className="mt-1 h-5 w-5 shrink-0 text-sky-600" />
                                    <p className="text-sm leading-7 text-slate-700">{item}</p>
                                </div>
                            ))}
                        </div>

                        <div className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                            <p className="text-sm text-slate-600">
                                If you have privacy-related questions, please reach out.
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
