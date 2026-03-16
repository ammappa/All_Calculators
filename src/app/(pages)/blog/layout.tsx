import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
    title: "Blogs",
    description: "Read the latest calculator guides, tutorials, and finance articles.",
    alternates: {
        canonical: "/blog",
    },
};

export default function BlogLayout({
    children,
}: {
    children: ReactNode;
}) {
    return children;
}
