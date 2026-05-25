"use client";

import { Terminal, Loader2, CheckCircle, XCircle } from "lucide-react";

interface Props {
  output: string;
  isRunning: boolean;
  hasError: boolean;
}

export default function Output({ output, isRunning, hasError }: Props) {
  return (
    <div className="h-full flex flex-col bg-gray-950">
      
      {/* Header */}
      <div className="h-10 border-b border-white/10 flex items-center px-4 gap-2">
        <Terminal className="w-4 h-4 text-gray-400" />
        <span className="text-gray-400 text-sm font-medium">Output</span>
        {output && !isRunning && (
          <div className="ml-auto">
            {hasError ? (
              <XCircle className="w-4 h-4 text-red-400" />
            ) : (
              <CheckCircle className="w-4 h-4 text-green-400" />
            )}
          </div>
        )}
      </div>

      {/* Output Content */}
      <div className="flex-1 p-4 overflow-auto">
        {isRunning ? (
          <div className="flex items-center gap-3 text-gray-400">
            <Loader2 className="w-4 h-4 animate-spin text-violet-400" />
            <span className="text-sm">Running your code...</span>
          </div>
        ) : output ? (
          <pre
            className={`text-sm font-mono whitespace-pre-wrap leading-relaxed ${
              hasError ? "text-red-400" : "text-green-400"
            }`}
          >
            {output}
          </pre>
        ) : (
          <div className="text-center mt-12">
            <Terminal className="w-8 h-8 text-gray-700 mx-auto mb-3" />
            <p className="text-gray-600 text-sm">
              Click "Run Code" to see output
            </p>
          </div>
        )}
      </div>
    </div>
  );
}