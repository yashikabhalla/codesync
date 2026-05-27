"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Bot,
  Loader2,
  Lightbulb,
  Code2,
  Trophy,
  RefreshCw,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface Props {
  code: string;
  language: string;
}

type Difficulty = "Easy" | "Medium" | "Hard";

const TOPICS = [
  { label: "Arrays", value: "Arrays" },
  { label: "Strings", value: "Strings" },
  { label: "Linked List", value: "Linked Lists" },
  { label: "Trees", value: "Binary Trees" },
  { label: "Graphs", value: "Graphs" },
  { label: "DP", value: "Dynamic Programming" },
  { label: "Recursion", value: "Recursion" },
  { label: "Sorting", value: "Sorting Algorithms" },
  { label: "Binary Search", value: "Binary Search" },
  { label: "Stack/Queue", value: "Stacks and Queues" },
  { label: "Hashing", value: "Hash Maps" },
  { label: "Greedy", value: "Greedy Algorithms" },
];

export default function AIInterviewer({ code, language }: Props) {
  const [problem, setProblem] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty>("Medium");
  const [topic, setTopic] = useState("Arrays");
  const [aiResponse, setAiResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingAction, setLoadingAction] = useState("");
  const [score, setScore] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(true);

  const callAI = async (action: string) => {
    setLoading(true);
    setLoadingAction(action);
    setAiResponse("");

    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          difficulty,
          topic,
          code,
          language,
          problem,
        }),
      });

      const data = await response.json();

      if (data.result) {
        if (action === "generate_problem") {
          setProblem(data.result);
          setScore(null);
          setAiResponse("");
        } else if (action === "score_solution") {
          setScore(data.result);
          setAiResponse("");
        } else {
          setAiResponse(data.result);
        }
      } else if (data.error) {
        setAiResponse(`Error: ${data.error}`);
      }
    } catch (error) {
      setAiResponse("Network error. Please try again.");
    } finally {
      setLoading(false);
      setLoadingAction("");
    }
  };

  const getScoreColor = (scoreText: string) => {
    const match = scoreText.match(/SCORE:\s*(\d+)/);
    if (!match) return "text-gray-400";
    const num = parseInt(match[1]);
    if (num >= 80) return "text-green-400";
    if (num >= 60) return "text-yellow-400";
    return "text-red-400";
  };

  return (
    <div className="flex flex-col h-full bg-gray-950">

      {/* Header */}
      <div
        className="h-10 border-b border-white/10 flex items-center px-4 justify-between cursor-pointer hover:bg-white/5 transition-colors flex-shrink-0"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <Bot className="w-4 h-4 text-violet-400" />
          <span className="text-gray-400 text-sm font-medium">
            AI Interviewer
          </span>
          {problem && (
            <div className="w-2 h-2 bg-green-400 rounded-full" />
          )}
        </div>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-gray-500" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-500" />
        )}
      </div>

      {isExpanded && (
        <div className="flex-1 overflow-y-auto p-4 space-y-4">

          {/* Topic Selector */}
          <div>
            <p className="text-gray-500 text-xs mb-2 uppercase tracking-wide">
              Topic
            </p>
            <div className="flex flex-wrap gap-1.5">
              {TOPICS.map((t) => (
                <button
                  key={t.value}
                  onClick={() => setTopic(t.value)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                    topic === t.value
                      ? "bg-violet-600/30 text-violet-300 border border-violet-500/40"
                      : "bg-gray-800 text-gray-500 border border-gray-700 hover:bg-gray-700 hover:text-gray-300"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty Selector */}
          <div>
            <p className="text-gray-500 text-xs mb-2 uppercase tracking-wide">
              Difficulty
            </p>
            <div className="flex gap-2">
              {(["Easy", "Medium", "Hard"] as Difficulty[]).map((d) => (
                <button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all flex-1 ${
                    difficulty === d
                      ? d === "Easy"
                        ? "bg-green-600/30 text-green-400 border border-green-500/30"
                        : d === "Medium"
                        ? "bg-yellow-600/30 text-yellow-400 border border-yellow-500/30"
                        : "bg-red-600/30 text-red-400 border border-red-500/30"
                      : "bg-gray-800 text-gray-500 border border-gray-700 hover:bg-gray-700"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Generate Problem Button */}
          <Button
            onClick={() => callAI("generate_problem")}
            disabled={loading}
            className="w-full bg-violet-600 hover:bg-violet-700 text-white gap-2"
            size="sm"
          >
            {loading && loadingAction === "generate_problem" ? (
              <>
                <Loader2 className="w-3 h-3 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <RefreshCw className="w-3 h-3" />
                Generate {topic} Problem
              </>
            )}
          </Button>

          {/* Problem Display */}
          {problem && (
            <div className="bg-gray-900 border border-white/10 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-gray-400 text-xs uppercase tracking-wide">
                  Problem
                </p>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${
                    difficulty === "Easy"
                      ? "text-green-400 border-green-500/30 bg-green-500/10"
                      : difficulty === "Medium"
                      ? "text-yellow-400 border-yellow-500/30 bg-yellow-500/10"
                      : "text-red-400 border-red-500/30 bg-red-500/10"
                  }`}>
                    {difficulty}
                  </span>
                  <span className="text-xs text-violet-400 border border-violet-500/30 bg-violet-500/10 px-2 py-0.5 rounded-full">
                    {topic}
                  </span>
                </div>
              </div>
              <pre className="text-gray-200 text-xs leading-relaxed whitespace-pre-wrap font-sans">
                {problem}
              </pre>
            </div>
          )}

          {/* Action Buttons */}
          {problem && (
            <div className="space-y-2">
              <Button
                onClick={() => callAI("get_hint")}
                disabled={loading || !code.trim()}
                variant="outline"
                className="w-full border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10 gap-2"
                size="sm"
              >
                {loading && loadingAction === "get_hint" ? (
                  <>
                    <Loader2 className="w-3 h-3 animate-spin" />
                    Getting hint...
                  </>
                ) : (
                  <>
                    <Lightbulb className="w-3 h-3" />
                    Get Hint
                  </>
                )}
              </Button>

              <Button
                onClick={() => callAI("review_code")}
                disabled={loading || !code.trim()}
                variant="outline"
                className="w-full border-blue-500/30 text-blue-400 hover:bg-blue-500/10 gap-2"
                size="sm"
              >
                {loading && loadingAction === "review_code" ? (
                  <>
                    <Loader2 className="w-3 h-3 animate-spin" />
                    Reviewing...
                  </>
                ) : (
                  <>
                    <Code2 className="w-3 h-3" />
                    Review My Code
                  </>
                )}
              </Button>

              <Button
                onClick={() => callAI("score_solution")}
                disabled={loading || !code.trim()}
                variant="outline"
                className="w-full border-green-500/30 text-green-400 hover:bg-green-500/10 gap-2"
                size="sm"
              >
                {loading && loadingAction === "score_solution" ? (
                  <>
                    <Loader2 className="w-3 h-3 animate-spin" />
                    Scoring...
                  </>
                ) : (
                  <>
                    <Trophy className="w-3 h-3" />
                    Score My Solution
                  </>
                )}
              </Button>
            </div>
          )}

          {/* AI Response */}
          {aiResponse && (
            <div className="bg-gray-900 border border-violet-500/20 rounded-xl p-4">
              <p className="text-violet-400 text-xs uppercase tracking-wide mb-2 flex items-center gap-1">
                <Bot className="w-3 h-3" />
                AI Response
              </p>
              <p className="text-gray-300 text-xs leading-relaxed whitespace-pre-wrap">
                {aiResponse}
              </p>
            </div>
          )}

          {/* Score Display */}
          {score && (
            <div className="bg-gray-900 border border-green-500/20 rounded-xl p-4">
              <p className="text-green-400 text-xs uppercase tracking-wide mb-3 flex items-center gap-1">
                <Trophy className="w-3 h-3" />
                Score
              </p>
              <pre className={`text-sm font-mono whitespace-pre-wrap leading-relaxed ${getScoreColor(score)}`}>
                {score}
              </pre>
            </div>
          )}

          {/* Empty state */}
          {!problem && (
            <div className="text-center py-6">
              <Bot className="w-8 h-8 text-gray-700 mx-auto mb-3" />
              <p className="text-gray-600 text-xs">
                Select a topic and difficulty, then generate a problem
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}