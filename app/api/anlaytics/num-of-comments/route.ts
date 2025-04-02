// app/api/anlaytics/num-of-comments/route.ts
// This api give number of comments for a given repoId in current month with percentage diff of previous month and return in a json format like this
// {
//     "repoId": "123",
//     "commentCount": 10,
//     "percentageDiff": 50
// }

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const repoId = searchParams.get("repoId");
    if (!repoId) {
      return NextResponse.json(
        { error: "Repo ID is required" },
        { status: 400 }
      );
    }

    const currentMonth = new Date().getMonth();
    const previousMonth = new Date(
      new Date().setMonth(currentMonth - 1)
    ).getMonth();

    const currentMonthComments = await prisma.codeReviewComments.count({
      where: {
        repoId: repoId,
        createdAt: {
          gte: new Date(new Date().getFullYear(), currentMonth, 1),
          lt: new Date(new Date().getFullYear(), currentMonth + 1, 1),
        },
      },
    });

    const previousMonthComments = await prisma.codeReviewComments.count({
      where: {
        repoId: repoId,
        createdAt: {
          gte: new Date(new Date().getFullYear(), previousMonth, 1),
          lt: new Date(new Date().getFullYear(), previousMonth + 1, 1),
        },
      },
    });

    const percentageDiff = previousMonthComments
      ? ((currentMonthComments - previousMonthComments) /
          previousMonthComments) *
        100
      : 0;

    return NextResponse.json(
      {
        repoId,
        commentCount: currentMonthComments,
        percentageDiff,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching comment counts:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
