"use client";

import { useState } from "react";
import Toolbar from "./Toolbar";
import CodeEditor from "./CodeEditor";
import Output from "./Output";

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

export default function RoomClient({ room, user }: Props) {
  const [language, setLanguage] = useState(room.language);
  const [code, setCode] = useState(getDefaultCode(room.language));
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [outputError, setOutputError] = useState(false);

 const handleRunCode = async () => {
  setIsRunning(true);
  setOutput("");
  setOutputError(false);

  try {
    const response = await fetch("/api/execute", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, language }),
    });

    const data = await response.json();
    console.log("Execute response:", data);

    if (data.output) {
      // Check if output contains error keywords
      const isError =
        data.output.toLowerCase().includes("error") ||
        data.output.toLowerCase().includes("exception") ||
        data.statusCode !== 200;

      setOutput(data.output);
      setOutputError(isError);
    } else if (data.error) {
      setOutput(data.error);
      setOutputError(true);
    } else {
      setOutput("Code ran successfully with no output.");
      setOutputError(false);
    }
  } catch (error) {
    console.error("Run code error:", error);
    setOutput("Network error. Please try again.");
    setOutputError(true);
  } finally {
    setIsRunning(false);
  }
};
  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    setCode(getDefaultCode(newLanguage));
    setOutput("");
  };

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Toolbar */}
      <Toolbar
        room={room}
        user={user}
        language={language}
        onLanguageChange={handleLanguageChange}
        onRunCode={handleRunCode}
        isRunning={isRunning}
      />

      {/* Editor + Output */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Code Editor - Left Side */}
        <div className="flex-1 overflow-hidden">
          <CodeEditor
            language={language}
            code={code}
            onChange={setCode}
          />
        </div>

        {/* Output - Right Side */}
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

// Helper functions
function getDefaultCode(language: string): string {
  const defaults: Record<string, string> = {
    javascript: `// Welcome to CodeSync! 🚀
console.log("Hello, World!");`,
    typescript: `// Welcome to CodeSync! 🚀
const message: string = "Hello, World!";
console.log(message);`,
    python: `# Welcome to CodeSync! 🚀
print("Hello, World!")`,
    java: `// Welcome to CodeSync! 🚀
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`,
    cpp: `// Welcome to CodeSync! 🚀
#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    return 0;
}`,
    c: `// Welcome to CodeSync! 🚀
#include <stdio.h>

int main() {
    printf("Hello, World!\\n");
    return 0;
}`,
    go: `// Welcome to CodeSync! 🚀
package main

import "fmt"

func main() {
    fmt.Println("Hello, World!")
}`,
    rust: `// Welcome to CodeSync! 🚀
fn main() {
    println!("Hello, World!");
}`,
  };
  return defaults[language] || `// Welcome to CodeSync! 🚀\nconsole.log("Hello, World!");`;
}

function getPistonLanguage(language: string): string {
  const map: Record<string, string> = {
    javascript: "javascript",
    typescript: "typescript",
    python: "python",
    java: "java",
    cpp: "c++",
    c: "c",
    go: "go",
    rust: "rust",
  };
  return map[language] || language;
}

