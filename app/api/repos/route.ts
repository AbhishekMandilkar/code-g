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


  const orgRepos = await octokit.request('GET /orgs/DeepIntent/repos', {
    org: 'DeepIntent',
    headers: {
      'X-GitHub-Api-Version': '2022-11-28'
    }
  })
  return NextResponse.json(
    [...orgRepos.data]
      .filter((repo) => repo.private)
      .map((repo) => ({
        name: repo.name,
        url: repo.html_url,
        id: repo.id,
      }))
  );
}
