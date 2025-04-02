"use client";
import React, { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { RepoDropdown } from "./repo-dropdown";

const versions = ["repo-1", "repo-2", "repo-3"];

export function SiteHeader() {
  const [showSaved, setShowSaved] = useState(false);
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">
          <RepoDropdown versions={versions} defaultVersion={versions[0]} />
        </h1>
        <div className="ml-auto flex items-center gap-2">
          {showSaved && "Saved"}
        </div>
      </div>
    </header>
  );
}
