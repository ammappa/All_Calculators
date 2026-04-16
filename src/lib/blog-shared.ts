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
    "table",
    "tbody",
    "td",
    "th",
    "thead",
    "tr",
    "strong",
    "u",
    "ul",
];

const blockTagNames = ["blockquote", "h2", "h3", "li", "ol", "p", "table", "ul"];

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

function normalizeTableCell(tag: string, tagName: "td" | "th") {
    const colSpanMatch = tag.match(/\scolspan=(["']?)(\d+)\1/i);
    const rowSpanMatch = tag.match(/\srowspan=(["']?)(\d+)\1/i);
    const attributes: string[] = [];

    if (colSpanMatch) {
        attributes.push(`colspan="${colSpanMatch[2]}"`);
    }

    if (rowSpanMatch) {
        attributes.push(`rowspan="${rowSpanMatch[2]}"`);
    }

    return attributes.length > 0 ? `<${tagName} ${attributes.join(" ")}>` : `<${tagName}>`;
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

function closeInlineFormatting(format: InlineFormatState) {
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

function normalizeFormattingTags(input: string) {
    const formattingTagStack: InlineFormatState[] = [];

    return input.replace(/<(strong|b|em|i|u)\b[^>]*>|<\/(strong|b|em|i|u)>/gi, (tag, openTag, closeTag) => {
        if (closeTag) {
            const format = formattingTagStack.pop();
            return format ? closeInlineFormatting(format) : "";
        }

        const normalizedTag = String(openTag).toLowerCase();
        const format: InlineFormatState = {
            bold: normalizedTag === "strong" || normalizedTag === "b",
            italic: normalizedTag === "em" || normalizedTag === "i",
            underline: normalizedTag === "u",
        };

        formattingTagStack.push(format);

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

function normalizeWordHtml(input: string) {
    return input
        .replace(/<\?xml[^>]*>/gi, "")
        .replace(/<\/?[a-z]+:[^>]*>/gi, "")
        .replace(/\sclass=(["'])(?:Mso|Apple-converted-space)[^"']*\1/gi, "")
        .replace(/\sstyle=(["'])(?:(?!\1).)*mso-[^"']*\1/gi, "")
        .replace(/<p\b[^>]*>\s*(?:&nbsp;|\u00a0|\s)*<\/p>/gi, "")
        .replace(/&nbsp;/gi, " ");
}

function normalizeLineBreaks(input: string) {
    const withParagraphs = input
        .replace(/\r\n/g, "\n")
        .replace(/\r/g, "\n")
        .split(/\n{2,}/)
        .map((paragraph) => paragraph.trim())
        .filter(Boolean)
        .map((paragraph) => `<p>${paragraph.replace(/\n/g, "<br>")}</p>`)
        .join("");

    return withParagraphs || `<p>${input.replace(/\n/g, "<br>")}</p>`;
}

function collapseDuplicateBlockBoundaries(input: string) {
    return input
        .replace(/<(p|blockquote|h2|h3)><\/\1>/gi, "")
        .replace(/<(p|blockquote|h2|h3)>\s*<(p|blockquote|h2|h3)>/gi, "<$2>")
        .replace(/<\/(p|blockquote|h2|h3)>\s*<\/(p|blockquote|h2|h3)>/gi, "</$1>");
}

export function convertPlainTextToBlogHtml(input: string) {
    const escaped = input
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

    return normalizeLineBreaks(escaped);
}

export function sanitizeBlogContentHtml(input: string) {
    if (!input.trim()) {
        return "";
    }

    const source = /<[^>]+>/.test(input) ? input : convertPlainTextToBlogHtml(input);

    const withoutUnsafeBlocks = normalizeWordHtml(normalizeFormattingTags(normalizeInlineFormatting(source)))
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
        .replace(/<font\b[^>]*>/gi, "")
        .replace(/<\/font>/gi, "")
        .replace(/<(\/?)h1\b[^>]*>/gi, "<$1h2>")
        .replace(/<(\/?)h4\b[^>]*>/gi, "<$1h3>")
        .replace(/<(\/?)h5\b[^>]*>/gi, "<$1h3>")
        .replace(/<(\/?)h6\b[^>]*>/gi, "<$1h3>");

    const sanitized = withoutUnsafeBlocks.replace(/<\/?[^>]+>/g, (tag) => {
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

        if (normalizedTagName === "td" || normalizedTagName === "th") {
            return normalizeTableCell(tag, normalizedTagName);
        }

        return `<${normalizedTagName}>`;
    });

    const normalizedBlocks = collapseDuplicateBlockBoundaries(sanitized).trim();

    if (!normalizedBlocks) {
        return "";
    }

    const hasBlockMarkup = blockTagNames.some((tagName) =>
        normalizedBlocks.toLowerCase().includes(`<${tagName}>`)
    );

    return hasBlockMarkup ? normalizedBlocks : `<p>${normalizedBlocks}</p>`;
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
