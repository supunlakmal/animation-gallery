"use client";
import { useEffect, useRef } from "react";

export default function StarWarp() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const stars: Star[] = [];
    const numStars = 1000;
    const speed = 20;

    class Star {
      x: number;
      y: number;
      z: number;
      pz: number; // Previous z for streaks

      constructor() {
        this.x = (Math.random() - 0.5) * width * 2;
        this.y = (Math.random() - 0.5) * height * 2;
        this.z = Math.random() * width;
        this.pz = this.z;
      }

      update() {
        this.z -= speed;
        if (this.z < 1) {
          this.z = width;
          this.x = (Math.random() - 0.5) * width * 2;
          this.y = (Math.random() - 0.5) * height * 2;
          this.pz = this.z;
        }
      }

      draw() {
        if(!ctx) return;
        
        // Perspective projection
        const sx = (this.x / this.z) * width + width / 2;
        const sy = (this.y / this.z) * height + height / 2;

        const maxRadius = (1 - this.z / width) * 4;
        
        // Previous position for streak
        // (pz is not quite right, we want where it was in 2D space slightly ago, or simply extrapolate)
        // A simple streak effect is drawing line from center? No, drawing line from 'prev frame projected' position
        
        // Actually simplest streak:
        // just draw a line from (sx, sy) to slightly outside
        
        // Let's rely on update for pz
        // Not perfect streak, but let's try just changing size
        
        const brightness = (1 - this.z / width);
        ctx.fillStyle = `rgba(255, 255, 255, ${brightness})`;
        
        ctx.beginPath();
        ctx.arc(sx, sy, maxRadius, 0, Math.PI * 2);
        ctx.fill();
        
        this.pz = this.z; // Update pz
      }
    }

    const init = () => {
        stars.length = 0;
        for(let i=0; i<numStars; i++) {
            stars.push(new Star());
        }
    };
    
    init();

    const animate = () => {
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, width, height);

      stars.forEach((s) => {
        s.update();
        s.draw();
      });

      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      init();
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);

  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 bg-black" />;
}
