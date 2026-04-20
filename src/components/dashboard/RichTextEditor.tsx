"use client";

import { useEffect, useMemo, useRef, useState, type ClipboardEvent, type MouseEvent } from "react";
import {
    Bold,
    Heading2,
    Heading3,
    Italic,
    Link2,
    List,
    ListOrdered,
    Pilcrow,
    Quote,
    Table2,
    Underline,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { convertPlainTextToBlogHtml, sanitizeBlogContentHtml } from "@/lib/blog-shared";
import { cn } from "@/lib/utils";

type ToolbarState = {
    bold: boolean;
    italic: boolean;
    underline: boolean;
    unordered: boolean;
    ordered: boolean;
    block: "p" | "h2" | "h3" | "blockquote";
};

const defaultToolbarState: ToolbarState = {
    bold: false,
    italic: false,
    underline: false,
    unordered: false,
    ordered: false,
    block: "p",
};

type RichTextEditorProps = {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
};

export default function RichTextEditor({
    value,
    onChange,
    placeholder = "Write the article body here...",
    className,
}: RichTextEditorProps) {
    const editorRef = useRef<HTMLDivElement | null>(null);
    const selectionRangeRef = useRef<Range | null>(null);
    const [toolbarState, setToolbarState] = useState<ToolbarState>(defaultToolbarState);

    const isEmpty = useMemo(() => {
        const textValue = value.replace(/<[^>]+>/g, "").trim();
        return textValue.length === 0;
    }, [value]);

    useEffect(() => {
        if (!editorRef.current || editorRef.current.innerHTML === value) {
            return;
        }

        editorRef.current.innerHTML = value;
    }, [value]);

    useEffect(() => {
        try {
            document.execCommand("styleWithCSS", false, "false");
        } catch {
            // Older editing APIs can fail silently in some environments.
        }
    }, []);

    useEffect(() => {
        const syncToolbarState = () => {
            const editor = editorRef.current;
            const selection = document.getSelection();
            const anchorNode = selection?.anchorNode ?? null;

            if (!editor || !anchorNode || !editor.contains(anchorNode)) {
                setToolbarState(defaultToolbarState);
                return;
            }

            if (selection && selection.rangeCount > 0) {
                selectionRangeRef.current = selection.getRangeAt(0).cloneRange();
            }

            const block = (document.queryCommandValue("formatBlock") || "p")
                .toString()
                .replace(/[<>]/g, "")
                .toLowerCase();

            setToolbarState({
                bold: document.queryCommandState("bold"),
                italic: document.queryCommandState("italic"),
                underline: document.queryCommandState("underline"),
                unordered: document.queryCommandState("insertUnorderedList"),
                ordered: document.queryCommandState("insertOrderedList"),
                block:
                    block === "h2" || block === "h3" || block === "blockquote"
                        ? block
                        : "p",
            });
        };

        document.addEventListener("selectionchange", syncToolbarState);

        return () => {
            document.removeEventListener("selectionchange", syncToolbarState);
        };
    }, []);

    const syncContent = () => {
        onChange(editorRef.current?.innerHTML ?? "");
    };

    const restoreSelection = () => {
        const selection = document.getSelection();
        const range = selectionRangeRef.current;

        if (!selection || !range) {
            return;
        }

        selection.removeAllRanges();
        selection.addRange(range);
    };

    const handleToolbarMouseDown = (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        restoreSelection();
    };

    const runCommand = (command: string, valueArg?: string) => {
        editorRef.current?.focus();
        restoreSelection();
        document.execCommand(command, false, valueArg);
        const selection = document.getSelection();

        if (selection && selection.rangeCount > 0) {
            selectionRangeRef.current = selection.getRangeAt(0).cloneRange();
        }

        syncContent();
    };

    const setBlock = (tag: ToolbarState["block"]) => {
        runCommand("formatBlock", `<${tag}>`);
    };

    const handleAddLink = () => {
        const href = window.prompt("Enter a full URL");

        if (!href) {
            return;
        }

        runCommand("createLink", href);
    };

    const handleInsertTable = () => {
        const rowInput = window.prompt("How many rows do you want in the table?", "3");
        const columnInput = window.prompt("How many columns do you want in the table?", "3");

        const rows = Number.parseInt(rowInput ?? "", 10);
        const columns = Number.parseInt(columnInput ?? "", 10);

        if (!Number.isInteger(rows) || !Number.isInteger(columns) || rows < 1 || columns < 1) {
            window.alert("Please enter valid row and column counts greater than 0.");
            return;
        }

        const headerCells = Array.from(
            { length: columns },
            (_, index) => `<th>Heading ${index + 1}</th>`
        ).join("");

        const bodyRows = Array.from({ length: Math.max(rows - 1, 0) }, (_, rowIndex) => {
            const cells = Array.from(
                { length: columns },
                (_, columnIndex) => `<td>Row ${rowIndex + 1} Col ${columnIndex + 1}</td>`
            ).join("");

            return `<tr>${cells}</tr>`;
        }).join("");

        const tableHtml = `<table><thead><tr>${headerCells}</tr></thead><tbody>${bodyRows}</tbody></table><p><br></p>`;

        runCommand("insertHTML", tableHtml);
    };

    const handlePaste = (event: ClipboardEvent<HTMLDivElement>) => {
        event.preventDefault();

        const html = event.clipboardData.getData("text/html");
        const text = event.clipboardData.getData("text/plain");
        const sanitizedHtml = sanitizeBlogContentHtml(
            html && html.trim() ? html : convertPlainTextToBlogHtml(text)
        );

        if (sanitizedHtml) {
            document.execCommand("insertHTML", false, sanitizedHtml);
        } else if (text) {
            document.execCommand("insertText", false, text);
        }

        syncContent();
    };

    return (
        <div className={cn("space-y-0", className)}>
            <div className="sticky top-4 z-20 flex flex-wrap gap-2 rounded-t-lg border border-b-0 bg-background/95 p-3 backdrop-blur supports-[backdrop-filter]:bg-background/90">
                <Button
                    type="button"
                    size="sm"
                    variant={toolbarState.block === "p" ? "default" : "outline"}
                    onMouseDown={handleToolbarMouseDown}
                    onClick={() => setBlock("p")}
                >
                    <Pilcrow className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    size="sm"
                    variant={toolbarState.block === "h2" ? "default" : "outline"}
                    onMouseDown={handleToolbarMouseDown}
                    onClick={() => setBlock("h2")}
                >
                    <Heading2 className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    size="sm"
                    variant={toolbarState.block === "h3" ? "default" : "outline"}
                    onMouseDown={handleToolbarMouseDown}
                    onClick={() => setBlock("h3")}
                >
                    <Heading3 className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    size="sm"
                    variant={toolbarState.bold ? "default" : "outline"}
                    onMouseDown={handleToolbarMouseDown}
                    onClick={() => runCommand("bold")}
                >
                    <Bold className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    size="sm"
                    variant={toolbarState.italic ? "default" : "outline"}
                    onMouseDown={handleToolbarMouseDown}
                    onClick={() => runCommand("italic")}
                >
                    <Italic className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    size="sm"
                    variant={toolbarState.underline ? "default" : "outline"}
                    onMouseDown={handleToolbarMouseDown}
                    onClick={() => runCommand("underline")}
                >
                    <Underline className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    size="sm"
                    variant={toolbarState.unordered ? "default" : "outline"}
                    onMouseDown={handleToolbarMouseDown}
                    onClick={() => runCommand("insertUnorderedList")}
                >
                    <List className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    size="sm"
                    variant={toolbarState.ordered ? "default" : "outline"}
                    onMouseDown={handleToolbarMouseDown}
                    onClick={() => runCommand("insertOrderedList")}
                >
                    <ListOrdered className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    size="sm"
                    variant={toolbarState.block === "blockquote" ? "default" : "outline"}
                    onMouseDown={handleToolbarMouseDown}
                    onClick={() => setBlock("blockquote")}
                >
                    <Quote className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onMouseDown={handleToolbarMouseDown}
                    onClick={handleAddLink}
                >
                    <Link2 className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onMouseDown={handleToolbarMouseDown}
                    onClick={handleInsertTable}
                >
                    <Table2 className="h-4 w-4" />
                </Button>
            </div>

            <div className="relative">
                {isEmpty ? (
                    <div className="pointer-events-none absolute top-4 left-4 text-sm text-muted-foreground">
                        {placeholder}
                    </div>
                ) : null}
                <div
                    ref={editorRef}
                    contentEditable
                    suppressContentEditableWarning
                    className={cn(
                        "min-h-[320px] rounded-b-lg border px-5 py-5 text-base leading-8 outline-none",
                        "[&_blockquote]:border-l-4 [&_blockquote]:border-primary/30 [&_blockquote]:pl-4 [&_blockquote]:italic",
                        "[&_h2]:mt-6 [&_h2]:text-3xl [&_h2]:font-semibold",
                        "[&_h3]:mt-5 [&_h3]:text-2xl [&_h3]:font-semibold",
                        "[&_a]:text-primary [&_a]:underline",
                        "[&_ol]:list-decimal [&_ol]:pl-6 [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-6",
                        "[&_table]:my-6 [&_table]:w-full [&_table]:border-collapse [&_table]:overflow-hidden",
                        "[&_tbody_tr:nth-child(even)]:bg-muted/30",
                        "[&_td]:border [&_td]:px-3 [&_td]:py-2 [&_td]:align-top",
                        "[&_th]:border [&_th]:bg-muted [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_th]:font-semibold",
                        "[&_thead]:bg-muted/70",
                        "[&_tr]:border-b",
                        className
                    )}
                    onInput={syncContent}
                    onPaste={handlePaste}
                />
            </div>
        </div>
    );
}

