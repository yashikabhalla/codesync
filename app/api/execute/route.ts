import { NextResponse } from "next/server";

const languageMap: Record<string, { language: string; versionIndex: string }> = {
  javascript: { language: "nodejs", versionIndex: "4" },
  typescript: { language: "typescript", versionIndex: "1" },
  python: { language: "python3", versionIndex: "4" },
  java: { language: "java", versionIndex: "4" },
  cpp: { language: "cpp17", versionIndex: "1" },
  c: { language: "c", versionIndex: "5" },
  go: { language: "go", versionIndex: "4" },
  rust: { language: "rust", versionIndex: "4" },
  kotlin: { language: "kotlin", versionIndex: "3" },
  swift: { language: "swift", versionIndex: "4" },
  php: { language: "php", versionIndex: "4" },
  ruby: { language: "ruby", versionIndex: "4" },
};

export async function POST(req: Request) {
  try {
    const { code, language } = await req.json();

    const lang = languageMap[language] || languageMap.javascript;

    const response = await fetch("https://api.jdoodle.com/v1/execute", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        clientId: process.env.JDOODLE_CLIENT_ID,
        clientSecret: process.env.JDOODLE_CLIENT_SECRET,
        script: code,
        language: lang.language,
        versionIndex: lang.versionIndex,
      }),
    });

    const data = await response.json();
    console.log("JDoodle response:", data);

    return NextResponse.json(data);
  } catch (error) {
    console.error("Execute error:", error);
    return NextResponse.json(
      { error: "Failed to execute code" },
      { status: 500 }
    );
  }
}