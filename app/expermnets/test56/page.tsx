"use client";
import { useEffect, useRef } from "react";

export default function GlitchReality() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // We will draw some text / shapes and then "glitch" sections
    // by copying parts of the canvas to other parts.

    let frame = 0;

    const animate = () => {
      // Clear with slight fade for trails? No, glitches are usually sharp.
      // But we need to redraw base content.
      
      // Base Content
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = "white";
      ctx.font = "bold 100px Courier New";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("SYSTEM FAILURE", width/2, height/2);
      
      ctx.strokeStyle = "red";
      ctx.lineWidth = 5;
      ctx.strokeRect(width/2 - 400, height/2 - 100, 800, 200);

      // --- GLITCH EFFECT ---
      
      const numGlitches = Math.floor(Math.random() * 10) + 5;
      
      for(let i=0; i<numGlitches; i++) {
          const glitchWidth = Math.random() * width;
          const glitchHeight = Math.random() * 50 + 5;
          const x = Math.random() * width;
          const y = Math.random() * height;
          
          const spliceWidth = Math.random() * width;
          const spliceX = Math.random() * width;
          
          // Copy a slice from somewhere else
          // Or just shift color channels
          
          // Simple slice displacement:
          // Get image data
          const spliceY = Math.random() * height;
          // Usually glitches are horizontal slices
          // We can simulate this by `drawImage` from self to self with offset
          
          const sx = 0;
          const sy = Math.random() * height;
          const sw = width;
          const sh = Math.random() * 30 + 5;
          const dx = (Math.random() - 0.5) * 50; // shift x
          const dy = sy;
          const dw = width;
          const dh = sh;
          
          ctx.drawImage(canvas, sx, sy, sw, sh, dx, dy, dw, dh);
          
          // Color Overlay (RGB Split)
          ctx.fillStyle = `rgba(${Math.random()>0.5?255:0}, ${Math.random()>0.5?255:0}, ${Math.random()>0.5?255:0}, 0.2)`;
          ctx.fillRect(0, sy, width, sh);
      }
      
      // Random white noise lines
      if (Math.random() > 0.8) {
          ctx.beginPath();
          ctx.moveTo(0, Math.random() * height);
          ctx.lineTo(width, Math.random() * height);
          ctx.strokeStyle = "white";
          ctx.lineWidth = Math.random() * 2;
          ctx.stroke();
      }


      frame++;
      // Limit framerate for more "jerky" glitch feel
      // setTimeout(() => requestAnimationFrame(animate), 50); 
      // Actually native 60fps glitch is fine
      requestAnimationFrame(animate);
    };
    
    animate();

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);

  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 bg-black" />;
}
