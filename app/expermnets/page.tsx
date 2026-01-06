"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useMemo } from "react";

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

function ExperimentCard({ experiment, index }: { experiment: ExperimentMeta; index: number }) {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1, rootMargin: "200px" }
    );
    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <Link href={experiment.path} className="block group">
      <div
        ref={cardRef}
        className="relative h-[200px] md:h-[280px] bg-[#0a0a0a] rounded-lg overflow-hidden border border-white/5 transition-all duration-500 group-hover:border-cyan-500/30 group-hover:shadow-[0_0_40px_rgba(34,211,238,0.1)] card-hover"
      >
        {/* Preview */}
        <div className="absolute inset-0">
          {isVisible ? (
            <iframe
              src={experiment.path}
              className="w-[200%] h-[200%] border-none pointer-events-none transform scale-50 origin-top-left opacity-40 group-hover:opacity-70 transition-all duration-500"
              title={experiment.name}
              loading="lazy"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="w-6 h-6 border-2 border-white/10 border-t-cyan-500/50 rounded-full animate-spin" />
            </div>
          )}
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-90" />

        {/* Info */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] text-cyan-400/70 font-mono uppercase tracking-wider">
              #{String(index + 1).padStart(3, "0")}
            </span>
            <div className="flex-1 h-px bg-gradient-to-r from-cyan-500/20 to-transparent" />
          </div>
          <h3 className="text-sm md:text-base font-medium text-white/90 group-hover:text-white transition-colors truncate">
            {experiment.name}
          </h3>
        </div>

        {/* Hover Glow */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
        </div>
      </div>
    </Link>
  );
}

export default function ExperimentsGallery() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 6;

  const filteredExperiments = useMemo(() => {
    return experiments.filter(exp =>
      exp.name.toLowerCase().includes(search.toLowerCase()) ||
      exp.id.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  const totalPages = Math.ceil(filteredExperiments.length / ITEMS_PER_PAGE);
  const currentExperiments = filteredExperiments.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="min-h-screen bg-[#030303] text-white">
      {/* Header */}
      <nav className="sticky top-0 z-50 glass border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <Link href="/" className="group flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center">
              <span className="text-xs font-bold">A</span>
            </div>
            <div>
              <span className="text-sm font-medium text-white/90 group-hover:text-white transition-colors">
                Animation Archive
              </span>
              <div className="text-[10px] text-gray-500 uppercase tracking-wider">
                {filteredExperiments.length} experiments
              </div>
            </div>
          </Link>

          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="Search experiments..."
              className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 px-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 focus:bg-white/10 transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
      </nav>

      {/* Grid */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {currentExperiments.map((experiment, index) => (
            <ExperimentCard
              key={experiment.id}
              experiment={experiment}
              index={(currentPage - 1) * ITEMS_PER_PAGE + index}
            />
          ))}
        </div>

        {filteredExperiments.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-light text-gray-400 mb-2">No experiments found</h3>
            <p className="text-sm text-gray-600">Try a different search term</p>
          </div>
        )}
      </main>

      {/* Pagination */}
      {filteredExperiments.length > 0 && (
        <footer className="sticky bottom-0 glass border-t border-white/5">
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex justify-between items-center">
            <div className="text-sm text-gray-500">
              Page <span className="text-white">{currentPage}</span> of{" "}
              <span className="text-white">{totalPages}</span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 text-sm bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 hover:border-white/20 disabled:opacity-30 disabled:hover:bg-white/5 transition-all"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 text-sm bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 rounded-lg hover:bg-cyan-500/30 disabled:opacity-30 disabled:hover:bg-cyan-500/20 transition-all"
              >
                Next
              </button>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
