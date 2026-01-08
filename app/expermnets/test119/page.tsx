"use client";
import { useEffect, useRef } from "react";

export default function ReactionDiffusion() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = window.innerWidth;
    const height = window.innerHeight;
    // Scale down for performance
    const scale = 4;
    const w = Math.floor(width / scale);
    const h = Math.floor(height / scale);
    canvas.width = w;
    canvas.height = h;
    
    // Gray Scott parameters
    const dA = 1.0;
    const dB = 0.5;
    const feed = 0.055;
    const k = 0.062;

    // Grids
    let grid: {a: number, b: number}[][] = [];
    let next: {a: number, b: number}[][] = [];

    const init = () => {
        grid = [];
        next = [];
        for(let x=0; x<w; x++) {
            grid[x] = [];
            next[x] = [];
            for(let y=0; y<h; y++) {
                grid[x][y] = { a: 1, b: 0 };
                next[x][y] = { a: 1, b: 0 };
            }
        }
        
        // Seed
        for(let i=0; i<10; i++) {
             const cx = Math.floor(Math.random() * w);
             const cy = Math.floor(Math.random() * h);
             for(let x=cx-5; x<cx+5; x++) {
                 for(let y=cy-5; y<cy+5; y++) {
                     if(x>=0 && x<w && y>=0 && y<h) {
                         grid[x][y].b = 1;
                     }
                 }
             }
        }
    };
    
    init();

    const animate = () => {
      // Logic
      for(let x=1; x<w-1; x++) {
          for(let y=1; y<h-1; y++) {
              const a = grid[x][y].a;
              const b = grid[x][y].b;
              
              // Laplacian
              let lapA = 0;
              lapA += grid[x][y].a * -1;
              lapA += grid[x-1][y].a * 0.2;
              lapA += grid[x+1][y].a * 0.2;
              lapA += grid[x][y-1].a * 0.2;
              lapA += grid[x][y+1].a * 0.2;
              lapA += grid[x-1][y-1].a * 0.05;
              lapA += grid[x+1][y-1].a * 0.05;
              lapA += grid[x-1][y+1].a * 0.05;
              lapA += grid[x+1][y+1].a * 0.05;

              let lapB = 0;
              lapB += grid[x][y].b * -1;
              lapB += grid[x-1][y].b * 0.2;
              lapB += grid[x+1][y].b * 0.2;
              lapB += grid[x][y-1].b * 0.2;
              lapB += grid[x][y+1].b * 0.2;
              lapB += grid[x-1][y-1].b * 0.05;
              lapB += grid[x+1][y-1].b * 0.05;
              lapB += grid[x-1][y+1].b * 0.05;
              lapB += grid[x+1][y+1].b * 0.05;

              next[x][y].a = a + (dA * lapA - a * b * b + feed * (1 - a));
              next[x][y].b = b + (dB * lapB + a * b * b - (k + feed) * b);
              
              // Clamp
              next[x][y].a = Math.max(0, Math.min(1, next[x][y].a));
              next[x][y].b = Math.max(0, Math.min(1, next[x][y].b));
          }
      }
      
      // Swap
      const temp = grid;
      grid = next;
      next = temp;

      // Draw
      const imgData = ctx.createImageData(w, h);
      for(let x=0; x<w; x++) {
          for(let y=0; y<h; y++) {
              const i = (x + y * w) * 4;
              const val = Math.floor((grid[x][y].a - grid[x][y].b) * 255);
              const c = Math.max(0, Math.min(255, val));
              imgData.data[i] = c;
              imgData.data[i+1] = c; // Grayscale or color map
              imgData.data[i+2] = c;
              imgData.data[i+3] = 255;
          }
      }
      ctx.putImageData(imgData, 0, 0);

      requestAnimationFrame(animate);
    };

    const id = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(id);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full -z-10" style={{ width: '100%', height: '100%', imageRendering: 'pixelated'}} />;
}
