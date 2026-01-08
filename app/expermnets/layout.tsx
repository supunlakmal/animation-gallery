"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function ExperimentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const testId = pathname.split("/").pop();

  // Don't show the HUD on the main gallery page
  if (pathname === "/expermnets") {
    return <>{children}</>;
  }

  return (
    <div className="relative min-h-screen bg-[#0d0d0d] overflow-hidden">
      {/* Experiment Content */}
      <div className="absolute inset-0 z-0">
        {children}
      </div>

      {/* Navigation HUD */}
      <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-[9999]">
        <Link 
          href="/expermnets" 
          className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-2.5 bg-[#0d0d0d]/80 backdrop-blur-xl border border-[rgba(212,165,116,0.15)] rounded-lg hover:bg-[#0d0d0d]/90 hover:border-[rgba(212,165,116,0.35)] transition-all group"
        >
          <svg 
            className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#9a9590] group-hover:text-[#d4a574] transition-colors" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="text-xs sm:text-sm text-[#9a9590] group-hover:text-[#faf8f5] transition-colors">
            Back to Archive
          </span>
        </Link>
      </div>

      {/* Experiment ID Badge */}
      <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-[9999]">
        <div className="px-2.5 sm:px-3 py-1.5 bg-[#0d0d0d]/80 backdrop-blur-xl border border-[rgba(212,165,116,0.15)] rounded-lg">
          <span className="text-[9px] sm:text-[10px] text-[#d4a574]/80 font-mono uppercase tracking-wider">
            {testId?.toUpperCase() || "UNKNOWN"}
          </span>
        </div>
      </div>

      {/* Subtle Frame Border */}
      <div className="absolute inset-0 pointer-events-none z-[9998]">
        <div className="absolute inset-2 sm:inset-3 border border-[rgba(212,165,116,0.05)] rounded-lg" />
      </div>
    </div>
  );
}
