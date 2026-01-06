"use client";
import { useEffect, useRef } from "react";

export default function Constellations() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const particles: Particle[] = [];
    const numParticles = 100;
    const mouse = { x: -100, y: -100, radius: 150 };

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() * 2 - 1) * 0.5;
        this.vy = (Math.random() * 2 - 1) * 0.5;
        this.size = 2;
        this.color = "#ffffff";
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        // Bounce off edges
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        // Mouse interaction
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < mouse.radius) {
            // Push away gently
            const forceDirectionX = dx / distance;
            const forceDirectionY = dy / distance;
            const force = (mouse.radius - distance) / mouse.radius;
            this.vx -= forceDirectionX * force * 0.5;
            this.vy -= forceDirectionY * force * 0.5;
        }
      }

      draw() {
        if (!ctx) return;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const init = () => {
      particles.length = 0;
      for (let i = 0; i < numParticles; i++) {
        particles.push(new Particle());
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      
      // Draw background
      // Aesthetic gradient
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, "#1f1c2c");
      grad.addColorStop(1, "#928dab");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);


      particles.forEach((p) => {
        p.update();
        p.draw();
      });

      // Connect particles
      ctx.lineWidth = 1;
      const connectDistance = 100;
      
      for(let i=0; i<particles.length; i++) {
          for(let j=i; j<particles.length; j++) {
              const dx = particles[i].x - particles[j].x;
              const dy = particles[i].y - particles[j].y;
              const distance = Math.sqrt(dx*dx + dy*dy);

              if (distance < connectDistance) {
                  const opacity = 1 - (distance / connectDistance);
                  ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.5})`;
                  ctx.beginPath();
                  ctx.moveTo(particles[i].x, particles[i].y);
                  ctx.lineTo(particles[j].x, particles[j].y);
                  ctx.stroke();
              }
          }
           // Connect to mouse
            const dx = particles[i].x - mouse.x;
            const dy = particles[i].y - mouse.y;
            const distance = Math.sqrt(dx*dx + dy*dy);
            if (distance < mouse.radius) {
                  const opacity = 1 - (distance / mouse.radius);
                  ctx.strokeStyle = `rgba(255, 200, 100, ${opacity})`; // Amber connection to mouse
                  ctx.beginPath();
                  ctx.moveTo(particles[i].x, particles[i].y);
                  ctx.lineTo(mouse.x, mouse.y);
                  ctx.stroke();
            }
      }

      requestAnimationFrame(animate);
    };

    init();
    animate();

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      init();
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0" />;
}
