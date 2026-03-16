import { NextRequest, NextResponse } from "next/server";

import { getCalculatorPageContent } from "@/lib/calculator-page-content";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const slug = String(searchParams.get("slug") ?? "");

        if (!slug) {
            return NextResponse.json(
                {
                    success: false,
                    message: "A calculator slug is required.",
                },
                { status: 400 }
            );
        }

        const item = await getCalculatorPageContent(slug);

        return NextResponse.json(
            {
                success: true,
                item,
            },
            {
                status: 200,
                headers: {
                    "Cache-Control": "no-store",
                },
            }
        );
    } catch (error) {
        const message =
            error instanceof Error ? error.message : "Failed to load calculator page content.";
        const status =
            message.includes("Unknown calculator page.")
                ? 404
                : message.includes("MongoDB connection failed")
                  ? 503
                  : 500;

        return NextResponse.json(
            {
                success: false,
                message,
            },
            { status }
        );
    }
}
