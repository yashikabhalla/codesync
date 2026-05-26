"use client";

import { useEffect, useCallback } from "react";
import { useStorage, useMutation, useMyPresence } from "@/liveblocks.config";
import Editor from "@monaco-editor/react";

interface Props {
  language: string;
  onCodeChange: (code: string) => void;
  user: { name: string; avatar: string; color: string };
}

const languageMap: Record<string, string> = {
  javascript: "javascript",
  typescript: "typescript",
  python: "python",
  java: "java",
  cpp: "cpp",
  c: "c",
  go: "go",
  rust: "rust",
  kotlin: "kotlin",
  swift: "swift",
  php: "php",
  ruby: "ruby",
};

export default function CollaborativeEditor({
  language,
  onCodeChange,
  user,
}: Props) {
  const code = useStorage((root) => root.code);
  const [, updatePresence] = useMyPresence();

  const updateCode = useMutation(({ storage }, newCode: string) => {
    storage.set("code", newCode);
  }, []);

  // ✅ All hooks BEFORE early return
  useEffect(() => {
    updatePresence({
      name: user.name,
      avatar: user.avatar,
      color: user.color,
    });
  }, [user.name, user.avatar, user.color]);

  const handleChange = useCallback(
    (value: string | undefined) => {
      const newCode = value || "";
      updateCode(newCode);
      onCodeChange(newCode);
    },
    [updateCode, onCodeChange]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      updatePresence({
        cursor: { x: e.clientX, y: e.clientY },
        name: user.name,
        color: user.color,
        avatar: user.avatar,
      });
    },
    [updatePresence, user]
  );

  const handleMouseLeave = useCallback(() => {
    updatePresence({ cursor: null });
  }, [updatePresence]);

  // ✅ Early return AFTER all hooks
  if (code === null) return null;

  return (
    <div
      className="h-full w-full relative"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <Editor
        height="100vh"
        language={languageMap[language] || "javascript"}
        value={code}
        onChange={handleChange}
        theme="vs-dark"
        onMount={(editor) => {
          // Track mouse inside Monaco editor
          editor.onMouseMove((e) => {
            if (e.event) {
              updatePresence({
                cursor: {
                  x: e.event.posx,
                  y: e.event.posy,
                },
                name: user.name,
                color: user.color,
                avatar: user.avatar,
              });
            }
          });
          editor.onMouseLeave(() => {
            updatePresence({ cursor: null });
          });
        }}
        options={{
          fontSize: 14,
          fontFamily: "JetBrains Mono, Fira Code, monospace",
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          wordWrap: "on",
          padding: { top: 16, bottom: 16 },
          lineNumbers: "on",
          renderLineHighlight: "all",
          cursorBlinking: "smooth",
          smoothScrolling: true,
          automaticLayout: true,
          tabSize: 2,
          bracketPairColorization: { enabled: true },
          formatOnPaste: true,
          formatOnType: true,
        }}
      />
    </div>
  );
}