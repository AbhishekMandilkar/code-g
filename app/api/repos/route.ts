// get all repos of github user using octokit

import { NextResponse } from "next/server";
import { Octokit } from "@octokit/rest";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username");
  if (!username) {
    return NextResponse.json(
      { error: "Username is required" },
      { status: 400 }
    );
  }

  const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN,
  });

  const repos = await octokit.request("GET /users/{username}/repos", {
    username,
  });

  return NextResponse.json(
    repos.data?.map((repo) => ({
      name: repo.name,
      url: repo.html_url,
      id: repo.id,
    }))
  );
}
