"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Code2, Menu, X } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { isSignedIn } = useAuth();

  return (
    <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center">
              <Code2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-bold text-xl">Collabrix</span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-gray-400 hover:text-white transition-colors text-sm">
              Features
            </Link>
            <Link href="#how-it-works" className="text-gray-400 hover:text-white transition-colors text-sm">
              How it Works
            </Link>
            <Link href="#pricing" className="text-gray-400 hover:text-white transition-colors text-sm">
              Pricing
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isSignedIn ? (
              <Link href="/dashboard">
                <Button className="bg-violet-600 hover:bg-violet-700 text-white">
                  Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/sign-in">
                  <Button variant="ghost" className="text-gray-400 hover:text-white">
                    Sign In
                  </Button>
                </Link>
                <Link href="/sign-up">
                  <Button className="bg-violet-600 hover:bg-violet-700 text-white">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-400"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-white/10">
            <div className="flex flex-col gap-4">
              <Link href="#features" className="text-gray-400 hover:text-white text-sm">
                Features
              </Link>
              <Link href="#how-it-works" className="text-gray-400 hover:text-white text-sm">
                How it Works
              </Link>
              <Link href="/sign-in">
                <Button variant="ghost" className="w-full text-gray-400">
                  Sign In
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button className="w-full bg-violet-600 hover:bg-violet-700">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}