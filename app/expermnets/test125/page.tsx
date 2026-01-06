"use client";
import { useEffect, useRef } from "react";

export default function CollisionChaos() {
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

    interface Ball {
        x: number;
        y: number;
        vx: number;
        vy: number;
        radius: number;
        color: string;
    }
    
    const balls: Ball[] = [];
    for(let i=0; i<30; i++) {
        balls.push({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 10,
            vy: (Math.random() - 0.5) * 10,
            radius: 10 + Math.random() * 20,
            color: `hsl(${Math.random() * 360}, 70%, 50%)`
        });
    }

    const animate = () => {
      ctx.fillStyle = "rgba(0,0,0,0.3)";
      ctx.fillRect(0, 0, width, height);

      balls.forEach(ball => {
         ball.x += ball.vx;
         ball.y += ball.vy;
         
         if (ball.x - ball.radius < 0 || ball.x + ball.radius > width) {
             ball.vx *= -1;
             ball.color = `hsl(${Math.random() * 360}, 70%, 50%)`;
         }
         
         if (ball.y - ball.radius < 0 || ball.y + ball.radius > height) {
             ball.vy *= -1;
             ball.color = `hsl(${Math.random() * 360}, 70%, 50%)`;
         }
         
         ctx.beginPath();
         ctx.fillStyle = ball.color;
         ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
         ctx.fill();
         ctx.strokeStyle = "white";
         ctx.stroke();
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

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full bg-black -z-10" />;
}
