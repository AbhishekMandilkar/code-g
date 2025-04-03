import { validateCustomRule } from "@/lib/openai";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET /api/rules?repoId=xxx
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const repoId = searchParams.get("repoId");

    if (!repoId) {
      return NextResponse.json(
        { error: "Repository ID is required" },
        { status: 400 }
      );
    }

    const rules = await prisma.codeReviewRules.findMany({
      where: {
        repoId: repoId,
      },
    });

    return NextResponse.json(rules);
  } catch (error) {
    console.error("Error fetching rules:", error);
    return NextResponse.json(
      { error: "Failed to fetch rules" },
      { status: 500 }
    );
  }
}

// POST /api/rules
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { rule, repoId, id, isDeleted } = body;

    if (!rule || !repoId) {
      return NextResponse.json(
        { error: "Rule and repository ID are required" },
        { status: 400 }
      );
    }

    if (!isDeleted) {
      const valid = await validateCustomRule(rule);
      if (!valid.valid) {
        return NextResponse.json({ error: valid.reason }, { status: 400 });
      }
    }
    let result;
    if (id) {
      result = await prisma.codeReviewRules.update({
        where: {
          id: id,
        },
        data: {
          rule: rule,
          updatedAt: new Date(),
          isDeleted: isDeleted,
        },
      });
    } else {
      result = await prisma.codeReviewRules.create({
        data: {
          rule: rule,
          repoId: String(repoId),
          isDeleted: false,
        },
      });
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Error upserting rule:", error);
    return NextResponse.json(
      { error: "Failed to upsert rule" },
      { status: 500 }
    );
  }
}
