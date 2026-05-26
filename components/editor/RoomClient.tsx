"use client";

import { useState, useCallback } from "react";
import Toolbar from "./Toolbar";
import CollaborativeEditor from "./CollaborativeEditor";
import Output from "./Output";
import LiveCursors from "./LiveCursors";
import PresenceIndicators from "./PresenceIndicators";
import LiveblocksRoomProvider from "./LiveblocksProvider";
import { useStorage, useMutation } from "@/liveblocks.config";

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

  // Get output from Liveblocks storage
  const output = useStorage((root) => root.output) ?? "";
  const outputError = useStorage((root) => root.hasError) ?? false;
  const isRunning = useStorage((root) => root.isRunning) ?? false;

  // Update output in Liveblocks storage
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
    <div className="min-h-screen bg-black flex flex-col">
      <LiveCursors />
      <Toolbar
        room={room}
        user={user}
        language={language}
        onLanguageChange={handleLanguageChange}
        onRunCode={handleRunCode}
        isRunning={isRunning}
        presenceIndicators={<PresenceIndicators />}
      />
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
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
        <div className="w-full lg:w-96 border-t lg:border-t-0 lg:border-l border-white/10">
          <Output
            output={output}
            isRunning={isRunning}
            hasError={outputError}
          />
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
    javascript: `// Welcome to CodeSync! 🚀\nconsole.log("Hello, World!");`,
    typescript: `// Welcome to CodeSync! 🚀\nconst message: string = "Hello, World!";\nconsole.log(message);`,
    python: `# Welcome to CodeSync! 🚀\nprint("Hello, World!")`,
    java: `// Welcome to CodeSync! 🚀\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}`,
    cpp: `// Welcome to CodeSync! 🚀\n#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, World!" << endl;\n    return 0;\n}`,
    c: `// Welcome to CodeSync! 🚀\n#include <stdio.h>\n\nint main() {\n    printf("Hello, World!\\n");\n    return 0;\n}`,
    go: `// Welcome to CodeSync! 🚀\npackage main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello, World!")\n}`,
    rust: `// Welcome to CodeSync! 🚀\nfn main() {\n    println!("Hello, World!");\n}`,
  };
  return defaults[language] || `// Welcome to CodeSync! 🚀\nconsole.log("Hello, World!");`;
}
const COLORS = [
  "#E57373", "#F06292", "#BA68C8", "#9575CD",
  "#7986CB", "#64B5F6", "#4FC3F7", "#4DD0E1",
  "#4DB6AC", "#81C784", "#AED581", "#FFD54F",
];

function getRandomColor() {
  return COLORS[Math.floor(Math.random() * COLORS.length)];
}