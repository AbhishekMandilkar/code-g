"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Repo } from "@/app/dashboard/layout";

export function RepoDropdown({
  repos,
  defaultRepo,
  onChange,
}: {
  repos: Repo[];
  defaultRepo: string;
  onChange: (repo: Repo) => void;
}) {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex flex-col gap-0.5 leading-none">
                <span className="text-xs text-muted-foreground">Select Repository</span>
                <span className="">{defaultRepo}</span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] max-h-[400px]"
            align="start"
          >
            {repos.map((repo) => (
              <Link
                className="w-full"
                href={`?repoId=${repo.id}`}
                key={repo.name}
              >
                <DropdownMenuItem
                  key={repo.name}
                  onSelect={() => onChange(repo)}
                >
                  {repo.name}
                  {repo.name === defaultRepo && <Check className="ml-auto" />}
                </DropdownMenuItem>
              </Link>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
