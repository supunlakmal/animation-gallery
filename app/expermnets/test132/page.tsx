"use client";
import { useEffect, useRef } from "react";

export default function BubbleBath() {
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

    class Bubble {
        x: number;
        y: number;
        radius: number;
        vx: number;
        vy: number;
        
        constructor() {
            this.x = Math.random() * width;
            this.y = height + Math.random() * 100;
            this.radius = Math.random() * 10 + 5;
            this.vx = (Math.random() - 0.5) * 2;
            this.vy = -Math.random() * 2 - 1;
        }
        
        update() {
            this.x += this.vx;
            this.y += this.vy;
            
            // Wiggle
            this.x += Math.sin(this.y * 0.05) * 0.5;
            
            if (this.y < -50) {
                this.y = height + 50;
                this.x = Math.random() * width;
            }
        }
        
        draw() {
            if (!ctx) return;
            ctx.beginPath();
            ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
            ctx.stroke();
            
            // Shine
            ctx.beginPath();
            ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
            ctx.arc(this.x - this.radius*0.3, this.y - this.radius*0.3, this.radius/3, 0, Math.PI*2);
            ctx.fill();
        }
    }
    
    const bubbles: Bubble[] = [];
    for(let i=0; i<100; i++) bubbles.push(new Bubble());

    const animate = () => {
      ctx.fillStyle = "#4a90e2";
      ctx.fillRect(0, 0, width, height);

      bubbles.forEach(b => {
          b.update();
          b.draw();
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
    const id = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(id);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full bg-[#4a90e2] -z-10" />;
}
