// app/api/anlaytics/top-voilated-rules/route.ts
// This api give top 5 voilated rules for a given repoId in current month and return in a json format like this
// {
//     "repoId": "123",
//     "rules": [{
//         "ruleId": "123",
//         "rule": "rule1",
//         "count": 10
//     },
//     {
//         "ruleId": "123",
//         "rule": "rule1",
//         "count": 10
//     }]
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

    const currentMonthRules = await prisma.codeReviewComments.groupBy({
      by: ["ruleId"],
      where: {
        repoId: repoId,
        createdAt: {
          gte: new Date(new Date().getFullYear(), currentMonth, 1),
          lt: new Date(new Date().getFullYear(), currentMonth + 1, 1),
        },
      },
      _count: true,
      take: 5,
      orderBy: {
        _count: {
          ruleId: "desc",
        },
      },
    });

    return NextResponse.json(
      {
        repoId,
        rules: currentMonthRules.map((rule) => ({
          ruleId: rule.ruleId,
          rule: rule.ruleId,
          count: rule._count,
        })),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
