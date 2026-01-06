"use client";
import React, { useEffect, useRef } from "react";

export default function DataGlitch() {
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

    // Create a base image/pattern
    const createPattern = () => {
        const grd = ctx.createLinearGradient(0, 0, width, height);
        grd.addColorStop(0, "#ff0000");
        grd.addColorStop(0.5, "#00ff00");
        grd.addColorStop(1, "#0000ff");
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, width, height);
        
        ctx.fillStyle = "#fff";
        ctx.font = "bold 100px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("GLITCH", width/2, height/2);
    };

    const animate = () => {
      createPattern();
      
      const numSlices = 20;
      for (let i = 0; i < numSlices; i++) {
        const h = Math.random() * 50 + 10;
        const y = Math.random() * height;
        const offset = (Math.random() - 0.5) * 100;
        
        // Get slice
        const slice = ctx.getImageData(0, y, width, h);
        ctx.putImageData(slice, offset, y);
      }
      
      // Color channel shift (RGB split) - simulating by drawing colored rects with blend mode
      ctx.globalCompositeOperation = "screen";
      ctx.fillStyle = "rgba(0, 255, 255, 0.1)";
      ctx.fillRect(Math.random()*10, 0, width, height);
      ctx.fillStyle = "rgba(255, 0, 255, 0.1)";
      ctx.fillRect(-Math.random()*10, 0, width, height);
      ctx.globalCompositeOperation = "source-over";

      requestAnimationFrame(animate);
    };

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
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
