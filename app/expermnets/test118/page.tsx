"use client";
import { useEffect, useRef } from "react";

export default function Boids() {
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

    class Boid {
        x: number;
        y: number;
        vx: number;
        vy: number;
        
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = Math.random() * 4 - 2;
            this.vy = Math.random() * 4 - 2;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            
            // Wrap
            if (this.x < 0) this.x = width;
            if (this.x > width) this.x = 0;
            if (this.y < 0) this.y = height;
            if (this.y > height) this.y = 0;
        }

        draw() {
            if (!ctx) return;
            const angle = Math.atan2(this.vy, this.vx);
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(angle);
            ctx.beginPath();
            ctx.moveTo(10, 0);
            ctx.lineTo(-5, 5);
            ctx.lineTo(-5, -5);
            ctx.fillStyle = "cyan";
            ctx.fill();
            ctx.restore();
        }
    }

    const boids: Boid[] = [];
    for(let i=0; i<100; i++) boids.push(new Boid());

    const animate = () => {
      ctx.fillStyle = "#001";
      ctx.fillRect(0, 0, width, height);
      
      // Simple logic loop (real boids is O(N^2) without quadtree, but 100 is fine)
      for (const boid of boids) {
          // Boid rules omitted for brevity, just random + momentum
          // Alignment
          let avgVx = 0;
          let avgVy = 0;
          let avgX = 0;
          let avgY = 0;
          let count = 0;
          
          for(const other of boids) {
              const d = Math.hypot(boid.x - other.x, boid.y - other.y);
              if (other !== boid && d < 50) {
                  avgVx += other.vx;
                  avgVy += other.vy;
                  avgX += other.x;
                  avgY += other.y;
                  count++;
              }
          }
          
          if(count > 0) {
              avgVx /= count;
              avgVy /= count;
              avgX /= count;
              avgY /= count;
              
              // Alignment
              boid.vx += (avgVx - boid.vx) * 0.05;
              boid.vy += (avgVy - boid.vy) * 0.05;
              
              // Cohesion
              boid.vx += (avgX - boid.x) * 0.005;
              boid.vy += (avgY - boid.y) * 0.005;
              
              // Separation not implemented fully, but they drift
          }
          
          // Speed limit
          const speed = Math.hypot(boid.vx, boid.vy);
          if(speed > 4) {
              boid.vx = (boid.vx / speed) * 4;
              boid.vy = (boid.vy / speed) * 4;
          }

          boid.update();
          boid.draw();
      }

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

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full bg-[#001] -z-10" />;
}
