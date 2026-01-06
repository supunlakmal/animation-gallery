"use client";

import { useEffect, useRef } from "react";

export default function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);
    const cx = w / 2;
    const cy = h / 2;

    class Star {
      x: number;
      y: number;
      z: number;
      pz: number;

      constructor() {
        this.x = (Math.random() - 0.5) * w * 2;
        this.y = (Math.random() - 0.5) * h * 2;
        this.z = Math.random() * w;
        this.pz = this.z;
      }

      update() {
        this.z -= 15; // Speed
        if (this.z < 1) {
          this.z = w;
          this.x = (Math.random() - 0.5) * w * 2;
          this.y = (Math.random() - 0.5) * h * 2;
          this.pz = this.z;
        }
      }

      draw() {
        if (!ctx) return;
        const sx = (this.x / this.z) * w + cx;
        const sy = (this.y / this.z) * h + cy;
        
        const r = (1 - this.z / w) * 4;

        // Trail
        const px = (this.x / (this.z + 15)) * w + cx;
        const py = (this.y / (this.z + 15)) * h + cy;

        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(sx, sy);
        ctx.strokeStyle = `rgba(255, 255, 255, ${1 - this.z / w})`;
        ctx.lineWidth = r;
        ctx.stroke();
      }
    }

    const stars = Array.from({ length: 800 }, () => new Star());
    let reqId: number;

    const animate = () => {
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, w, h);

      stars.forEach((star) => {
        star.update();
        star.draw();
      });

      reqId = requestAnimationFrame(animate);
    };

    const resize = () => {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
    }
    window.addEventListener("resize", resize);
    animate();

    return () => {
        window.removeEventListener("resize", resize);
        cancelAnimationFrame(reqId);
    }

  }, []);

  return (
    <div className="w-full h-screen bg-black overflow-hidden relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/10 text-9xl font-black italic pointer-events-none">
        WARP
      </div>
      <canvas ref={canvasRef} />
    </div>
  );
}
