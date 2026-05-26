"use client";

import { useOthers } from "@/liveblocks.config";

export default function LiveCursors() {
  const others = useOthers();

  return (
    <>
      {others.map(({ connectionId, presence }) => {
        if (!presence.cursor) return null;

        return (
          <div
            key={connectionId}
            style={{
              position: "fixed",
              left: presence.cursor.x,
              top: presence.cursor.y,
              pointerEvents: "none",
              zIndex: 9999,
              transform: "translate(-2px, -2px)",
            }}
          >
            {/* Name Label ABOVE cursor */}
            <div
              style={{
                backgroundColor: presence.color,
                color: "white",
                padding: "2px 8px",
                borderRadius: "4px",
                fontSize: "12px",
                fontWeight: 600,
                whiteSpace: "nowrap",
                marginBottom: "4px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
                display: "inline-block",
              }}
            >
              {presence.name}
            </div>

            {/* Cursor SVG below name */}
            <div>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5.5 3.5L19.5 12.5L12.5 13.5L9.5 20.5L5.5 3.5Z"
                  fill={presence.color}
                  stroke="white"
                  strokeWidth="1.5"
                />
              </svg>
            </div>
          </div>
        );
      })}
    </>
  );
}