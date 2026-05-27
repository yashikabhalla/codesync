import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import RoomClient from "@/components/editor/RoomClient";

interface Props {
  params: Promise<{ roomId: string }>;
}

export default async function RoomPage({ params }: Props) {
  const { roomId } = await params;
  const { userId } = await auth();
  const clerkUser = await currentUser();

  if (!userId || !clerkUser) {
    redirect("/sign-in");
  }

  // Get room from database
  const room = await db.room.findUnique({
    where: { id: roomId },
  });

  if (!room) {
    redirect("/dashboard");
  }

  // Sync user to database
  let user = await db.user.findUnique({
    where: { clerkId: userId },
  });

  if (!user) {
    user = await db.user.create({
      data: {
        clerkId: userId,
        name: `${clerkUser.firstName} ${clerkUser.lastName}`,
        email: clerkUser.emailAddresses[0].emailAddress,
        avatar: clerkUser.imageUrl,
      },
    });
  }

  const isPro = user.plan === "pro";

  return (
    <RoomClient
      room={{
        id: room.id,
        name: room.name,
        language: room.language,
      }}
      user={{
        id: userId,
        name: `${clerkUser.firstName} ${clerkUser.lastName}`,
        avatar: clerkUser.imageUrl,
      }}
      isPro={isPro}
    />
  );
}