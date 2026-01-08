"use client";
import React, { useEffect, useRef } from "react";

export default function WarpSpeed() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const context = ctx;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    class Star {
      x: number;
      y: number;
      z: number;
      pz: number;

      constructor() {
        this.x = (Math.random() - 0.5) * width;
        this.y = (Math.random() - 0.5) * height;
        this.z = Math.random() * width;
        this.pz = this.z;
      }

      update() {
        this.z -= 20; // Speed
        if (this.z < 1) {
           this.z = width;
           this.x = (Math.random() - 0.5) * width;
           this.y = (Math.random() - 0.5) * height;
           this.pz = this.z;
        }
      }

      draw() {
        const sx = (this.x / this.z) * width + width/2;
        const sy = (this.y / this.z) * height + height/2;
        
        const px = (this.x / this.pz) * width + width/2;
        const py = (this.y / this.pz) * height + height/2;
        
        this.pz = this.z;

        if (sx < 0 || sx > width || sy < 0 || sy > height) return;

        const size = (1 - this.z / width) * 4;
        
        context.beginPath();
        context.strokeStyle = "white";
        context.lineWidth = size;
        context.moveTo(px, py);
        context.lineTo(sx, sy);
        context.stroke();
      }
    }

    const stars = Array.from({ length: 500 }, () => new Star());

    const animate = () => {
      context.fillStyle = "black";
      context.fillRect(0, 0, width, height);

      stars.forEach(s => {
          s.update();
          s.draw();
      });

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
