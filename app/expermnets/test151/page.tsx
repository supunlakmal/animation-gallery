"use client";

import { useEffect, useRef } from "react";

export default function Fireworks() {
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
        vx: number;
        vy: number;
        alpha: number;
        color: string;
        decay: number;
    }

    interface Firework {
        x: number;
        y: number;
        tx: number; // target y
        ty: number;
        vx: number;
        vy: number;
        color: string;
        exploded: boolean;
        particles: Particle[];
    }

    const fireworks: Firework[] = [];

    const createExplosion = (x: number, y: number, color: string): Particle[] => {
        const particles: Particle[] = [];
        const count = 50 + Math.random() * 50;
        for(let i=0; i<count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 5 + 1;
            particles.push({
                x, y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                alpha: 1,
                color,
                decay: Math.random() * 0.015 + 0.005
            });
        }
        return particles;
    };

    const draw = () => {
        // Trail effect
        ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Random launch
        if (Math.random() < 0.05) {
            const startX = Math.random() * canvas.width;
            fireworks.push({
                x: startX,
                y: canvas.height,
                tx: startX,
                ty: Math.random() * (canvas.height / 2),
                vx: 0,
                vy: -Math.random() * 3 - 10, // Launch speed
                color: `hsl(${Math.random() * 360}, 100%, 60%)`,
                exploded: false,
                particles: []
            });
        }

        for (let i = fireworks.length - 1; i >= 0; i--) {
            const fw = fireworks[i];
            
            if (!fw.exploded) {
                // Rocket phase
                fw.x += fw.vx;
                fw.y += fw.vy;
                fw.vy += 0.2; // Gravity

                ctx.beginPath();
                ctx.arc(fw.x, fw.y, 3, 0, Math.PI * 2);
                ctx.fillStyle = fw.color;
                ctx.fill();

                if (fw.vy >= 0 || fw.y <= fw.ty) {
                    fw.exploded = true;
                    fw.particles = createExplosion(fw.x, fw.y, fw.color);
                }
            } else {
                // Particle phase
                for (let j = fw.particles.length - 1; j >= 0; j--) {
                    const p = fw.particles[j];
                    p.x += p.vx;
                    p.y += p.vy;
                    p.vy += 0.1; // Gravity
                    p.vx *= 0.95; // Drag
                    p.vy *= 0.95;
                    p.alpha -= p.decay;

                    if (p.alpha <= 0) {
                        fw.particles.splice(j, 1);
                    } else {
                        ctx.save();
                        ctx.globalAlpha = p.alpha;
                        ctx.fillStyle = p.color;
                        ctx.beginPath();
                        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
                        ctx.fill();
                        ctx.restore();
                    }
                }
                if (fw.particles.length === 0) {
                    fireworks.splice(i, 1);
                }
            }
        }

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
