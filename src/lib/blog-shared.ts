export type BlogPostRecord = {
    id: string;
    title: string;
    seoTitle: string;
    slug: string;
    category: string;
    date: string;
    imageUrl: string;
    excerpt: string;
    content: string;
    isPublished: boolean;
    createdAt: string;
    updatedAt: string;
};

type BlogSource = {
    _id?: { toString(): string } | string;
    title?: string;
    seoTitle?: string;
    slug?: string;
    category?: string;
    date?: string;
    imageUrl?: string;
    excerpt?: string;
    content?: string;
    isPublished?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};

const allowedTags = [
    "a",
    "b",
    "blockquote",
    "br",
    "em",
    "h2",
    "h3",
    "i",
    "li",
    "ol",
    "p",
    "strong",
    "u",
    "ul",
];

export function slugify(value: string) {
    return value
        .toLowerCase()
        .trim()
        .replace(/['"]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

function toIsoString(value: Date | string | undefined) {
    if (!value) {
        return "";
    }

    const date = value instanceof Date ? value : new Date(value);
    return Number.isNaN(date.getTime()) ? "" : date.toISOString();
}

function normalizeAnchor(tag: string) {
    const hrefMatch = tag.match(/\shref=(["'])(.*?)\1/i);
    const href = hrefMatch?.[2]?.trim() ?? "";
    const isSafeHref =
        href.startsWith("http://") ||
        href.startsWith("https://") ||
        href.startsWith("mailto:") ||
        href.startsWith("/") ||
        href.startsWith("#");

    if (!isSafeHref) {
        return "<a>";
    }

    return `<a href="${href.replace(/"/g, "&quot;")}" target="_blank" rel="noopener noreferrer">`;
}

type InlineFormatState = {
    bold: boolean;
    italic: boolean;
    underline: boolean;
};

function extractInlineFormat(styleValue: string): InlineFormatState {
    const normalizedStyle = styleValue.toLowerCase();

    return {
        bold: /font-weight\s*:\s*(bold|[6-9]00)/.test(normalizedStyle),
        italic: /font-style\s*:\s*italic/.test(normalizedStyle),
        underline: /text-decoration(?:-line)?\s*:\s*[^;"']*underline/.test(normalizedStyle),
    };
}

function normalizeInlineFormatting(input: string) {
    const spanStack: InlineFormatState[] = [];

    return input.replace(/<span\b([^>]*)>|<\/span>/gi, (tag, attributes = "") => {
        if (/^<\/span>/i.test(tag)) {
            const format = spanStack.pop();

            if (!format) {
                return "";
            }

            let closingMarkup = "";

            if (format.underline) {
                closingMarkup += "</u>";
            }

            if (format.italic) {
                closingMarkup += "</em>";
            }

            if (format.bold) {
                closingMarkup += "</strong>";
            }

            return closingMarkup;
        }

        const styleMatch = attributes.match(/\sstyle=(["'])(.*?)\1/i);
        const format = extractInlineFormat(styleMatch?.[2] ?? "");
        spanStack.push(format);

        let openingMarkup = "";

        if (format.bold) {
            openingMarkup += "<strong>";
        }

        if (format.italic) {
            openingMarkup += "<em>";
        }

        if (format.underline) {
            openingMarkup += "<u>";
        }

        return openingMarkup;
    });
}

export function sanitizeBlogContentHtml(input: string) {
    if (!input.trim()) {
        return "";
    }

    const withoutUnsafeBlocks = normalizeInlineFormatting(input)
        .replace(/<!--[\s\S]*?-->/g, "")
        .replace(
            /<(script|style|iframe|object|embed|form|input|textarea|button|select|option|video|audio|svg|math)[^>]*>[\s\S]*?<\/\1>/gi,
            ""
        )
        .replace(
            /<(script|style|iframe|object|embed|form|input|textarea|button|select|option|video|audio|svg|math)[^>]*\/?>/gi,
            ""
        )
        .replace(/<div\b[^>]*>/gi, "<p>")
        .replace(/<\/div>/gi, "</p>")
        .replace(/<(\/?)h1\b[^>]*>/gi, "<$1h2>")
        .replace(/<(\/?)h4\b[^>]*>/gi, "<$1h3>")
        .replace(/<(\/?)h5\b[^>]*>/gi, "<$1h3>")
        .replace(/<(\/?)h6\b[^>]*>/gi, "<$1h3>");

    return withoutUnsafeBlocks.replace(/<\/?[^>]+>/g, (tag) => {
        const nameMatch = tag.match(/^<\/?\s*([a-z0-9]+)/i);
        const tagName = nameMatch?.[1]?.toLowerCase();

        if (!tagName) {
            return "";
        }

        const normalizedTagName = tagName === "b" ? "strong" : tagName;

        if (!allowedTags.includes(tagName) && !allowedTags.includes(normalizedTagName)) {
            return "";
        }

        if (tag.startsWith("</")) {
            return `</${normalizedTagName}>`;
        }

        if (normalizedTagName === "br") {
            return "<br>";
        }

        if (normalizedTagName === "a") {
            return normalizeAnchor(tag);
        }

        return `<${normalizedTagName}>`;
    });
}

export function stripHtml(value: string) {
    return value
        .replace(/<br\s*\/?>/gi, " ")
        .replace(/<\/p>/gi, "\n")
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

export function serializeBlogPost(post: BlogSource): BlogPostRecord {
    return {
        id: typeof post._id === "string" ? post._id : post._id?.toString?.() ?? "",
        title: post.title ?? "",
        seoTitle: post.seoTitle ?? "",
        slug: post.slug ?? "",
        category: post.category ?? "",
        date: post.date ?? "",
        imageUrl: post.imageUrl ?? "",
        excerpt: post.excerpt ?? "",
        content: post.content ?? "",
        isPublished: Boolean(post.isPublished),
        createdAt: toIsoString(post.createdAt),
        updatedAt: toIsoString(post.updatedAt),
    };
}
