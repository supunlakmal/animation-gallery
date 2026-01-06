"use client";
import { useEffect, useRef } from "react";

export default function AsciiCube() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    let A = 0, B = 0;
    
    // Donut code adapted for Cube? 
    // Let's do a simple rotating cube wireframe but draw chars at vertices/edges?
    // No, let's do proper ASCII rendering of a 3D function.
    // Simpler: Just text field where chars change based on sine waves.
    
    const animate = () => {
       ctx.fillStyle = "black";
       ctx.fillRect(0, 0, width, height);
       ctx.fillStyle = "#0f0";
       ctx.font = "12px monospace";
       
       const cols = Math.floor(width / 8);
       const rows = Math.floor(height / 14);
       
       for(let j=0; j<rows; j++) {
           let line = "";
           for(let i=0; i<cols; i++) {
               // Perlin-ish
               const v = Math.sin(i * 0.1 + A) * Math.cos(j * 0.1 + B);
               const chars = " .:-=+*#%@";
               const idx = Math.floor((v + 1) / 2 * (chars.length - 1));
               line += chars[idx];
           }
           ctx.fillText(line, 0, j * 14);
       }
       
       A += 0.05;
       B += 0.03;
       requestAnimationFrame(animate);
    };

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener("resize", handleResize);
    const id = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(id);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full bg-black -z-10" />;
}
