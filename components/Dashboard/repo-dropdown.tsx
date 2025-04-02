"use client";

import {Check, ChevronsUpDown} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {useRepo} from "@/components/Provider/RepoProvider";
import {Button} from "../ui/button";
export function RepoDropdown() {
  const { repoList, selectedRepo, setSelectedRepo } = useRepo();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-pointer"
        >
          <div className="flex flex-col items-start gap-0.5 leading-none">
            <span className="text-xs text-muted-foreground">
              {selectedRepo?.name ? "Repository" : "Select Repository"}
            </span>
            <span className="">{selectedRepo?.name}</span>
          </div>
          <ChevronsUpDown className="ml-auto" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-[--radix-dropdown-menu-trigger-width] max-h-[400px]"
        align="start"
      >
        {repoList?.map((repo) => (
            <DropdownMenuItem
              key={repo.name}
              onSelect={() => setSelectedRepo(repo)}
              className="cursor-pointer"
            >
              {repo.name}
              {repo.name === selectedRepo?.name && (
                <Check className="ml-auto" />
              )}
            </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
