"use client";

import { useEffect, useRef } from "react";

export default function ASCIIShapes() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);
    resize();

    const charSize = 12;
    const chars = " .:-=+*#%@";

    const draw = () => {
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.font = `${charSize}px monospace`;
        ctx.textBaseline = "middle";
        ctx.textAlign = "center";

        const cols = Math.ceil(canvas.width / charSize);
        const rows = Math.ceil(canvas.height / charSize);

        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                const cx = x * charSize + charSize / 2;
                const cy = y * charSize + charSize / 2;

                // Create a pattern value from -1 to 1 based on position and time
                // Rotating square shape?
                const dx = (cx - canvas.width/2) / 200;
                const dy = (cy - canvas.height/2) / 200;
                
                // Rotate coords
                const rotX = dx * Math.cos(time) - dy * Math.sin(time);
                const rotY = dx * Math.sin(time) + dy * Math.cos(time);

                const dist = Math.max(Math.abs(rotX), Math.abs(rotY)); // Square distance field
                
                // Ripples
                const val = Math.sin(dist * 10 - time * 2);

                // Map -1..1 to 0..1
                const brightness = (val + 1) / 2;
                
                const charIndex = Math.floor(brightness * (chars.length - 1));
                const char = chars[charIndex];

                ctx.fillStyle = `hsl(120, 100%, ${brightness * 50}%)`;
                ctx.fillText(char, cx, cy);
            }
        }

        time += 0.02;
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
