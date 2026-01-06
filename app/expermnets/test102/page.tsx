"use client";
import { useEffect, useRef } from "react";

export default function OrbitalTrails() {
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

    const mouse = { x: width / 2, y: height / 2 };

    class Particle {
      x: number;
      y: number;
      lastMouse: { x: number; y: number };
      radius: number;
      color: string;
      radians: number;
      velocity: number;
      distanceFromCenter: number;

      constructor(x: number, y: number, color: string) {
        this.x = x;
        this.y = y;
        this.lastMouse = { x: x, y: y };
        this.radius = Math.random() * 2 + 1;
        this.color = color;
        this.radians = Math.random() * Math.PI * 2;
        this.velocity = 0.05;
        // Random distance from mouse
        this.distanceFromCenter = Math.random() * 100 + 50; 
      }

      update(mouseX: number, mouseY: number) {
        const lastPoint = { x: this.x, y: this.y };
        
        // Move points over time
        this.radians += this.velocity;

        // Drag effect - smooth movement of the orbit center
        this.lastMouse.x += (mouseX - this.lastMouse.x) * 0.05;
        this.lastMouse.y += (mouseY - this.lastMouse.y) * 0.05;

        // Circular motion
        this.x = this.lastMouse.x + Math.cos(this.radians) * this.distanceFromCenter;
        this.y = this.lastMouse.y + Math.sin(this.radians) * this.distanceFromCenter;
        
        this.draw(lastPoint);
      }

      draw(lastPoint: { x: number; y: number }) {
        if (!ctx) return;
        ctx.beginPath();
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.radius;
        ctx.moveTo(lastPoint.x, lastPoint.y);
        ctx.lineTo(this.x, this.y);
        ctx.stroke();
        ctx.closePath();
      }
    }

    let particles: Particle[] = [];
    const colors = ["#FFC857", "#E9724C", "#C5283D", "#255F85", "#4C9F70"];

    const init = () => {
      particles = [];
      for (let i = 0; i < 100; i++) {
        const color = colors[Math.floor(Math.random() * colors.length)];
        particles.push(new Particle(width / 2, height / 2, color));
      }
    };

    const animate = () => {
      requestAnimationFrame(animate);
      // Fade trail
      ctx.fillStyle = "rgba(255, 255, 255, 0.1)"; // Light trail background
      ctx.fillRect(0, 0, width, height);
      
      particles.forEach(p => p.update(mouse.x, mouse.y));
    };

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      init();
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);

    init();
    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full bg-white -z-10" />;
}
