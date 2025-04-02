// app/api/github-review/route.js

import { NextResponse } from 'next/server';
import axios from 'axios';
import {Octokit} from '@octokit/rest';

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });


export async function POST(req: Request) {
  try {
    const event = req.headers.get('x-github-event');
    const body = await req.json();
    const payload = JSON.parse(body?.payload);
    if (
      event !== "pull_request" ||
      !["opened", "reopened", "synchronize"].includes(payload?.action)
    ) {
      return NextResponse.json({ message: 'Event ignored' }, { status: 200 });
    }

    const { pull_request } = payload;

    const prNumber = pull_request.number;
    const repoOwner = pull_request.base.repo.owner.login;
    const repoName = pull_request.base.repo.name;
    const commitSha = pull_request.head.sha;


    // Step 2: Fetch diff
    const diffResponse = await axios.get(pull_request.diff_url, {
      headers: { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` },
    });

    const diffContent = diffResponse.data;

    // Step 3: Get AI-generated inline comments
    const aiResponse = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content:
              'Provide concise inline code review comments in JSON format: [{"file": "path/to/file","line": lineNumber,"comment": "Your comment"}] PLS DONOT RETURN ANYTHING ELSE AND DONOT FORMAT IN MARKDOWN OR ANY OTHER FORMAT JUST PLAIN JSON STRING ',
          },
          { role: 'user', content: `Review diff:\n\n${diffContent}` },
        ],
      },
      { headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` } }
    );

    const reviewComments = JSON.parse(aiResponse.data.choices[0].message.content);

    // Step 4: Post inline comments on GitHub PR
    for (const comment of reviewComments) {
      await octokit.pulls.createReviewComment({
        owner: repoOwner,
        repo: repoName,
        pull_number: prNumber,
        body: comment.comment,
        commit_id: commitSha,
        path: comment.file,
        line: comment.line,
      });
    }
    return NextResponse.json({ message: 'Review completed successfully' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}