"use client";

import { useEffect, useRef } from "react";

export default function HexGrid() {
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

    const drawHex = (x: number, y: number, r: number) => {
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 3) * i;
            ctx.lineTo(x + r * Math.cos(angle), y + r * Math.sin(angle));
        }
        ctx.closePath();
    };

    const draw = () => {
        ctx.fillStyle = "#111";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const r = 30; // Hex radius
        const h = r * Math.sqrt(3); // Height of hex
        const w = 2 * r; // Width
        
        const xStep = w * 0.75;
        const yStep = h;

        const cols = Math.ceil(canvas.width / xStep) + 1;
        const rows = Math.ceil(canvas.height / yStep) + 1;

        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
                const xOffset = (i % 2 === 0) ? 0 : h / 2;
                const x = i * xStep;
                const y = j * yStep + xOffset - h;

                // Color based on waves
                const d = Math.sqrt(Math.pow(x - canvas.width/2, 2) + Math.pow(y - canvas.height/2, 2));
                const wave = Math.sin(d * 0.01 - time) + Math.sin(x * 0.02 + time);
                
                const hue = 220 + wave * 40;
                const lightness = 20 + (wave + 2) * 10;

                ctx.strokeStyle = `hsl(${hue}, 80%, ${lightness}%)`;
                ctx.lineWidth = 2;
                
                // Only fill if high wave
                if (wave > 1) {
                     ctx.fillStyle = `hsla(${hue}, 80%, ${lightness}%, 0.5)`;
                     drawHex(x, y, r - 2);
                     ctx.fill();
                } else {
                    drawHex(x, y, r - 2);
                    ctx.stroke();
                }
            }
        }

        time += 0.05;
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
