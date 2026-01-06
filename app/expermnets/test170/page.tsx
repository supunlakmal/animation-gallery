"use client";

import { useEffect, useRef } from "react";

export default function PixelSort() {
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
      reset();
    };
    window.addEventListener("resize", resize);
    
    let imgData: ImageData;
    let sortedX = 0;

    const reset = () => {
        // Init random noise
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        for(let y=0; y<canvas.height; y+=4) { // Chunky pixels
             for(let x=0; x<canvas.width; x+=4) {
                 const hue = Math.random() * 360;
                 ctx.fillStyle = `hsl(${hue}, 50%, 50%)`;
                 ctx.fillRect(x, y, 4, 4);
             }
        }
        
        // Actually sorting real pixels is heavy on CPU for JS Canvas every frame for full screen.
        // Let's Simulate it.
        // Or process column by column.
        imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        sortedX = 0;
    };
    
    reset();

    const draw = () => {
        // Loop a few columns per frame
        // This is tricky to do efficiently with raw imageData without freezing
        // Let's do a visual fake using drawn rectangles being "sorted"
        
        // Actually, let's try sorting small chunks.
        // Vertical sort?
        
        if (sortedX < canvas.width) {
             // Pick a column
             // Get pixels... that's 1080 reads. 
             // Canvas API is fast enough for localized, but maybe not full redraw.
             // Visual trick:
             // Draw lines that are "sorted"
             
             for (let i=0; i<10; i++) {
                 if(sortedX >= canvas.width) break;
                 
                 // Generate a sorted gradient strip
                 const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
                 grad.addColorStop(0, `hsl(${sortedX % 360}, 50%, 20%)`);
                 grad.addColorStop(1, `hsl(${(sortedX + 90) % 360}, 80%, 80%)`);
                 
                 ctx.fillStyle = grad;
                 ctx.fillRect(sortedX, 0, 4, canvas.height); // "Sorted"
                 
                 // Add some "unsorted" noise at the bottom or top that diminishes
                 const noiseH = Math.random() * (canvas.height - (sortedX / canvas.width) * canvas.height);
                 ctx.fillStyle = `hsl(${Math.random()*360}, 50%, 50%)`;
                 ctx.fillRect(sortedX, canvas.height - noiseH, 4, noiseH);
                 
                 sortedX+=4;
             }
        } else {
            // Reset after delay?
            if(Math.random() < 0.01) reset();
        }

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
