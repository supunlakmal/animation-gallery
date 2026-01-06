"use client";

import { useEffect, useRef } from "react";

export default function FractalTree() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let angleOffset = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);
    resize();

    const drawTree = (startX: number, startY: number, len: number, angle: number, branchWidth: number) => {
        ctx.beginPath();
        ctx.save();
        ctx.strokeStyle = `hsl(${len * 2}, 70%, 50%)`;
        ctx.lineWidth = branchWidth;
        ctx.translate(startX, startY);
        ctx.rotate(angle * Math.PI/180);
        ctx.moveTo(0, 0);
        ctx.lineTo(0, -len);
        ctx.stroke();

        if (len < 10) {
            ctx.restore();
            return;
        }

        drawTree(0, -len, len * 0.75, angleOffset + 15, branchWidth * 0.7);
        drawTree(0, -len, len * 0.75, -angleOffset - 15, branchWidth * 0.7);
        
        ctx.restore();
    };

    let swayDir = 1;

    const draw = () => {
        ctx.fillStyle = "#111";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        angleOffset += 0.2 * swayDir;
        if (Math.abs(angleOffset) > 20) swayDir *= -1;

        drawTree(canvas.width / 2, canvas.height, 150, 0, 10);
        
        // Second tree?
        // drawTree(canvas.width * 0.2, canvas.height, 100, 0, 5);
        // drawTree(canvas.width * 0.8, canvas.height, 100, 0, 5);

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
