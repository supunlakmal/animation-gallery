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
    <div className="relative min-h-screen bg-[#030303] overflow-hidden">
      {/* Experiment Content */}
      <div className="absolute inset-0 z-0">
        {children}
      </div>

      {/* Navigation HUD */}
      <div className="absolute top-4 left-4 z-[9999]">
        <Link 
          href="/expermnets" 
          className="flex items-center gap-3 px-4 py-2.5 bg-black/60 backdrop-blur-md border border-white/10 rounded-lg hover:bg-black/80 hover:border-cyan-500/30 transition-all group"
        >
          <svg 
            className="w-4 h-4 text-gray-400 group-hover:text-cyan-400 transition-colors" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
            Back to Archive
          </span>
        </Link>
      </div>

      {/* Experiment ID Badge */}
      <div className="absolute top-4 right-4 z-[9999]">
        <div className="px-3 py-1.5 bg-black/60 backdrop-blur-md border border-white/10 rounded-lg">
          <span className="text-[10px] text-cyan-400/70 font-mono uppercase tracking-wider">
            {testId?.toUpperCase() || "UNKNOWN"}
          </span>
        </div>
      </div>
    </div>
  );
}
