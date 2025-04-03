// app/api/anlaytics/num-of-prs/route.ts
// This api give number of prs for a given repoId in current month with percentage diff of previous month and return in a json format like this
// {
//     "repoId": "123",
//     "prCount": 10,
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
            return NextResponse.json({ error: "Repo ID is required" }, { status: 400 });
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

        const currentMonthPRs = await prisma.codeReviewPRs.findMany({
            where: {
                repoId: repoId,
                createdAt: {
                    gte: currentMonthStart,
                    lte: currentMonthEnd,
                },
            },
        });
        const currentMonthPRCount = currentMonthPRs.length;

        const previousMonthPRs = await prisma.codeReviewPRs.findMany({
            where: {
                repoId: repoId,
                createdAt: {
                    gte: previousMonthStart,
                    lte: previousMonthEnd,
                },
            },
        });
        const previousMonthPRCount = previousMonthPRs.length;

        const percentageDiff = previousMonthPRCount ? ((currentMonthPRCount - previousMonthPRCount) / previousMonthPRCount) * 100 : 0;

        return NextResponse.json({
            repoId,
            prCount: currentMonthPRCount,
            percentageDiff,
        }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}