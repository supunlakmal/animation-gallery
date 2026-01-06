"use client";

import { useEffect, useRef } from "react";

export default function StarfieldWarp() {
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
    };
    window.addEventListener("resize", resize);
    resize();

    interface Star {
        x: number;
        y: number;
        z: number;
        pz: number; // Previous z for streak effect
    }

    const stars: Star[] = [];
    const count = 1000;

    for (let i = 0; i < count; i++) {
        stars.push({
            x: Math.random() * 2000 - 1000,
            y: Math.random() * 2000 - 1000,
            z: Math.random() * 1000,
            pz: 0
        });
        stars[i].pz = stars[i].z;
    }

    const draw = () => {
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const cx = canvas.width / 2;
        const cy = canvas.height / 2;
        const speed = 25;

        stars.forEach(star => {
            star.pz = star.z;
            star.z -= speed;

            if (star.z < 1) {
                star.z = 1000;
                star.pz = 1000;
                star.x = Math.random() * 2000 - 1000;
                star.y = Math.random() * 2000 - 1000;
            }

            const sx = (star.x / star.z) * 500 + cx;
            const sy = (star.y / star.z) * 500 + cy;

            const px = (star.x / star.pz) * 500 + cx;
            const py = (star.y / star.pz) * 500 + cy;

            // Opacity based on Z
            const opacity = 1 - star.z / 1000;
            ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
            ctx.lineWidth = 1 + opacity * 2;

            ctx.beginPath();
            ctx.moveTo(px, py);
            ctx.lineTo(sx, sy);
            ctx.stroke();
        });

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
