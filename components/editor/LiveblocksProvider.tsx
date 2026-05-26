"use client";

import { ReactNode } from "react";
import { RoomProvider } from "@/liveblocks.config";
import { ClientSideSuspense } from "@liveblocks/react";
import { Loader2 } from "lucide-react";

interface Props {
  roomId: string;
  initialCode: string;
  children: ReactNode;
}

export default function LiveblocksRoomProvider({
  roomId,
  initialCode,
  children,
}: Props) {
  return (
    <RoomProvider
      id={roomId}
      initialPresence={{
        cursor: null,
        name: "",
        color: "",
        avatar: "",
      }}
      initialStorage={{
        code: initialCode,
        output: "",
        hasError: false,
        isRunning: false,
      }}
    >
      <ClientSideSuspense
        fallback={
          <div className="min-h-screen bg-black flex items-center justify-center">
            <div className="text-center">
              <Loader2 className="w-8 h-8 text-violet-400 animate-spin mx-auto mb-4" />
              <p className="text-gray-400">Connecting to room...</p>
            </div>
          </div>
        }
      >
        {children}
      </ClientSideSuspense>
    </RoomProvider>
  );
}