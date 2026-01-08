"use client";
import React, { useEffect, useRef } from "react";
import { createNoise2D } from "simplex-noise";

export default function AsciiNoise() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const noise2D = createNoise2D(Math.random);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const chars = " .:-=+*#%@";
    const charArray = chars.split("");
    const fontSize = 12;
    
    let time = 0;

    const animate = () => {
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, width, height);
      ctx.font = `${fontSize}px monospace`;
      ctx.fillStyle = "#0f0";

      const rows = Math.ceil(height / fontSize);
      const cols = Math.ceil(width / (fontSize * 0.6)); // Monospace approx width

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            const noiseVal = noise2D(x * 0.05, y * 0.05 + time);
            const index = Math.floor(((noiseVal + 1) / 2) * charArray.length);
            const char = charArray[Math.min(index, charArray.length - 1)];
            
            ctx.fillText(char, x * fontSize * 0.6, y * fontSize);
        }
      }

      time += 0.01;
      requestAnimationFrame(animate);
    };

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener("resize", handleResize);
    const frameId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(frameId);
    };
    // Intentionally run once on mount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full" />;
}
