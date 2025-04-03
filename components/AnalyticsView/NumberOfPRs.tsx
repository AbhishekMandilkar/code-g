'use client';

import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUpIcon, TrendingDownIcon } from "lucide-react";
import useSWR from "swr";
import { Suspense } from "react";

interface PRData {
  repoId: string;
  prCount: number;
  percentageDiff: number;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

function PRCard({ repoId }: { repoId: string }) {
  const { data, error } = useSWR<PRData>(
    `/api/anlaytics/num-of-prs?repoId=${repoId}`,
    fetcher
  );

  if (error) return <div>Failed to load PRs</div>;
  if (!data) return null;

  const isPositive = data.percentageDiff > 0;
  const TrendIcon = isPositive ? TrendingUpIcon : TrendingDownIcon;

  return (
    <Card>
      <CardHeader className="relative">
        <CardDescription>Total Pull Requests</CardDescription>
        <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
          {data.prCount}
        </CardTitle>
        <div className="absolute right-4 top-4">
          <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
            <TrendIcon className="size-3" />
            {Math.abs(data.percentageDiff).toFixed(1)}%
          </Badge>
        </div>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1 text-sm">
        <div className="line-clamp-1 flex gap-2 font-medium">
          {isPositive ? "Trending up" : "Trending down"} this month{" "}
          <TrendIcon className="size-4" />
        </div>
        <div className="text-muted-foreground">
          Pull requests for the current month
        </div>
      </CardFooter>
    </Card>
  );
}

export default function NumberOfPRs({ repoId }: { repoId: string }) {
  return (
    <Suspense fallback={
      <Card>
        <CardHeader>
          <CardDescription>Total Pull Requests</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            Loading...
          </CardTitle>
        </CardHeader>
      </Card>
    }>
      <PRCard repoId={repoId} />
    </Suspense>
  );
} 