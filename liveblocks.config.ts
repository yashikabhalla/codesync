import { createClient } from "@liveblocks/client";
import { createRoomContext } from "@liveblocks/react";

const client = createClient({
  authEndpoint: "/api/liveblocks-auth",
});

type Presence = {
  cursor: { x: number; y: number } | null;
  name: string;
  color: string;
  avatar: string;
};

type Storage = {
  code: string;
  output: string;
  hasError: boolean;
  isRunning: boolean;
};

type UserMeta = {
  id: string;
  info: {
    name: string;
    avatar: string;
    color: string;
  };
};

type RoomEvent = never;

export const {
  RoomProvider,
  useMyPresence,
  useOthers,
  useSelf,
  useStorage,
  useMutation,
  useRoom,
} = createRoomContext<Presence, Storage, UserMeta, RoomEvent>(client);