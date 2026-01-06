"use client";
import { useEffect, useRef } from "react";

export default function MetaballsV2() {
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

    class Ball {
        x: number;
        y: number;
        vx: number;
        vy: number;
        r: number;
        
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 4;
            this.vy = (Math.random() - 0.5) * 4;
            this.r = Math.random() * 20 + 30;
        }
        
        update() {
            this.x += this.vx;
            this.y += this.vy;
            if(this.x < 0 || this.x > width) this.vx *= -1;
            if(this.y < 0 || this.y > height) this.vy *= -1;
        }
        
        draw() {
            if (!ctx) return;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.r, 0, Math.PI*2);
            ctx.fill();
        }
    }
    
    const balls: Ball[] = [];
    for(let i=0; i<20; i++) balls.push(new Ball());

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      
      // Using filter for metaball effect
      // Needs context filter support
      // Note: This relies on browser support for canvas filter which is good in modern browsers.
      ctx.filter = 'blur(20px) contrast(30)';
      ctx.fillStyle = "white"; // White balls
      
      // Background must be black or transparent for contrast to work on alpha channel?
      // Actually contrast on white against transparent works if we just want shape.
      // But usually we set background to black inside filter?
      
      // Let's try:
      // Fill background black inside the frame so contrast behaves well
      // Actually standard trick: Draw white balls on black background, threshold alpha (contrast).
      // But standard CSS filter is simple.
      
      // Issue: contrast(30) makes everything B/W. If we want color, we color the result? 
      // Let's just make them white goo.
      
      balls.forEach(b => {
          b.update();
          b.draw();
      });
      
      ctx.filter = 'none';

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

  // Parent background is black so white goo shows up
  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full bg-black -z-10" />;
}
