"use client";

import Link from "next/link";
import { useState, useMemo } from "react";

interface ExperimentMeta {
  id: string;
  name: string;
  path: string;
}

const experimentsList: ExperimentMeta[] = Array.from({ length: 184 }, (_, i) => {
  const id = `test${i + 1}`;
  return {
    id,
    name: `Experiment ${id.toUpperCase()}`,
    path: `/expermnets/${id}`,
  };
});

const customNames: Record<string, string> = {
  test1: "Ink Wisps",
  test2: "Celestial Dust",
  test3: "Neural Web",
  test4: "Magnetic Shavings",
  test5: "Living Watercolor",
  test6: "Attractor Conductor",
  test8: "Temporal Rift",
  test9: "Aether Lens",
  test10: "Attractor V2",
  test11: "Umbral Engine",
  test12: "Glyph Weaver",
  test13: "Moire Engine",
  test14: "Crystalline Lattice",
  test15: "Ectoplasmic Lens",
  test16: "Chroma Weave",
  test17: "Spectral Weave",
  test18: "Holographic Decay",
  test19: "Architect's Dream",
  test20: "Nebula Flow",
  test21: "Digital Silk",
  test22: "Hyper Topology",
  test23: "Neural Void",
  test25: "Aether Flux",
  test26: "Liquid Vortex",
  test27: "Neural Constellation",
  test28: "Digital Rain",
  test29: "Gravitational Orbs",
  test30: "Geometric Kaleidoscope",
  test31: "Cosmic Flow Field",
  test32: "Cyber Grid",
  test33: "Particle Sand",
  test34: "Fractal Growth",
  test35: "Wave Synthesis",
  test36: "Gravitational Void",
  test38: "Neon Fluid Particles",
  test39: "Neon Flow V2",
  test40: "Red Swarm",
  test41: "Warp Speed",
  test42: "Matrix Rain",
  test43: "Soft Blobs",
  test44: "Lissajous Network",
  test45: "Spiral Galaxy",
  test46: "Inferno",
  test47: "Neon Waves",
  test48: "Physarum Mold",
  test49: "Audio Visualizer",
};

const experiments = experimentsList.map(exp => ({
  ...exp,
  name: customNames[exp.id] || exp.name
}));

export default function ExperimentsGallery() {
  const [search, setSearch] = useState("");

  const filteredExperiments = useMemo(() => {
    return experiments.filter(exp =>
      exp.name.toLowerCase().includes(search.toLowerCase()) ||
      exp.id.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-[#faf8f5]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0d0d0d]/95 backdrop-blur-sm border-b border-[rgba(212,165,116,0.1)]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 sm:py-5">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/" className="flex items-center gap-2 text-[#d4a574] hover:text-[#e8c9a8] transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="text-sm font-medium">Home</span>
            </Link>
            <div className="h-4 w-px bg-[rgba(212,165,116,0.2)]" />
            <h1 className="text-lg sm:text-xl font-light text-[#faf8f5]">Animation Archive</h1>
          </div>
          
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search animations..."
              className="w-full bg-[#141414] border border-[rgba(212,165,116,0.15)] rounded-lg py-3 px-4 pl-11 text-sm text-[#faf8f5] placeholder-[#6b6560] focus:outline-none focus:border-[#d4a574]/50 focus:bg-[#1a1a18] transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b6560]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          
          <div className="mt-3 text-xs text-[#6b6560]">
            {filteredExperiments.length} animations found
          </div>
        </div>
      </header>

      {/* Link List */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <div className="space-y-8">
          {filteredExperiments.map((experiment, index) => (
            <Link 
              key={experiment.id}
              href={experiment.path}
              className="block py-4 px-4 -mx-4 rounded-lg hover:bg-[#141414] transition-colors group border-b border-[rgba(212,165,116,0.08)] last:border-0"
            >
              {/* URL Path */}
              <div className="text-xs text-[#6b6560] mb-1.5 flex items-center gap-1">
                <span className="text-[#9a9590]">localhost:3001</span>
                <span>› expermnets › {experiment.id}</span>
              </div>
              
              {/* Title */}
              <h2 className="text-lg sm:text-xl text-[#d4a574] group-hover:text-[#e8c9a8] transition-colors mb-2">
                {experiment.name}
              </h2>
              
              {/* Description */}
              <p className="text-sm text-[#9a9590] leading-relaxed">
                Animation #{String(index + 1).padStart(3, "0")} — Canvas-based procedural animation experiment. Click to view full screen.
              </p>
            </Link>
          ))}
        </div>

        {filteredExperiments.length === 0 && (
          <div className="py-16 text-center">
            <p className="text-[#6b6560]">No animations found for "{search}"</p>
          </div>
        )}
      </main>
    </div>
  );
}
