"use client";
import useSWR from "swr";
import { RepoDropdown } from "@/components/Dashboard/repo-dropdown";
import RulesList from "@/components/RuleTable/rules-table";
import { SiteHeader } from "@/components/Dashboard/site-header";
import { Skeleton } from "@/components/ui/skeleton";
import type { Repo } from "./layout";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

const fetcher = async <T = unknown,>(
  ...args: Parameters<typeof fetch>
): Promise<T> => {
  const response = await fetch(...args);
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  return response.json() as Promise<T>;
};

export default function Page() {
  const { data, isLoading } = useSWR(
    `/api/repos?username=AbhishekMandilkar`,
    fetcher
  );
  const params = useSearchParams();
  const repoId = params.get("repoId");
  const selectedRepo = useMemo(
    () => (data as Repo[])?.find((item) => item.id == repoId),
    [repoId, data]
  );

  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader
        leftView={
          isLoading ? (
            <Skeleton className="h-4 w-[100px]" />
          ) : (
            <h1 className="text-base font-medium">
              <RepoDropdown
                repos={data as Repo[]}
                defaultRepo={selectedRepo?.name || "ReactNotes"}
                onChange={() => {}}
              />
            </h1>
          )
        }
      />
      <div className="@container/main flex flex-1 flex-col gap-2">
        <RulesList repoId={repoId} />
      </div>
    </div>
  );
}
