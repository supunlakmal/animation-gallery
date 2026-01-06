"use client";
import React, { useEffect, useRef } from "react";

export default function LSystem() {
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

    // L-System Rules
    // Axiom: X
    // F -> FF
    // X -> F-[[X]+X]+F[+FX]-X
    const axiom = "X";
    const rules: Record<string, string> = {
        "F": "FF",
        "X": "F-[[X]+X]+F[+FX]-X"
    };

    let sentence = axiom;
    const len = 4;
    const angle = 25;

    const generate = () => {
        let nextSentence = "";
        for (let i = 0; i < sentence.length; i++) {
            const current = sentence.charAt(i);
            nextSentence += rules[current] || current;
        }
        sentence = nextSentence;
    };

    // Pre-generate a few generations
    for (let i = 0; i < 5; i++) {
        generate();
    }

    let drawIndex = 0;
    
    // Turtle state
    const stack: {x: number, y: number, a: number}[] = [];
    let x = width / 2;
    let y = height;
    let dir = -90; // Up

    const animate = () => {
      // Draw a few steps per frame
      ctx.lineWidth = 1;
      ctx.strokeStyle = "rgba(100, 255, 100, 0.5)";

      for (let k = 0; k < 20; k++) {
          if (drawIndex >= sentence.length) return; // Done

          const char = sentence.charAt(drawIndex);

          if (char === "F") {
              const rad = dir * Math.PI / 180;
              const nx = x + Math.cos(rad) * len;
              const ny = y + Math.sin(rad) * len;
              
              ctx.beginPath();
              ctx.moveTo(x, y);
              ctx.lineTo(nx, ny);
              ctx.stroke();
              
              x = nx;
              y = ny;
          } else if (char === "+") {
              dir += angle;
          } else if (char === "-") {
              dir -= angle;
          } else if (char === "[") {
              stack.push({ x, y, a: dir });
          } else if (char === "]") {
              const state = stack.pop();
              if (state) {
                  x = state.x;
                  y = state.y;
                  dir = state.a;
              }
          }

          drawIndex++;
      }

      requestAnimationFrame(animate);
    };

    // Initial clear
    ctx.fillStyle = "#112";
    ctx.fillRect(0, 0, width, height);

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      // Reset
      ctx.fillRect(0, 0, width, height);
      x = width / 2;
      y = height;
      dir = -90;
      drawIndex = 0;
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
