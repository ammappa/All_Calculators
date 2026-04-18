import Wrapper from "@/app/Wrapper";
import CalculatorRouteStructuredData from "@/components/seo/CalculatorRouteStructuredData";

export default function CalculatorsLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <Wrapper>
            <CalculatorRouteStructuredData />
            {children}
        </Wrapper>
    );
}
