"use client";
import { Repo } from "@/app/dashboard/layout";
import fetcher from "@/lib/fetcher";
import { Loader2 } from "lucide-react";
import { createContext, useContext, useState } from "react";
import useSWR from "swr";

const RepoContext = createContext<{
  selectedRepo: Repo;
  setSelectedRepo: (repo: Repo) => void;
  repoList: Repo[];
}>({
  selectedRepo: {
    name: "",
    url: "",
    id: "",
  },
  setSelectedRepo: () => {},
  repoList: [],
});

export const RepoProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedRepo, setSelectedRepo] = useState<Repo>({
    name: "",
    url: "",
    id: "",
  });
  const { data, isLoading } = useSWR<Repo[]>(
    `/api/repos?username=AbhishekMandilkar`,
    fetcher,
    {
      revalidateOnFocus: false,
      onSuccess: (data) => {
        setSelectedRepo(data[0]);
      },
    }
  );

  if (isLoading) {
    return (
      <div className="h-[100vh] w-full flex justify-center items-center">
        <Loader2 className="animate-spin size-10" />
      </div>
    );
  }

  return (
    <RepoContext.Provider
      value={{ selectedRepo, setSelectedRepo, repoList: data || [] }}
    >
      {children}
    </RepoContext.Provider>
  );
};

export const useRepo = () => {
  const repo = useContext(RepoContext);
  if (!repo) {
    throw new Error("useRepo must be used within a RepoProvider");
  }
  return repo;
};

export const useRepoId = () => {
  const { selectedRepo } = useRepo();
  return selectedRepo.id;
};
