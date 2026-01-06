"use client";

import { useEffect, useRef } from "react";

interface Point {
  x: number;
  y: number;
  originX: number;
  originY: number;
  vx: number;
  vy: number;
}

export default function ElasticNetwork() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const pointsRef = useRef<Point[]>([]);

  const config = {
    spacing: 40,
    mouseDist: 150,
    stiffness: 0.05,
    damping: 0.9,
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let cols = Math.ceil(width / config.spacing) + 1;
    let rows = Math.ceil(height / config.spacing) + 1;

    const mouse = { x: -1000, y: -1000 };

    const initPoints = () => {
      pointsRef.current = [];
      cols = Math.ceil(width / config.spacing) + 1;
      rows = Math.ceil(height / config.spacing) + 1;
      
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            const x = i * config.spacing;
            const y = j * config.spacing;
            pointsRef.current.push({
                x, y,
                originX: x,
                originY: y,
                vx: 0,
                vy: 0
            });
        }
      }
    };

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initPoints();
    };

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    initPoints();

    const animate = () => {
      // Clear with slight trail ?? No, transparent background clear for clean lines
      ctx.fillStyle = "#111";
      ctx.fillRect(0, 0, width, height);
      
      ctx.strokeStyle = "rgba(100, 200, 255, 0.2)";
      ctx.lineWidth = 1;

      pointsRef.current.forEach((p, idx) => {
         // Spring force to origin
         const ex = p.originX - p.x;
         const ey = p.originY - p.y;
         
         const ax = ex * config.stiffness;
         const ay = ey * config.stiffness;
         
         p.vx += ax;
         p.vy += ay;
         
         // Mouse repulsion
         const dx = p.x - mouse.x;
         const dy = p.y - mouse.y;
         const dist = Math.sqrt(dx * dx + dy * dy);
         
         if (dist < config.mouseDist) {
             const angle = Math.atan2(dy, dx);
             const force = (config.mouseDist - dist) / config.mouseDist;
             const push = force * 5;
             
             p.vx += Math.cos(angle) * push;
             p.vy += Math.sin(angle) * push;
         }
         
         p.vx *= config.damping;
         p.vy *= config.damping;
         
         p.x += p.vx;
         p.y += p.vy;
         
         // Draw connections
         // Right neighbor
         if ((idx + 1) % rows !== 0 && idx + rows < pointsRef.current.length) {
            // This logic for neighbor is tricky with flat array.
            // Let's just draw dots for now? No, need lines.
            // Simplified: Draw line to next point in list if it's in same col
         }
      });
      
      // Draw lines safely
      for (let i = 0; i < cols; i++) {
          for (let j = 0; j < rows; j++) {
              const idx = i * rows + j;
              const p = pointsRef.current[idx];
              if (!p) continue;

              // Down neighbor
              if (j < rows - 1) {
                  const p2 = pointsRef.current[idx + 1];
                  if (p2) {
                      ctx.beginPath();
                      ctx.moveTo(p.x, p.y);
                      ctx.lineTo(p2.x, p2.y);
                      ctx.stroke();
                  }
              }
              
              // Right neighbor
              if (i < cols - 1) {
                  const pRight = pointsRef.current[idx + rows];
                  if (pRight) {
                      ctx.beginPath();
                      ctx.moveTo(p.x, p.y);
                      ctx.lineTo(pRight.x, pRight.y);
                      ctx.stroke();
                  }
              }
              
              // Draw point
              ctx.fillStyle = "rgba(255,255,255,0.5)";
              ctx.fillRect(p.x - 1, p.y - 1, 2, 2);
          }
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full bg-[#111]" />;
}
