import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "WithinSecs - Smart Calculators",
        short_name: "WithinSecs",
        description:
            "Free online calculators for finance, health, and daily use. Get instant answers within seconds.",
        start_url: "/calculators",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#0f172a",
        orientation: "portrait",
        scope: "/",
        icons: [
            {
                src: "/logo.png",
                sizes: "192x192",
                type: "image/png",
            },
            {
                src: "/logo.png",
                sizes: "512x512",
                type: "image/png",
            },
        ],
        shortcuts: [
            {
                name: "EMI Calculator",
                url: "/calculators/emi-calculator",
            },
            {
                name: "BMI Calculator",
                url: "/calculators/health/bmi-calculator",
            },
            {
                name: "Mortgage Calculator",
                url: "/calculators/mortgage-calculator",
            },
        ],
    };
}
