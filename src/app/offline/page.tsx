import Link from "next/link";

import Wrapper from "@/app/Wrapper";
import { Button } from "@/components/ui/button";

export default function OfflinePage() {
    return (
        <Wrapper>
            <div className="flex min-h-[70vh] items-center justify-center px-4 py-16">
                <div className="max-w-xl text-center">
                    <h1 className="text-3xl font-semibold tracking-tight">You are offline</h1>
                    <p className="mt-4 text-lg text-muted-foreground">
                        WithinSecs could not load fresh content right now. Check your connection and
                        try again, or go back to cached calculator pages.
                    </p>
                    <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                        <Button asChild>
                            <Link href="/calculators">Browse Calculators</Link>
                        </Button>
                        <Button asChild variant="outline">
                            <Link href="/">Go Home</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </Wrapper>
    );
}
