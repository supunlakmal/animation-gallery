"use client";
import { useEffect, useRef } from "react";

export default function SortingBars() {
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

    let values: number[] = [];
    const barWidth = 10;
    
    const reset = () => {
        values = [];
        for(let i=0; i < width/barWidth; i++) {
            values.push(Math.random() * height);
        }
    };
    
    reset();

    // Bubble sort visualization (slow enough to watch)
    // Actually bubble sort is too slow for 100+ items per frame.
    // Let's do random swaps if out of order
    
    const animate = () => {
      // Draw
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, width, height);
      
      for(let i=0; i<values.length; i++) {
         const h = values[i];
         const hue = (h / height) * 360;
         ctx.fillStyle = `hsl(${hue}, 70%, 50%)`;
         ctx.fillRect(i * barWidth, height - h, barWidth, h);
      }
      
      // Sort step
      // Perform multiple swaps per frame to speed it up
      for(let k=0; k<50; k++) {
         const i = Math.floor(Math.random() * (values.length - 1));
         if (values[i] > values[i+1]) {
             const temp = values[i];
             values[i] = values[i+1];
             values[i+1] = temp;
         }
      }
      
      // Check if sorted? nah just run forever, maybe reshuffle occasionally
      if(Math.random() > 0.99) {
          // Shuffle a bit
          const idx = Math.floor(Math.random() * values.length);
          values[idx] = Math.random() * height;
      }

      requestAnimationFrame(animate);
    };

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      reset();
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
