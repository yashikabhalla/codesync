import { Code2 } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center">
              <Code2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-bold text-xl">Collabrix</span>
          </Link>

          {/* Links */}
          <div className="flex items-center gap-8">
            <Link href="#features" className="text-gray-400 hover:text-white text-sm transition-colors">
              Features
            </Link>
            <Link href="#how-it-works" className="text-gray-400 hover:text-white text-sm transition-colors">
              How it Works
            </Link>
            <Link href="#pricing" className="text-gray-400 hover:text-white text-sm transition-colors">
              Pricing
            </Link>
          </div>

          {/* Copyright */}
          <p className="text-gray-500 text-sm">
            © 2026 Collabrix. Built for placement prep.
          </p>
        </div>
      </div>
    </footer>
  );
}