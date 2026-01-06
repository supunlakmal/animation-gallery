"use client";
import React, { useEffect, useRef } from "react";

export default function Kaleidoscope() {
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
    
    // Create an offscreen buffer for the source image
    const bufferCanvas = document.createElement("canvas");
    bufferCanvas.width = width;
    bufferCanvas.height = height;
    const bufferCtx = bufferCanvas.getContext("2d");

    let time = 0;

    const animate = () => {
      if (!bufferCtx) return;

      // Draw flowing colors to buffer
      bufferCtx.fillStyle = `hsl(${time * 50}, 50%, 10%)`; // Fade
      bufferCtx.fillRect(0, 0, width, height);
      
      for (let i = 0; i < 5; i++) {
        bufferCtx.beginPath();
        bufferCtx.fillStyle = `hsl(${(time * 100 + i * 50)%360}, 100%, 50%)`;
        bufferCtx.arc(
            width/2 + Math.cos(time + i) * 200, 
            height/2 + Math.sin(time * 1.5 + i) * 200, 
            50 + Math.sin(time)*20, 
            0, Math.PI * 2
        );
        bufferCtx.fill();
      }

      // Draw Kaleidoscope
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, width, height);
      
      const cx = width / 2;
      const cy = height / 2;
      const slices = 8;
      const angleStep = (Math.PI * 2) / slices;

      for (let i = 0; i < slices; i++) {
          ctx.save();
          ctx.translate(cx, cy);
          ctx.rotate(i * angleStep + time * 0.2);
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.arc(0, 0, Math.max(width, height), -angleStep/2, angleStep/2);
          ctx.clip();
          
          // Mirror every other slice
          if (i % 2 === 0) {
            ctx.scale(1, -1);
          }
          
          ctx.drawImage(bufferCanvas, -cx, -cy);
          ctx.restore();
      }

      time += 0.02;
      requestAnimationFrame(animate);
    };

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      bufferCanvas.width = width;
      bufferCanvas.height = height;
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
