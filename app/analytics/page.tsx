import { SectionCards } from "@/components/AnalyticsView/SectionCards";
import React from "react";

const Page = () => {
  return (
    <div className="flex flex-col p-4">
      <SectionCards />
      <div className="px-4 lg:px-6">{/* <ChartAreaInteractive /> */}</div>
      {/* <DataTable data={data} /> */}
    </div>
  );
};

export default Page;
