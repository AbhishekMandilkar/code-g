"use client";
import { useRepoId} from "../Provider/RepoProvider";
import NumberOfComments from "./NumberOfComments";
import NumberOfPRs from "./NumberOfPRs";
export function SectionCards() {
  const repoId = useRepoId();
  return (
    <div className="flex gap-4">
      <NumberOfComments repoId={repoId} />
      <NumberOfPRs repoId={repoId} />
    </div>
  )
}
