"use client";
import { RepoDropdown } from "@/components/Dashboard/repo-dropdown";
import { SiteHeader } from "@/components/Dashboard/site-header";

export default function Page() {
  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader
        leftView={
          <h1 className="text-base font-medium">
            <RepoDropdown
              repos={[]}
              defaultRepo={"ReactNotes"}
              onChange={() => {}}
            />
          </h1>
        }
      />
      <div className="@container/main flex flex-1 flex-col gap-2">dss</div>
    </div>
  );
}
