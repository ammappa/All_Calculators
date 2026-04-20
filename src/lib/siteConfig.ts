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
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3941.509813515119!2d77.5505332!3d8.925078699999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b0421d001e916cd%3A0xc50082f28694b351!2sKadanganeri%2C%20Tamil%20Nadu%20627854%2C%20India!5e0!3m2!1sen!2s!4v1776651965087!5m2!1sen!2s",
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
