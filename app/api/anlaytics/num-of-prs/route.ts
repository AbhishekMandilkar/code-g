// app/api/anlaytics/num-of-prs/route.ts
// This api give number of prs for a given repoId in current month with percentage diff of previous month and return in a json format like this
// {
//     "repoId": "123",
//     "prCount": 10,
//     "percentageDiff": 50
// }

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const repoId = searchParams.get("repoId");
        if (!repoId) {
            return NextResponse.json({ error: "Repo ID is required" }, { status: 400 });
        }


        const currentMonth = new Date().getMonth();
        const previousMonth = new Date(new Date().setMonth(currentMonth - 1)).getMonth();

        const currentMonthPRs = await prisma.codeReviewComments.count({
            where: {
                repoId: repoId,
                createdAt: {
                    gte: new Date(new Date().getFullYear(), currentMonth, 1),
                    lt: new Date(new Date().getFullYear(), currentMonth + 1, 1),
                },
            },
        });

        const previousMonthPRs = await prisma.codeReviewComments.count({
            where: {
                repoId: repoId,
                createdAt: {
                    gte: new Date(new Date().getFullYear(), previousMonth, 1),
                    lt: new Date(new Date().getFullYear(), previousMonth + 1, 1),
                },
            },
        });

        const percentageDiff = previousMonthPRs ? ((currentMonthPRs - previousMonthPRs) / previousMonthPRs) * 100 : 0;

        return NextResponse.json({
            repoId,
            prCount: currentMonthPRs,
            percentageDiff,
        }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}