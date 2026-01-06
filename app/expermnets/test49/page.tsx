"use client";

import { useEffect, useRef } from "react";
import { createNoise2D } from "simplex-noise";

export default function AudioViz() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    const noise2D = createNoise2D(Math.random);

    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);
    let time = 0;

    const bars = 64;
    
    const animate = () => {
        // Clear with fade
        ctx.fillStyle = "rgba(10, 10, 20, 0.2)";
        ctx.fillRect(0,0,w,h);
        
        time += 0.05;
        const barWidth = w / bars;
        
        for(let i=0; i<bars; i++) {
             // Simulate audio data with noise
             const n = Math.abs(noise2D(i * 0.1, time * 0.5));
             const height = n * (h * 0.6) + 50;
             
             const x = i * barWidth;
             const y = h - height;
             
             const hue = (i / bars) * 360 + time * 50;
             
             ctx.fillStyle = `hsl(${hue}, 70%, 60%)`;
             ctx.fillRect(x, y, barWidth - 2, height);
             
             // Mirror
             ctx.fillStyle = `hsl(${hue}, 70%, 60%, 0.2)`;
             ctx.fillRect(x, h, barWidth - 2, height * 0.5); // Reflection
        }
        
        requestAnimationFrame(animate);
    }

    const resize = () => { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; };
    window.addEventListener("resize", resize);
    animate();
    return () => { window.removeEventListener("resize", resize); };
  }, []);

  return <canvas ref={canvasRef} className="block w-full h-screen bg-[#0a0a14]" />;
}
