"use client";

import { useEffect, useRef } from "react";

export default function Fire() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    interface Particle {
       x: number;
       y: number;
       vx: number;
       vy: number;
       life: number;
       maxLife: number;
       size: number;
    }
    
    const particles: Particle[] = [];
    const maxParticles = 500;

    const createParticle = () => {
        return {
            x: w/2 + (Math.random() - 0.5) * 50,
            y: h - 100,
            vx: (Math.random() - 0.5) * 2,
            vy: Math.random() * -5 - 2,
            life: 100,
            maxLife: Math.random() * 50 + 50,
            size: Math.random() * 20 + 10
        }
    }

    const animate = () => {
        ctx.fillStyle = "black";
        ctx.fillRect(0,0,w,h);
        
        // Spawn
        for(let k=0; k<5; k++)
            if(particles.length < maxParticles) particles.push(createParticle());

        for(let i=particles.length-1; i>=0; i--) {
            const p = particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.life--;
            p.size *= 0.96;
            
            // Turbulence
            p.vx += (Math.random() - 0.5) * 0.2;

            if(p.life <= 0 || p.size < 0.5) {
                particles.splice(i, 1);
                continue;
            }

            const progress = p.life / p.maxLife;
            // Fire color palette: White -> Yellow -> Red -> Dark
            let r=255, g=0, b=0;
            if (progress > 0.8) {
                 g = 255; b = 255; // White/Yellow
            } else if (progress > 0.5) {
                 g = Math.floor(255 * (progress - 0.5) * 2); b = 0; // Orange/Yellow
            } else {
                 r = Math.floor(255 * progress * 2); g=0; b=0; // Red fade
            }

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI*2);
            ctx.fillStyle = `rgba(${r},${g},${b},${progress})`;
            ctx.fill();
        }

        requestAnimationFrame(animate);
    }

    const resize = () => { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; };
    window.addEventListener("resize", resize);
    animate();
    return () => { window.removeEventListener("resize", resize); };
  }, []);

  return <canvas ref={canvasRef} className="block w-full h-screen bg-black" />;
}
