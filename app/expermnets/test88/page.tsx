"use client";
import React, { useEffect, useRef } from "react";

export default function LaserBeams() {
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

    class Laser {
      x: number;
      y: number;
      angle: number;
      speed: number;
      color: string;
      length: number;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.angle = Math.random() * Math.PI * 2;
        this.speed = Math.random() * 10 + 5;
        this.color = `hsl(${Math.random() * 60 + 300}, 100%, 50%)`; // Pinks/Purples
        this.length = Math.random() * 100 + 50;
      }

      update() {
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;

        if (this.x < -this.length || this.x > width + this.length || 
            this.y < -this.length || this.y > height + this.length) {
              this.reset();
        }
      }

      reset() {
        if (Math.random() < 0.5) {
          this.x = Math.random() < 0.5 ? -this.length : width + this.length;
          this.y = Math.random() * height;
        } else {
          this.x = Math.random() * width;
          this.y = Math.random() < 0.5 ? -this.length : height + this.length;
        }
        // Aim somewhat towards center
        const targetX = width/2 + (Math.random()-0.5) * width/2;
        const targetY = height/2 + (Math.random()-0.5) * height/2;
        this.angle = Math.atan2(targetY - this.y, targetX - this.x);
        this.speed = Math.random() * 15 + 10;
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 3;
        ctx.shadowBlur = 15;
        ctx.shadowColor = this.color;
        
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x - Math.cos(this.angle) * this.length, this.y - Math.sin(this.angle) * this.length);
        ctx.stroke();
        ctx.shadowBlur = 0;
      }
    }

    const lasers = Array.from({ length: 30 }, () => new Laser());

    const animate = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
      ctx.fillRect(0, 0, width, height);

      lasers.forEach(l => {
        l.update();
        l.draw(ctx);
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
