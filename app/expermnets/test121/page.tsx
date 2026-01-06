"use client";
import { useEffect, useRef } from "react";

export default function GlitchPattern() {
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

    const drawPattern = () => {
        // Draw stripes
        for(let i=0; i<height; i+=5) {
            ctx.fillStyle = i % 10 === 0 ? "black" : "#222";
            ctx.fillRect(0, i, width, 5);
        }
        
        // Draw some shapes
        ctx.fillStyle = "cyan";
        ctx.fillRect(width/2 - 100, height/2 - 100, 200, 200);
        
        ctx.fillStyle = "magenta";
        ctx.font = "bold 100px sans-serif";
        ctx.fillText("GLITCH", width/2 - 150, height/2);
    };

    const animate = () => {
        // Redraw base
        drawPattern();
        
        // Glitch slices
        const slices = 10;
        for(let i=0; i<slices; i++) {
            const h = Math.random() * 50;
            const y = Math.random() * height;
            const offset = (Math.random() - 0.5) * 50;
            
            // Copy part of canvas and shift it
            const imgData = ctx.getImageData(0, y, width, h);
            ctx.putImageData(imgData, offset, y);
        }
        
        // Color channel split occasionally
        if(Math.random() > 0.5) {
             const h = Math.random() * height;
             const y = Math.random() * (height - h);
             
             // This is expensive to do properly with getimagedata for full screen
             // Just draw overlays
             ctx.fillStyle = `rgba(${Math.random()*255}, 0, ${Math.random()*255}, 0.2)`;
             ctx.fillRect(0, y, width, h);
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
