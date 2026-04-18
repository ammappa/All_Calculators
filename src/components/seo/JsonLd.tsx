type JsonLdProps = {
    data: Record<string, unknown> | Array<Record<string, unknown>>;
    id?: string;
};

export default function JsonLd({ data, id }: JsonLdProps) {
    const payload = Array.isArray(data) ? data : [data];

    if (payload.length === 0) {
        return null;
    }

    return (
        <script
            {...(id ? { id } : {})}
            type="application/ld+json"
            dangerouslySetInnerHTML={{
                __html: JSON.stringify(payload.length === 1 ? payload[0] : payload),
            }}
        />
    );
}
