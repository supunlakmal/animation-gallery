"use client";

import { useEffect, useRef } from "react";

export default function GravitationalFields() {
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

    interface Attractor {
        x: number;
        y: number;
        strength: number;
    }

    interface Particle {
        x: number;
        y: number;
        vx: number;
        vy: number;
        color: string;
    }

    const attractors: Attractor[] = [
        { x: canvas.width * 0.3, y: canvas.height * 0.5, strength: 100 },
        { x: canvas.width * 0.7, y: canvas.height * 0.5, strength: -50 }, // Repulsor
    ];

    const particles: Particle[] = [];
    for (let i = 0; i < 500; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            color: `hsl(${Math.random() * 60 + 200}, 70%, 60%)`
        });
    }

    let time = 0;

    const draw = () => {
        ctx.fillStyle = "rgba(0, 0, 0, 0.1)"; // Trails
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Move attractors
        attractors[0].x = canvas.width/2 + Math.cos(time) * 200;
        attractors[0].y = canvas.height/2 + Math.sin(time) * 100;
        attractors[1].x = canvas.width/2 + Math.cos(time + Math.PI) * 200;
        attractors[1].y = canvas.height/2 + Math.sin(time * 0.5) * 200;

        particles.forEach(p => {
            let fx = 0;
            let fy = 0;

            attractors.forEach(att => {
                const dx = att.x - p.x;
                const dy = att.y - p.y;
                const distSq = dx*dx + dy*dy;
                const dist = Math.sqrt(distSq);
                
                if (dist > 5) { // Min distance clmap
                    const force = att.strength / distSq;
                    fx += dx * force;
                    fy += dy * force;
                }
            });

            p.vx += fx;
            p.vy += fy;

            // Friction
            p.vx *= 0.99;
            p.vy *= 0.99;

            p.x += p.vx;
            p.y += p.vy;

            // wrap
            if(p.x < 0) p.x = canvas.width;
            if(p.x > canvas.width) p.x = 0;
            if(p.y < 0) p.y = canvas.height;
            if(p.y > canvas.height) p.y = 0;

            ctx.fillStyle = p.color;
            ctx.fillRect(p.x, p.y, 2, 2);
        });

        time += 0.01;
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
