"use client";
import React, { useEffect, useRef } from "react";

export default function TerminalLog() {
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

    const lines: { text: string; x: number; y: number; alpha: number }[] = [];
    const keywords = ["function", "const", "let", "return", "if", "else", "import", "export", "class", "interface"];
    const symbols = ["{", "}", "(", ")", ";", "=", "=>", "...", "[", "]"];

    const generateLine = () => {
        let text = "";
        const len = Math.random() * 5 + 2;
        for (let i = 0; i < len; i++) {
            if (Math.random() > 0.5) text += keywords[Math.floor(Math.random() * keywords.length)] + " ";
            else text += "var" + Math.floor(Math.random()*100) + " ";
            
            if (Math.random() > 0.7) text += symbols[Math.floor(Math.random() * symbols.length)] + " ";
        }
        return text;
    };

    const animate = () => {
      ctx.fillStyle = "#1e1e1e";
      ctx.fillRect(0, 0, width, height);

      // Add new line randomly
      if (Math.random() > 0.8) {
          lines.push({
              text: generateLine(),
              x: Math.random() * (width - 200) + 50,
              y: height + 20,
              alpha: 1
          });
      }

      ctx.font = "14px Consolas, monospace";
      
      for (let i = lines.length - 1; i >= 0; i--) {
          const l = lines[i];
          l.y -= 2; // Scroll up
          l.alpha -= 0.005;
          
          if (l.alpha <= 0) {
              lines.splice(i, 1);
              continue;
          }

          ctx.fillStyle = `rgba(0, 255, 100, ${l.alpha})`;
          ctx.fillText(l.text, l.x, l.y);
      }

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
  }, []);

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full" />;
}
