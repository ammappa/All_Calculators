export function generateSchemas({ title, description, url, faqs }) {
  const schemas = [];

  // WebPage schema
  schemas.push({
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description,
    url,
  });

  // FAQ schema
  if (faqs && faqs.length > 0) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    });
  }

  // SoftwareApplication schema (important for calculators)
  schemas.push({
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: title,
    applicationCategory: "FinanceApplication",
    operatingSystem: "All",
    url,
  });

  return schemas;
}
