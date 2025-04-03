// app/api/anlaytics/num-of-comments/route.ts
// This api give number of comments for a given repoId in current month with percentage diff of previous month and return in a json format like this
// {
//     "repoId": "123",
//     "commentCount": 10,
//     "percentageDiff": 50
// }

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import dayjs from "dayjs";

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

    // Get current date information using dayjs
    const now = dayjs();
    
    // Calculate current month date range
    const currentMonthStart = now.startOf('month').toDate();
    const currentMonthEnd = now.endOf('month').toDate();
    
    // Calculate previous month date range
    const previousMonth = now.subtract(1, 'month');
    const previousMonthStart = previousMonth.startOf('month').toDate();
    const previousMonthEnd = previousMonth.endOf('month').toDate();

    const currentMonthWhere = {
      repoId: repoId,
      createdAt: {
        gte: currentMonthStart,
        lte: currentMonthEnd,
      },
    };
  
    
    const currentMonthComments = await prisma.codeReviewComments.count({
      where: currentMonthWhere,
    });

    const previousMonthComments = await prisma.codeReviewComments.count({
      where: {
        repoId: repoId,
        createdAt: {
          gte: previousMonthStart,
          lte: previousMonthEnd,
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
