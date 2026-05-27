import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const solved = await db.solvedProblem.findMany({
      where: { userId },
      select: { problemId: true },
    });

    return NextResponse.json({
      solvedIds: solved.map((s) => s.problemId),
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { problemId } = await req.json();

    // Toggle — if already solved, unmark it
    const existing = await db.solvedProblem.findUnique({
      where: { userId_problemId: { userId, problemId } },
    });

    if (existing) {
      await db.solvedProblem.delete({
        where: { userId_problemId: { userId, problemId } },
      });
      return NextResponse.json({ solved: false });
    } else {
      await db.solvedProblem.create({
        data: { userId, problemId },
      });
      return NextResponse.json({ solved: true });
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}