"use client";
import { useEffect, useRef } from "react";

export default function ParticlesMorph() {
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
        targetX: number;
        targetY: number;
        color: string;
    }
    
    let particles: Particle[] = [];
    const count = 500;
    
    // Shapes
    // Circle
    // Square
    
    let shape = 0; // 0 circle, 1 square
    
    const init = () => {
        particles = [];
        for(let i=0; i<count; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                targetX: 0,
                targetY: 0,
                color: "white"
            });
        }
        updateTargets();
    };
    
    const updateTargets = () => {
        const cx = width / 2;
        const cy = height / 2;
        const r = 200;
        
        particles.forEach((p, i) => {
            if (shape === 0) {
                // Circle
                const angle = Math.random() * Math.PI * 2;
                // Random position inside circle
                const rnd = Math.sqrt(Math.random()) * r; 
                p.targetX = cx + Math.cos(angle) * rnd;
                p.targetY = cy + Math.sin(angle) * rnd;
                p.color = "cyan";
            } else {
                // Square
                const size = 300;
                p.targetX = cx - size/2 + Math.random() * size;
                p.targetY = cy - size/2 + Math.random() * size;
                p.color = "magenta";
            }
        });
    };
    
    setInterval(() => {
        shape = 1 - shape;
        updateTargets();
    }, 2000);
    
    init();

    const animate = () => {
      ctx.fillStyle = "rgba(0,0,0,0.1)";
      ctx.fillRect(0, 0, width, height);
      
      particles.forEach(p => {
          // Lerp
          p.x += (p.targetX - p.x) * 0.05;
          p.y += (p.targetY - p.y) * 0.05;
          
          ctx.beginPath();
          ctx.fillStyle = p.color;
          ctx.arc(p.x, p.y, 2, 0, Math.PI*2);
          ctx.fill();
      });

      requestAnimationFrame(animate);
    };

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      init();
    };

    window.addEventListener("resize", handleResize);
    const id = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(id);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full bg-black -z-10" />;
}
