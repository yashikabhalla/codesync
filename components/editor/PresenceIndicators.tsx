"use client";

import { useOthers, useSelf } from "@/liveblocks.config";

export default function PresenceIndicators() {
  const others = useOthers();
  const self = useSelf();

  return (
    <div className="flex items-center gap-1">

      {/* Current User */}
      {self && (
        <div className="relative group">
          <div
            className="w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold text-white overflow-hidden cursor-pointer"
            style={{ borderColor: self.info?.color || "#7C3AED" }}
          >
            {self.info?.avatar ? (
              <img
                src={self.info.avatar}
                alt={self.info.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span
                className="w-full h-full flex items-center justify-center"
                style={{ backgroundColor: self.info?.color }}
              >
                {self.info?.name?.[0] || "Y"}
              </span>
            )}
          </div>

          {/* Tooltip BELOW */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-gray-800 border border-white/10 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none">
            You ({self.info?.name})
            {/* Arrow pointing up */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 border-4 border-transparent border-b-gray-800" />
          </div>
        </div>
      )}

      {/* Other Users */}
      {others.map(({ connectionId, info }) => (
        <div key={connectionId} className="relative group">
          <div
            className="w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold text-white overflow-hidden cursor-pointer"
            style={{ borderColor: info?.color || "#7C3AED" }}
          >
            {info?.avatar ? (
              <img
                src={info.avatar}
                alt={info?.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center"
                style={{ backgroundColor: info?.color }}
              >
                {info?.name?.[0] || "U"}
              </div>
            )}
          </div>

          {/* Online indicator */}
          <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-400 rounded-full border border-black" />

          {/* Tooltip BELOW */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-gray-800 border border-white/10 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none">
            {info?.name || "Anonymous"}
            {/* Arrow pointing up */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 border-4 border-transparent border-b-gray-800" />
          </div>
        </div>
      ))}

      {/* Online Count */}
      {others.length > 0 && (
        <div className="ml-1 text-xs text-gray-500">
          {others.length + 1} online
        </div>
      )}
    </div>
  );
}