"use client";
import { useState, useCallback, useRef, useEffect } from "react";
import Toolbar from "./Toolbar";
import CollaborativeEditor from "./CollaborativeEditor";
import Output from "./Output";
import LiveCursors from "./LiveCursors";
import PresenceIndicators from "./PresenceIndicators";
import LiveblocksRoomProvider from "./LiveblocksProvider";
import VideoCall from "./VideoCall";
import { Button } from "@/components/ui/button";
import { useStorage, useMutation } from "@/liveblocks.config";
import AIChat from "./AIChat";

interface Room {
  id: string;
  name: string;
  language: string;
}

interface User {
  id: string;
  name: string;
  avatar: string;
}

interface Props {
  room: Room;
  user: User;
}

function RoomContent({ room, user }: Props) {
  const [language, setLanguage] = useState(room.language);
  const [code, setCode] = useState("");
  const [showVideo, setShowVideo] = useState(false);

  // Resizable output state
  const [outputHeight, setOutputHeight] = useState(176);
  const isDragging = useRef(false);
  const dragStartY = useRef(0);
  const dragStartHeight = useRef(176);

  const isVideoCallActive = useStorage((root) => root.isVideoCallActive) ?? false;
  const output = useStorage((root) => root.output) ?? "";
  const outputError = useStorage((root) => root.hasError) ?? false;
  const isRunning = useStorage((root) => root.isRunning) ?? false;

  const updateOutput = useMutation(
    ({ storage }, newOutput: string, hasError: boolean) => {
      storage.set("output", newOutput);
      storage.set("hasError", hasError);
    },
    []
  );

  const updateRunning = useMutation(
    ({ storage }, running: boolean) => {
      storage.set("isRunning", running);
    },
    []
  );

  const updateVideoCall = useMutation(
    ({ storage }, active: boolean) => {
      storage.set("isVideoCallActive", active);
    },
    []
  );

  // Drag resize logic
  const onDragMouseDown = useCallback((e: React.MouseEvent) => {
    isDragging.current = true;
    dragStartY.current = e.clientY;
    dragStartHeight.current = outputHeight;
    document.body.style.cursor = "row-resize";
    document.body.style.userSelect = "none";
  }, [outputHeight]);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      const delta = dragStartY.current - e.clientY; // drag up = taller output
      const newHeight = Math.min(500, Math.max(48, dragStartHeight.current + delta));
      setOutputHeight(newHeight);
    };
    const onMouseUp = () => {
      if (!isDragging.current) return;
      isDragging.current = false;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  const handleVideoToggle = () => {
    const newState = !showVideo;
    setShowVideo(newState);
    updateVideoCall(newState);
  };

  const handleCodeChange = useCallback((newCode: string) => {
    setCode(newCode);
  }, []);

  const handleRunCode = async () => {
    updateRunning(true);
    updateOutput("", false);

    try {
      const response = await fetch("/api/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language }),
      });

      const data = await response.json();

      if (data.output) {
        const isError =
          data.output.toLowerCase().includes("error") ||
          data.output.toLowerCase().includes("exception") ||
          data.statusCode !== 200;
        updateOutput(data.output, isError);
      } else if (data.error) {
        updateOutput(data.error, true);
      } else {
        updateOutput("Code ran successfully with no output.", false);
      }
    } catch (error) {
      updateOutput("Network error. Please try again.", true);
    } finally {
      updateRunning(false);
    }
  };

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    updateOutput("", false);
  };

  return (
    <div className="h-screen bg-black flex flex-col overflow-hidden">
      {/* Live Cursors */}
      <LiveCursors />

      {/* Video Call Notification */}
      {isVideoCallActive && !showVideo && (
        <div className="bg-violet-600/20 border-b border-violet-500/30 px-4 py-2 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-violet-400 rounded-full animate-pulse" />
            <span className="text-violet-300 text-sm">
              Someone started a video call!
            </span>
          </div>
          <Button
            size="sm"
            onClick={handleVideoToggle}
            className="bg-violet-600 hover:bg-violet-700 text-white h-7 text-xs"
          >
            Join Video Call
          </Button>
        </div>
      )}

      {/* Toolbar */}
      <Toolbar
        room={room}
        user={user}
        language={language}
        onLanguageChange={handleLanguageChange}
        onRunCode={handleRunCode}
        isRunning={isRunning}
        presenceIndicators={<PresenceIndicators />}
        onVideoToggle={handleVideoToggle}
        isVideoOn={showVideo}
      />

      {/* Main Area */}
      <div className="flex-1 flex overflow-hidden">

        {/* Left Side — Editor + Resizable Output */}
        <div className="flex-1 flex flex-col overflow-hidden">

          {/* Editor — takes all remaining space */}
          <div className="flex-1 overflow-hidden">
            <CollaborativeEditor
              language={language}
              onCodeChange={handleCodeChange}
              user={{
                name: user.name,
                avatar: user.avatar,
                color: getRandomColor(),
              }}
            />
          </div>

          {/* Drag Handle */}
          <div
            onMouseDown={onDragMouseDown}
            className="h-[5px] flex-shrink-0 border-t border-white/10 flex items-center justify-center cursor-row-resize group relative select-none z-10"
          >
            {/* Grip dots */}
            <div className="flex gap-[3px] opacity-0 group-hover:opacity-100 transition-opacity duration-150">
              <div className="w-6 h-[2px] rounded-full bg-violet-400/80" />
              <div className="w-6 h-[2px] rounded-full bg-violet-400/80" />
              <div className="w-6 h-[2px] rounded-full bg-violet-400/80" />
            </div>
            {/* Hover highlight */}
            <div className="absolute inset-0 bg-violet-500/0 group-hover:bg-violet-500/10 active:bg-violet-500/20 transition-colors duration-150" />
          </div>

          {/* Output Panel — height controlled by drag */}
          <div
            className="flex-shrink-0 overflow-hidden"
            style={{ height: outputHeight }}
          >
            <Output
              output={output}
              isRunning={isRunning}
              hasError={outputError}
            />
          </div>
        </div>

        {/* Right Side — Video + AI Chat */}
        <div className="w-96 border-l border-white/10 flex flex-col flex-shrink-0">

          {/* Video Call */}
          {showVideo && (
            <div className="h-56 border-b border-white/10 flex-shrink-0">
              <VideoCall
                roomId={room.id}
                onClose={() => setShowVideo(false)}
              />
            </div>
          )}

          {/* AI Chat */}
          <div className="flex-1 overflow-hidden">
            <AIChat />
          </div>
        </div>

      </div>
    </div>
  );
}

