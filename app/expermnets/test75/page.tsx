"use client";
import React, { useEffect, useRef } from "react";

export default function GlitchArt() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);

    const drawGlitch = () => {
      // Base Image (Text)
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, width, height);
      
      ctx.font = "bold 100px monospace";
      ctx.fillStyle = "#fff";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("SYSTEM FAILURE", width / 2, height / 2);

      // Glitch displacement
      const sliceHeight = Math.random() * 50 + 5;
      const sliceY = Math.random() * height;
      const displacement = Math.random() * 20 - 10;
      
      const imageData = ctx.getImageData(0, sliceY, width, sliceHeight);
      ctx.putImageData(imageData, displacement, sliceY);

      // Color Channel Shift (red/blue offset)
      if (Math.random() > 0.8) {
          const shift = Math.random() * 10;
          ctx.globalCompositeOperation = "screen";
          ctx.fillStyle = "red";
          ctx.fillText("SYSTEM FAILURE", width / 2 + shift, height / 2);
          ctx.fillStyle = "blue";
          ctx.fillText("SYSTEM FAILURE", width / 2 - shift, height / 2);
          ctx.globalCompositeOperation = "source-over";
      }

      // Scanlines
      for (let i = 0; i < height; i += 4) {
          ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
          ctx.fillRect(0, i, width, 2);
      }
    };

    const animate = () => {
      if (Math.random() > 0.1) {
          drawGlitch();
      }
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full -z-10"
    />
  );
}
