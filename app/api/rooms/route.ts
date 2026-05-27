import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// Free plan limits
export const FREE_LIMITS = {
  maxRooms: 3,
  maxParticipants: 2,
  languages: [
    "javascript", "typescript", "python", "java",
    "cpp", "c", "go", "ruby",
  ],
};

export const PRO_LIMITS = {
  maxRooms: Infinity,
  maxParticipants: 5,
  languages: [
    "javascript", "typescript", "python", "java",
    "cpp", "c", "go", "rust", "kotlin", "swift", "php", "ruby",
  ],
};

// GET - Fetch all rooms for current user
export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let user = await db.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return NextResponse.json({ rooms: [] });
    }

    const rooms = await db.room.findMany({
      where: { createdBy: userId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ rooms });
  } catch (error) {
    console.error("GET /api/rooms error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// POST - Create a new room
export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, language } = await req.json();

    if (!name || !language) {
      return NextResponse.json(
        { error: "Name and language are required" },
        { status: 400 }
      );
    }

    const user = await db.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const limits = user.plan === "pro" ? PRO_LIMITS : FREE_LIMITS;

    // Check room limit
    if (user.plan === "free") {
      const roomCount = await db.room.count({
        where: { createdBy: userId },
      });

      if (roomCount >= FREE_LIMITS.maxRooms) {
        return NextResponse.json(
          { error: "LIMIT_REACHED", message: "Free plan allows only 3 rooms. Upgrade to Pro for unlimited rooms." },
          { status: 403 }
        );
      }
    }

    // Check language is allowed for plan
    if (!limits.languages.includes(language)) {
      return NextResponse.json(
        { error: "LANGUAGE_NOT_ALLOWED", message: `${language} is not available on your plan. Upgrade to Pro for 10+ languages.` },
        { status: 403 }
      );
    }

    const room = await db.room.create({
      data: {
        name,
        language,
        createdBy: userId,
      },
    });

    return NextResponse.json({ room }, { status: 201 });
  } catch (error) {
    console.error("POST /api/rooms error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}