export default function RoomClient({ room, user }: Props) {
  const initialCode = getDefaultCode(room.language);

  return (
    <LiveblocksRoomProvider
      roomId={room.id}
      initialCode={initialCode}
    >
      <RoomContent room={room} user={user} />
    </LiveblocksRoomProvider>
  );
}

function getDefaultCode(language: string): string {
  const defaults: Record<string, string> = {
    javascript: `// Welcome to Collabrix! 🚀\nconsole.log("Hello, World!");`,
    typescript: `// Welcome to Collabrix! 🚀\nconst message: string = "Hello, World!";\nconsole.log(message);`,
    python: `# Welcome to Collabrix! 🚀\nprint("Hello, World!")`,
    java: `// Welcome to Collabrix! 🚀\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}`,
    cpp: `// Welcome to Collabrix! 🚀\n#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, World!" << endl;\n    return 0;\n}`,
    c: `// Welcome to Collabrix! 🚀\n#include <stdio.h>\n\nint main() {\n    printf("Hello, World!\\n");\n    return 0;\n}`,
    go: `// Welcome to Collabrix! 🚀\npackage main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello, World!")\n}`,
    rust: `// Welcome to Collabrix! 🚀\nfn main() {\n    println!("Hello, World!");\n}`,
    kotlin: `// Welcome to Collabrix! 🚀\nfun main() {\n    println("Hello, World!")\n}`,
    swift: `// Welcome to Collabrix! 🚀\nprint("Hello, World!")`,
    php: `<?php\n// Welcome to Collabrix! 🚀\necho "Hello, World!\\n";`,
    ruby: `# Welcome to Collabrix! 🚀\nputs "Hello, World!"`,
  };
  return defaults[language] || `// Welcome to Collabrix! 🚀\nconsole.log("Hello, World!");`;
}

const COLORS = [
  "#E57373", "#F06292", "#BA68C8", "#9575CD",
  "#7986CB", "#64B5F6", "#4FC3F7", "#4DD0E1",
  "#4DB6AC", "#81C784", "#AED581", "#FFD54F",
];

function getRandomColor() {
  return COLORS[Math.floor(Math.random() * COLORS.length)];
}
