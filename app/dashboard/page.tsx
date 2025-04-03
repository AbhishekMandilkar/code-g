"use client";
import RulesList from "@/components/RuleTable/rules-table";
import { useRepoId } from "@/components/Provider/RepoProvider";

export default function Page() {
  const repoId = useRepoId();

  return (
    <div className="flex flex-1 flex-col gap-2">
      <RulesList repoId={repoId} />
    </div>
  );
}
