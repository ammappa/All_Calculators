"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

type BeforeInstallPromptEvent = Event & {
    prompt: () => Promise<void>;
    userChoice: Promise<{
        outcome: "accepted" | "dismissed";
        platform: string;
    }>;
};

export default function PwaInstallPrompt() {
    const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);
    const [dismissed, setDismissed] = useState(false);

    useEffect(() => {
        const handleBeforeInstallPrompt = (event: Event) => {
            event.preventDefault();
            setInstallEvent(event as BeforeInstallPromptEvent);
        };

        window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

        return () => {
            window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
        };
    }, []);

    if (!installEvent || dismissed) {
        return null;
    }

    return (
        <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-md rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-xl backdrop-blur">
            <p className="text-sm font-semibold text-slate-900">Install WithinSecs</p>
            <p className="mt-1 text-sm leading-6 text-slate-600">
                Add the calculator app to your device for faster access and better offline support.
            </p>
            <div className="mt-3 flex gap-2">
                <Button
                    type="button"
                    size="sm"
                    onClick={() => {
                        void installEvent.prompt();
                        void installEvent.userChoice.finally(() => {
                            setInstallEvent(null);
                        });
                    }}
                >
                    Install App
                </Button>
                <Button type="button" size="sm" variant="outline" onClick={() => setDismissed(true)}>
                    Not Now
                </Button>
            </div>
        </div>
    );
}
