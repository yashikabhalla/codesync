
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
 
export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
 
    const body = await req.json();
    const { action } = body;
 
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Groq API key not configured" }, { status: 500 });
    }
 
    let messages: { role: string; content: string }[] = [];
 
    if (action === "chat") {
      const systemPrompt = body.systemPrompt || "";
      const chatMessages = body.messages || [];
      messages = [
        { role: "system", content: systemPrompt },
        ...chatMessages,
      ];
    } else {
      const { difficulty, topic, code, language, problem } = body;
      let prompt = "";
 
      if (action === "generate_problem") {
        prompt = problem
          ? `Generate the full problem statement for this DSA problem: "${problem}". Format with TITLE, DESCRIPTION, EXAMPLE 1, EXAMPLE 2, and CONSTRAINTS sections.`
          : `Generate a ${difficulty} DSA problem on ${topic}. Format with TITLE, DESCRIPTION, EXAMPLE, and CONSTRAINTS.`;
      } else if (action === "get_hint") {
        prompt = `Problem: ${problem}\nCode in ${language}:\n${code}\n\nGive ONE helpful hint without giving away the solution. 2-3 sentences, be encouraging.`;
      } else if (action === "review_code") {
        prompt = `Problem: ${problem}\nSolution in ${language}:\n${code}\n\nBrief code review: correctness, time complexity, space complexity, one improvement. Under 150 words.`;
      } else if (action === "score_solution") {
        prompt = `Problem: ${problem}\nSolution in ${language}:\n${code}\n\nScore 0-100. Reply EXACTLY:\nSCORE: X/100\nVERDICT: Excellent/Good/Average/Poor\nFEEDBACK: one sentence`;
      }
 
      messages = [
        { role: "system", content: "You are a helpful technical interviewer." },
        { role: "user", content: prompt },
      ];
    }
 
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages,
        max_tokens: 1024,
        temperature: 0.7,
      }),
    });
 
    const data = await response.json();
 
    if (data.error) {
      console.error("Groq error:", data.error);
      return NextResponse.json({ error: data.error.message }, { status: 500 });
    }
 
    const result = data.choices?.[0]?.message?.content || "";
    return NextResponse.json({ result });
 
  } catch (error) {
    console.error("AI route error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}