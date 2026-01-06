"use client";

import { useEffect, useRef } from "react";

export default function Voronoi() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);
    resize();
    
    interface Point {
        x: number;
        y: number;
        vx: number;
        vy: number;
        color: string;
    }
    
    const points: Point[] = [];
    for(let i=0; i<15; i++) {
        points.push({
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            color: `hsl(${Math.random() * 360}, 60%, 60%)`
        });
    }

    // Computing Voronoi on CPU per pixel is SLOW. 
    // Optimization: Draw cones in WEBGL?
    // Or just simple approximating by drawing circles? No.
    // Let's do a low-res version then scale up? Or just <15 points.
    
    // Actually, let's do a "Delaunay" triangulation or just simple nearest neighbor for small grid?
    // Let's try pixel manipulation on a small canvas and scale up via CSS.
    // renderWidth = width / 10.
    
    // Better: Connect points with lines (Delaunay) or just the "Cell" centers moving.
    // Let's implement the discrete "Cone" method using radial gradients?
    // Drawing a radial gradient for each point can approximate voronoi if "darken" blend mode used with depth map... too complex for 2d context.
    
    // Fallback: Just simple "Cellular" visual - lines connecting neighbors.
    // Oh wait, I can do checking per 4x4 pixel block.
    
    const draw = () => {
        // Move points
        points.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            if(p.x < 0 || p.x > canvas.width) p.vx *= -1;
            if(p.y < 0 || p.y > canvas.height) p.vy *= -1;
        });

        // Slow Voronoi Render (Low res)
        const scale = 8;
        const w = Math.ceil(canvas.width / scale);
        const h = Math.ceil(canvas.height / scale);
        
        for (let x = 0; x < w; x++) {
            for (let y = 0; y < h; y++) {
                 const rx = x * scale;
                 const ry = y * scale;
                 
                 let minDist = 999999;
                 let nearestI = 0;
                 
                 for(let i=0; i<points.length; i++) {
                     const dx = rx - points[i].x;
                     const dy = ry - points[i].y;
                     const dist = dx*dx + dy*dy; // sq dist
                     if (dist < minDist) {
                         minDist = dist;
                         nearestI = i;
                     }
                 }
                 
                 ctx.fillStyle = points[nearestI].color;
                 ctx.fillRect(rx, ry, scale, scale);
            }
        }
        
        // Draw centers
        points.forEach(p => {
            ctx.fillStyle = "#fff";
            ctx.beginPath();
            ctx.arc(p.x, p.y, 2, 0, Math.PI*2);
            ctx.fill();
        });

        animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
        window.removeEventListener("resize", resize);
        cancelAnimationFrame(animationId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 w-full h-full bg-black" />;
}
