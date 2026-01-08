"use client";
import { useEffect, useRef } from "react";

export default function ConfettiCannon() {
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

    interface Confetti {
        x: number;
        y: number;
        vx: number;
        vy: number;
        rotation: number;
        rotationSpeed: number;
        color: string;
        size: number;
    }
    
    const confetti: Confetti[] = [];
    
    const fire = (x: number, y: number) => {
        for(let i=0; i<50; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 15 + 5;
            confetti.push({
                x,
                y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                rotation: Math.random() * 360,
                rotationSpeed: (Math.random() - 0.5) * 10,
                color: `hsl(${Math.random() * 360}, 100%, 50%)`,
                size: Math.random() * 10 + 5
            });
        }
    };
    
    // Auto fire 
    let t = 0;

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      t++;
      if (t % 60 === 0) fire(width/2, height/2);

      for (let i = confetti.length - 1; i >= 0; i--) {
          const c = confetti[i];
          c.x += c.vx;
          c.y += c.vy;
          c.vy += 0.5; // Gravity
          c.vx *= 0.95; // Air resistance
          
          c.rotation += c.rotationSpeed;
          
          ctx.save();
          ctx.translate(c.x, c.y);
          ctx.rotate(c.rotation * Math.PI / 180);
          ctx.fillStyle = c.color;
          ctx.fillRect(-c.size/2, -c.size/2, c.size, c.size);
          ctx.restore();
          
          if (c.y > height) confetti.splice(i, 1);
      }

      requestAnimationFrame(animate);
    };

    const handleClick = (e: MouseEvent) => {
        fire(e.clientX, e.clientY);
    };

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
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

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full bg-white -z-10" />;
}
