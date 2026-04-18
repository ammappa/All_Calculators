export const siteConfig = {
    name: "WithinSecs",
    legalName: "WithinSecs",
    description:
        "Free online calculators for finance, health, lifestyle, math, and everyday planning.",
    logoPath: "/logo.png",
    searchPath: "/search",
    authorName: "WithinSecs Team",
    contactEmail: "support@withinsecs.com",
    contactPhone: "",
    contactPhoneDisplay: "",
    businessProfileUrl:
        process.env.NEXT_PUBLIC_GOOGLE_BUSINESS_PROFILE_URL?.trim() ||
        "https://www.google.com/maps/search/?api=1&query=WithinSecs",
    mapsEmbedUrl:
        "https://www.google.com/maps?q=WithinSecs&output=embed",
    serviceArea: "Worldwide",
    priceRange: "$0",
    socialProfiles: [
        "https://x.com/withinsecs",
        "https://in.pinterest.com/withinsecscom/",
        "https://www.instagram.com/withinsecs/",
        "https://www.linkedin.com/in/withinsecs-com/",
        "https://www.quora.com/profile/Withinsecs-Com",
        "https://medium.com/@withinsecs.com",
    ],
} as const;
