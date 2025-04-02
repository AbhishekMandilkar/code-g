// app/api/github-review/route.js

import { NextResponse } from 'next/server';
import axios from 'axios';
import {Octokit} from '@octokit/rest';
import {prisma} from '@/lib/prisma';

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });


export async function POST(req: Request) {
  try {
    const event = req.headers.get('x-github-event');
    const body = await req.json();
    const payload = typeof body?.payload === 'string' ? JSON.parse(body?.payload) : (body?.payload || body);
    if (
      event !== "pull_request" ||
      !["opened", "reopened", "synchronize"].includes(payload?.action)
    ) {
      return NextResponse.json({ message: 'Event ignored' }, { status: 200 });
    }

    const { pull_request, repository } = payload;

    const prNumber = pull_request.number;
    const repoOwner = pull_request.base.repo.owner.login;
    const repoName = pull_request.base.repo.name;
    const commitSha = pull_request.head.sha;

    const repoId = repository.id;
    // Step 2: Fetch diff
    // const diffResponse = await axios.get(pull_request.diff_url, {
    //   headers: { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` },
    // });

    // const diffResponse = await axios.get(pull_request.diff_url, {
    //   headers: {
    //     Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    //     Accept: 'application/vnd.github.v3.diff'
    //   }
    // });

    const config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `https://api.github.com/repos/${repoOwner}/${repoName}/pulls/${prNumber}`,
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3.diff",
        'X-GitHub-Api-Version': '2022-11-28',
      },
    };

    const diffResponse = await axios.request(config);
    

    const diffContent = diffResponse.data;

    const rules = await prisma.codeReviewRules.findMany({
      where: {
        repoId: `${repoId}`,
      },
    });

    const rulesString = rules.map((rule) => `Id: ${rule.id} Rule: ${rule.rule}`).join('\n');


    // Step 3: Get AI-generated inline comments
    const aiResponse = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `Provide concise inline code review comments using following rules:
              ${
                rulesString
                  ? rulesString
                  : "Pls do review the using best practices according to the language and framework used in the code"
              }
              in JSON format: [{"file": "path/to/file","line": lineNumber,"comment": "Your comment", "ruleId": "ruleId which was used to generate the comment"}] 
              Notes -
              1. PLS DONOT RETURN ANYTHING ELSE AND DONOT FORMAT IN MARKDOWN OR ANY OTHER FORMAT JUST PLAIN JSON STRING 
              2. ALWAYS FOLLOW THE RULES STRICTLY
              3. Use only double quotes for strings in JSON
              4. Pls add the comment on the next line of the line number you find the issue
              5. IMPORTANT: All property names in JSON must be in double quotes
              `,
          },
          { role: "user", content: `Review diff:\n\n${diffContent}` },
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
    addCommentToDB(String(prNumber), reviewComments, String(repoId));
    return NextResponse.json({ message: 'Review completed successfully' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}


const addCommentToDB = async (prId: string, comments: {
  comment: string;
  ruleId: string;
  file: string;
  line: number;
}[], repoId: string) => {

  try {
    await prisma.codeReviewComments.createMany({
      data: comments.map((comment) => ({
        pullRequestId: prId,
        comment: comment.comment,
        ruleId: comment.ruleId,
        repoId: repoId,
      })),
    });
  } catch (error) {
    console.error('Database error:', error);
    throw error;
  }
}
