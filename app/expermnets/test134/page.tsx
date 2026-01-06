"use client";
import { useEffect, useRef } from "react";

export default function MosaicReveal() {
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

    const size = 40;
    const cols = Math.ceil(width / size);
    const rows = Math.ceil(height / size);
    
    const tiles: {r: number, c: number, active: boolean, delay: number}[] = [];
    
    for(let i=0; i<cols; i++) {
        for(let j=0; j<rows; j++) {
            tiles.push({
                r: j,
                c: i,
                active: false,
                delay: Math.random() * 100
            });
        }
    }
    
    let time = 0;

    const animate = () => {
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, width, height);

      time++;
      
      tiles.forEach(tile => {
          if (time > tile.delay) {
               const x = tile.c * size;
               const y = tile.r * size;
               
               // Flip effect based on time
               const age = time - tile.delay;
               const scale = Math.min(1, age / 20); // Scale up from 0 to 1
               
               if (age < 50) {
                   ctx.fillStyle = `hsl(${tile.c * 5 + tile.r * 5}, 70%, 50%)`;
                   
                   ctx.save();
                   ctx.translate(x + size/2, y + size/2);
                   ctx.scale(scale, 1); // Flip horizontal
                   ctx.fillRect(-size/2 + 1, -size/2 + 1, size - 2, size - 2);
                   ctx.restore();
               } else {
                   // Stay visible
                   ctx.fillStyle = `hsl(${tile.c * 5 + tile.r * 5}, 70%, 50%)`;
                   ctx.fillRect(x + 1, y + 1, size - 2, size - 2);
               }
          }
      });
      
      if (time > 200) {
          // Reset
          time = 0;
          tiles.forEach(t => t.delay = Math.random() * 100);
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
    const id = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(id);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full bg-black -z-10" />;
}
