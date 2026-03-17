import Link from "next/link";
import { Cookie, Info } from "lucide-react";

import Wrapper from "@/app/Wrapper";

const cookieItems = [
    "Cookies may be used to support basic site functionality and remember useful preferences.",
    "Analytics or advertising-related tools may also place cookies to measure usage and improve performance.",
    "Users can manage or disable cookies through their browser settings.",
    "Continuing to use the site may indicate consent to the use of necessary cookies.",
];

export default function CookiePolicyPage() {
    return (
        <Wrapper>
            <div className="min-h-screen bg-slate-50">
                <div className="mx-auto max-w-5xl px-4 py-16 md:px-8">
                    <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm md:p-10">
                        <div className="flex items-center gap-4">
                            <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-800">
                                <Cookie className="h-5 w-5" />
                            </span>
                            <div>
                                <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
                                    Cookie Policy
                                </h1>
                                <p className="mt-2 text-sm text-slate-600">
                                    A simple explanation of how cookies may be used on the site.
                                </p>
                            </div>
                        </div>

                        <div className="mt-8 grid gap-4">
                            {cookieItems.map((item) => (
                                <div key={item} className="flex gap-3 rounded-2xl bg-slate-50 p-4">
                                    <Info className="mt-1 h-5 w-5 shrink-0 text-sky-600" />
                                    <p className="text-sm leading-7 text-slate-700">{item}</p>
                                </div>
                            ))}
                        </div>

                        <div className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                            <p className="text-sm text-slate-600">
                                For more details, review our privacy information or contact us.
                            </p>
                            <div className="mt-3 flex flex-wrap gap-4">
                                <Link
                                    href="/privacy-policy"
                                    className="text-sm font-medium text-slate-900 hover:text-slate-700"
                                >
                                    Privacy Policy
                                </Link>
                                <Link
                                    href="/contact"
                                    className="text-sm font-medium text-slate-900 hover:text-slate-700"
                                >
                                    Contact Us
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Wrapper>
    );
}
