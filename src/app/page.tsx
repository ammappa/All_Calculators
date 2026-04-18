import type { Metadata } from "next";

import Page from "./(pages)/home/page";

export const metadata: Metadata = {
  title: "Fast & Free Financial Calculators - EMI, Loan, Interest, GST",
  description:
    "Fast and free financial calculators by WithinSecs. Use EMI, loan, interest, GST, mortgage, salary, and savings calculators online in seconds.",
};

export default function Home() {
  return (
    <div className="">
      <Page />
    </div>
  );
}
