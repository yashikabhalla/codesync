"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Code2,
  Play,
  Loader2,
  ArrowLeft,
  Copy,
  Check,
  Video,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { UserButton } from "@clerk/nextjs";

const languages = [
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "cpp", label: "C++" },
  { value: "c", label: "C" },
  { value: "go", label: "Go" },
  { value: "rust", label: "Rust" },
];

interface Props {
  room: { id: string; name: string; language: string };
  user: { id: string; name: string; avatar: string };
  language: string;
  onLanguageChange: (lang: string) => void;
  onRunCode: () => void;
  isRunning: boolean;
  presenceIndicators?: React.ReactNode;
  onVideoToggle: () => void;
  isVideoOn: boolean;
  userPlan: "free" | "pro";
}

export default function Toolbar({
  room,
  user,
  language,
  onLanguageChange,
  onRunCode,
  isRunning,
  presenceIndicators,
  onVideoToggle,
  isVideoOn,
  userPlan,
}: Props) {
  const [copied, setCopied] = useState(false);

  const copyRoomLink = () => {
    navigator.clipboard.writeText(
      `${window.location.origin}/room/${room.id}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="h-14 border-b border-white/10 bg-gray-950 flex items-center justify-between px-4 gap-4">
      
      {/* Left Side */}
      <div className="flex items-center gap-3">
        <Link href="/dashboard">
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-white gap-1"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </Link>

        <div className="w-px h-6 bg-white/10" />

        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-violet-600 rounded flex items-center justify-center">
            <Code2 className="w-3 h-3 text-white" />
          </div>
          <span className="text-white font-medium text-sm hidden md:block">
            {room.name}
          </span>
        </div>
      </div>

      {/* Center - Language Selector */}
      <div className="flex items-center gap-3">
        <Select value={language} onValueChange={onLanguageChange}>
          <SelectTrigger className="w-36 bg-gray-800 border-gray-700 text-white h-8 text-sm">
            <SelectValue />
          </SelectTrigger>

          <SelectContent
            className="bg-gray-800 border-gray-700"
            position="popper"
            sideOffset={5}
          >
            {languages.map((lang) => (
              <SelectItem
                key={lang.value}
                value={lang.value}
                className="text-white hover:bg-gray-700 text-sm cursor-pointer"
              >
                {lang.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Run Button */}
        <Button
          onClick={onRunCode}
          disabled={isRunning}
          size="sm"
          className="bg-green-600 hover:bg-green-700 text-white gap-2"
        >
          {isRunning ? (
            <>
              <Loader2 className="w-3 h-3 animate-spin" />
              Running...
            </>
          ) : (
            <>
              <Play className="w-3 h-3" />
              Run Code
            </>
          )}
        </Button>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-3">
        {presenceIndicators}

        {/* Video Call Button */}
{/* Video Call Button */}
<Button
  variant="ghost"
  size="sm"
  onClick={() => {
    if (userPlan === "free") {
      alert(
        "⚡ Video calling is a Pro feature. Upgrade to Pro to use video calls!"
      );
      return;
    }

    onVideoToggle();
  }}
  className={`gap-2 hidden md:flex ${
    userPlan === "free"
      ? "opacity-50 cursor-not-allowed text-gray-500"
      : isVideoOn
      ? "text-red-400 bg-red-400/10 hover:bg-red-400/20"
      : "text-gray-400 hover:text-white"
  }`}
>
  <Video className="w-3 h-3" />

  <span className="text-xs">
    {userPlan === "free"
      ? "Pro Feature"
      : isVideoOn
      ? "End Video"
      : "Start Video"}
  </span>
</Button>

        {/* Share Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={copyRoomLink}
          className="text-gray-400 hover:text-white gap-2 hidden md:flex"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-green-400" />
              <span className="text-green-400 text-xs">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span className="text-xs">Share</span>
            </>
          )}
        </Button>

        <UserButton afterSignOutUrl="/" />
      </div>
    </div>
  );
}