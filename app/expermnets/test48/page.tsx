"use client";

import { useEffect, useRef } from "react";

export default function Physarum() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    // Simplified Physarum-like
    interface Agent {
      x: number;
      y: number;
      angle: number;
    }
    
    const agents: Agent[] = [];
    const agentCount = 1000;
    
    for(let i=0; i<agentCount; i++) {
        agents.push({
            x: Math.random()*w,
            y: Math.random()*h,
            angle: Math.random() * Math.PI * 2
        });
    }

    const animate = () => {
        // Fade
        ctx.fillStyle = "rgba(0,0,0,0.05)";
        ctx.fillRect(0,0,w,h);
        
        ctx.fillStyle = "#00ffaa";
        
        agents.forEach(a => {
            // Move
            const speed = 2;
            a.x += Math.cos(a.angle) * speed;
            a.y += Math.sin(a.angle) * speed;
            
            // Wall bounce
            if(a.x < 0 || a.x > w) {
                a.angle = Math.PI - a.angle;
                a.x = Math.max(0, Math.min(w, a.x));
            }
            if(a.y < 0 || a.y > h) {
                a.angle = -a.angle;
                a.y = Math.max(0, Math.min(h, a.y));
            }
            
            // Random wiggle
            a.angle += (Math.random() - 0.5) * 0.5;
            
            ctx.fillRect(a.x, a.y, 2, 2);
        });

        requestAnimationFrame(animate);
    }
    
    const resize = () => { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; };
    window.addEventListener("resize", resize);
    animate();
    return () => { window.removeEventListener("resize", resize); };
  }, []);

  return <canvas ref={canvasRef} className="block w-full h-screen bg-black" />;
}
