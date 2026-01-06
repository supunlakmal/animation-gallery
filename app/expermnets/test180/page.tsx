"use client";

import { useEffect, useRef } from "react";

export default function ParticleVortex() {
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
    
    interface Particle {
        x: number;
        y: number;
        angle: number;
        radius: number;
        speed: number;
    }
    
    const particles: Particle[] = [];
    const count = 1000;
    
    for(let i=0; i<count; i++) {
        particles.push({
            x: 0, 
            y: 0,
            angle: Math.random() * Math.PI * 2,
            radius: Math.random() * 500 + 50,
            speed: Math.random() * 0.02 + 0.005
        });
    }

    const draw = () => {
        // Trail
        ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        const cx = canvas.width / 2;
        const cy = canvas.height / 2;

        ctx.fillStyle = "#0ff";

        particles.forEach(p => {
            p.angle += p.speed;
            p.radius -= 0.5;
            
            if (p.radius < 0) {
                p.radius = Math.random() * 500 + 200;
                p.angle = Math.random() * Math.PI * 2;
            }
            
            p.x = cx + Math.cos(p.angle) * p.radius;
            p.y = cy + Math.sin(p.angle) * p.radius;
            
            ctx.fillRect(p.x, p.y, 2, 2);
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
