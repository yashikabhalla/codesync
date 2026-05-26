"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

import {
  Video,
  PhoneOff,
  Loader2,
  ExternalLink,
} from "lucide-react";

interface Props {
  roomId: string;
  onClose: () => void;
}

export default function VideoCall({
  roomId,
  onClose,
}: Props) {
  const [isLoading, setIsLoading] = useState(true);

  const [meetingUrl, setMeetingUrl] = useState("");

  const [error, setError] = useState("");

  useEffect(() => {
    createVideoRoom();
  }, []);

  const createVideoRoom = async () => {
    setIsLoading(true);

    setError("");

    try {
      const response = await fetch("/api/video-room", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ roomId }),
      });

      const data = await response.json();

      if (data.url) {
        setMeetingUrl(data.url);
      } else {
        setError("Could not create video room.");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const openInNewTab = () => {
    window.open(meetingUrl, "_blank");
  };

  return (
    <div className="flex flex-col h-full bg-gray-950">

      {/* Header */}
      <div className="h-10 border-b border-white/10 flex items-center px-4 justify-between flex-shrink-0">

        <div className="flex items-center gap-2">
          <Video className="w-4 h-4 text-violet-400" />

          <span className="text-gray-400 text-sm font-medium">
            Video Call
          </span>

          {!isLoading && meetingUrl && (
            <div className="flex items-center gap-1 ml-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />

              <span className="text-green-400 text-xs">
                Live
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">

          {/* Open in new tab button */}
          {meetingUrl && (
            <Button
              variant="ghost"
              size="sm"
              onClick={openInNewTab}
              className="text-gray-400 hover:text-white h-7 px-2 gap-1"
            >
              <ExternalLink className="w-3 h-3" />

              <span className="text-xs">
                Pop out
              </span>
            </Button>
          )}

          {/* End Call Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="rounded-full w-7 h-7 p-0 bg-red-600 text-white hover:bg-red-700"
          >
            <PhoneOff className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {/* Video Content */}
      <div className="flex-1 relative overflow-hidden">

        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-950">

            <div className="text-center">
              <Loader2 className="w-8 h-8 text-violet-400 animate-spin mx-auto mb-3" />

              <p className="text-gray-400 text-sm">
                Setting up video call...
              </p>
            </div>

          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-950">

            <div className="text-center px-4">

              <p className="text-red-400 text-sm mb-3">
                {error}
              </p>

              <Button
                size="sm"
                onClick={createVideoRoom}
                className="bg-violet-600 hover:bg-violet-700 text-white"
              >
                Try Again
              </Button>

            </div>

          </div>
        )}

        {meetingUrl && !isLoading && (
  <iframe
    src={`${meetingUrl}#config.prejoinPageEnabled=false&interfaceConfig.SHOW_JITSI_WATERMARK=false&interfaceConfig.SHOW_WATERMARK_FOR_GUESTS=false&interfaceConfig.SHOW_BRAND_WATERMARK=false&interfaceConfig.SHOW_POWERED_BY=false`}
    allow="camera; microphone; fullscreen; display-capture; autoplay"
    className="w-full h-full border-0"
  />
)}

      </div>
    </div>
  );
}