"use client";

import Editor from "@monaco-editor/react";

interface Props {
  language: string;
  code: string;
  onChange: (code: string) => void;
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
};

export default function CodeEditor({ language, code, onChange }: Props) {
  return (
    <div className="h-full w-full">
      <Editor
        height="100vh"
        language={languageMap[language] || "javascript"}
        value={code}
        onChange={(value) => onChange(value || "")}
        theme="vs-dark"
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