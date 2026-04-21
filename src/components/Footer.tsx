import Link from "next/link";
import {
    FaEnvelope,
    FaInstagram,
    FaLinkedinIn,
    FaMedium,
    FaPinterestP,
    FaPhone,
    FaQuora,
    FaStore,
    FaXTwitter,
} from "react-icons/fa6";

import { siteConfig } from "@/lib/siteConfig";

const calculatorLinks = [
    { label: "Mortgage Calculator", href: "/calculators/mortgage-calculator" },
    { label: "Compound Interest Calculator", href: "/calculators/compound-interest-calculator" },
    { label: "Loan Calculator", href: "/calculators/emi-calculator" },
    { label: "Currency Converter", href: "/calculators/currency-converter" },
    { label: "Retirement Calculator", href: "/calculators/pension-calculator" },
    { label: "Scientific Calculator", href: "/calculators/math/scientific-calculator" },
];

const toolLinks = [
    { label: "Annual Income Calculator", href: "/calculators/annual-income" },
    { label: "Commission Calculator", href: "/calculators/lifestyle/commission-calculator" },
    { label: "TDEE Calculator", href: "/calculators/health/tdee-calculator" },
    { label: "Ideal Weight Calculator", href: "/calculators/health/ideal-weight-calculator" },
    { label: "Age Calculator", href: "/calculators/lifestyle/age-calculator" },
    { label: "Percentage Calculator", href: "/calculators/math/percentage-calculator" },
];

const companyLinks = [
    { label: "About Us", href: "/about" },
    { label: "Contact Us", href: "/contact" },
    { label: "Editorial Policy", href: "/editorial-policy" },
    { label: "Blog", href: "/blog" },
];

const legalLinks = [
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Cookie Policy", href: "/cookie-policy" },
    { label: "Terms & Conditions", href: "/terms" },
    { label: "Disclaimer", href: "/disclaimer" },
];

const socialLinks = [
    { label: "X", href: "https://x.com/withinsecs", icon: FaXTwitter },
    { label: "Pinterest", href: "https://in.pinterest.com/withinsecscom/", icon: FaPinterestP },
    { label: "Instagram", href: "https://www.instagram.com/withinsecs/", icon: FaInstagram },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/withinsecs-com/", icon: FaLinkedinIn },
    { label: "Quora", href: "https://www.quora.com/profile/Withinsecs-Com", icon: FaQuora },
    { label: "Medium", href: "https://medium.com/@withinsecs.com", icon: FaMedium },
];

function FooterLinkList({
    title,
    links,
}: {
    title: string;
    links: { label: string; href: string }[];
}) {
    return (
        <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.26em] text-slate-500">
                {title}
            </h3>
            <ul className="mt-5 space-y-3">
                {links.map((link) => (
                    <li key={link.label}>
                        <Link
                            href={link.href}
                            className="text-sm leading-6 text-slate-600 transition-colors hover:text-slate-950"
                        >
                            {link.label}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default function Footer() {
    return (
        <footer className="border-t border-slate-200 bg-slate-50">
            <div className="mx-auto max-w-7xl px-4 py-14 md:px-6 lg:px-8">
                <div className="grid gap-12 border-b border-slate-200 pb-12 lg:grid-cols-[1.15fr_0.85fr_0.85fr_0.85fr_0.85fr]">
                    <div className="max-w-sm">
                        <Link href="/" className="text-2xl font-semibold tracking-tight text-slate-950">
                            {siteConfig.name}
                        </Link>
                        <p className="mt-5 text-base leading-7 text-slate-700">
                            Free online calculators for finance, health, math, and everyday
                            planning.
                        </p>
                        <p className="mt-4 text-sm leading-7 text-slate-600">
                            Explore powerful tools that help you make better decisions within
                            seconds.
                        </p>
                    </div>

                    <FooterLinkList title="Calculators" links={calculatorLinks} />
                    <FooterLinkList title="Tools" links={toolLinks} />
                    <FooterLinkList title="Company" links={companyLinks} />
                    <FooterLinkList title="Legal" links={legalLinks} />
                </div>

                <div className="flex flex-col gap-6 pt-8 md:flex-row md:items-center md:justify-between">
                    <div>
                        <p className="text-sm font-medium text-slate-900">Contact</p>
                        <div className="mt-3 flex flex-wrap gap-3">
                            <Link
                                href={`mailto:${siteConfig.contactEmail}`}
                                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 transition-colors hover:border-slate-300 hover:text-slate-950"
                            >
                                <FaEnvelope className="h-4 w-4" />
                                {siteConfig.contactEmail}
                            </Link>
                            {siteConfig.contactPhone ? (
                                <Link
                                    href={`tel:${siteConfig.contactPhone}`}
                                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 transition-colors hover:border-slate-300 hover:text-slate-950"
                                >
                                    <FaPhone className="h-4 w-4" />
                                    {siteConfig.contactPhoneDisplay || siteConfig.contactPhone}
                                </Link>
                            ) : null}
                            <Link
                                href={siteConfig.businessProfileUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 transition-colors hover:border-slate-300 hover:text-slate-950"
                            >
                                <FaStore className="h-4 w-4" />
                                Google Business Profile
                            </Link>
                        </div>
                    </div>

                    <div>
                        <p className="text-sm font-medium text-slate-900">Social Profiles</p>
                        <div className="mt-3 flex flex-wrap gap-3">
                            {socialLinks.map((link) => (
                                <Link
                                    key={link.label}
                                    href={link.href}
                                    target="_blank"
                                    rel="noreferrer"
                                    aria-label={link.label}
                                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 transition-colors hover:border-slate-300 hover:text-slate-950"
                                >
                                    <link.icon className="h-4 w-4" />
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    <p className="text-sm text-slate-500">
                        Copyright {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
