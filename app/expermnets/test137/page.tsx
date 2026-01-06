"use client";
import { useEffect, useRef } from "react";

export default function Fireworks() {
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

    interface Particle {
        x: number;
        y: number;
        vx: number;
        vy: number;
        color: string;
        alpha: number;
        decay: number;
    }
    
    interface Rocket {
        x: number;
        y: number;
        vy: number;
        color: string;
        exploded: boolean;
    }
    
    const particles: Particle[] = [];
    const rockets: Rocket[] = [];
    
    const colors = ["#ff0000", "#00ff00", "#0000ff", "#ffff00", "#ff00ff", "#00ffff"];
    
    const animate = () => {
      ctx.fillStyle = "rgba(0,0,0,0.1)"; // Trail
      ctx.fillRect(0, 0, width, height);
      
      // Spawn rockets
      if (Math.random() > 0.98) {
          rockets.push({
              x: Math.random() * width,
              y: height,
              vy: -Math.random() * 5 - 10,
              color: colors[Math.floor(Math.random() * colors.length)],
              exploded: false
          });
      }
      
      // Update Rockets
      for(let i=rockets.length-1; i>=0; i--) {
          const r = rockets[i];
          r.y += r.vy;
          r.vy += 0.1; // Gravity
          
          if(r.vy >= -1 && !r.exploded) {
              r.exploded = true;
              // Explode
              for(let j=0; j<50; j++) {
                  const angle = Math.random() * Math.PI * 2;
                  const speed = Math.random() * 5;
                  particles.push({
                      x: r.x,
                      y: r.y,
                      vx: Math.cos(angle) * speed,
                      vy: Math.sin(angle) * speed,
                      color: r.color,
                      alpha: 1,
                      decay: Math.random() * 0.01 + 0.01
                  });
              }
              rockets.splice(i, 1);
          } else if (!r.exploded) {
             ctx.beginPath();
             ctx.fillStyle = r.color;
             ctx.arc(r.x, r.y, 2, 0, Math.PI*2);
             ctx.fill();
          }
      }
      
      // Update Particles
      for(let i=particles.length-1; i>=0; i--) {
           const p = particles[i];
           p.x += p.vx;
           p.y += p.vy;
           p.vy += 0.05; // Gravity
           p.vx *= 0.98;
           p.vy *= 0.98;
           p.alpha -= p.decay;
           
           if(p.alpha <= 0) {
               particles.splice(i, 1);
               continue;
           }
           
           ctx.beginPath();
           ctx.fillStyle = p.color;
           ctx.globalAlpha = p.alpha;
           ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
           ctx.fill();
           ctx.globalAlpha = 1;
      }

      requestAnimationFrame(animate);
    };

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    
    // Click to launch
    const handleClick = (e: MouseEvent) => {
          rockets.push({
              x: e.clientX,
              y: height,
              vy: -Math.sqrt((height - e.clientY) * 0.2) - 2, // Approximate velocity needed
              color: colors[Math.floor(Math.random() * colors.length)],
              exploded: false
          });
    };

    window.addEventListener("click", handleClick);
    window.addEventListener("resize", handleResize);
    const id = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("click", handleClick);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(id);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full bg-black -z-10" />;
}
