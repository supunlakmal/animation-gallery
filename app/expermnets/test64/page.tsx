"use client";
import React, { useEffect, useRef } from "react";

class Boid {
  x: number;
  y: number;
  z: number = 0;
  vx: number;
  vy: number;
  width: number;
  height: number;

  constructor(w: number, h: number) {
    this.width = w;
    this.height = h;
    this.x = Math.random() * w;
    this.y = Math.random() * h;
    this.vx = Math.random() * 4 - 2;
    this.vy = Math.random() * 4 - 2;
  }

  update(boids: Boid[]) {
    // Flocking Rules
    // 1. Separation
    // 2. Alignment
    // 3. Cohesion

    let separationX = 0;
    let separationY = 0;
    let alignmentX = 0;
    let alignmentY = 0;
    let cohesionX = 0;
    let cohesionY = 0;
    let count = 0;

    const perception = 50;

    for (let other of boids) {
      const d = Math.sqrt((this.x - other.x) ** 2 + (this.y - other.y) ** 2);
      if (other !== this && d < perception) {
        // Separation
        separationX += (this.x - other.x) / d;
        separationY += (this.y - other.y) / d;

        // Alignment
        alignmentX += other.vx;
        alignmentY += other.vy;

        // Cohesion
        cohesionX += other.x;
        cohesionY += other.y;

        count++;
      }
    }

    if (count > 0) {
      alignmentX /= count;
      alignmentY /= count;
      alignmentX = (alignmentX - this.vx) * 0.05;
      alignmentY = (alignmentY - this.vy) * 0.05;

      cohesionX /= count;
      cohesionY /= count;
      cohesionX = (cohesionX - this.x) * 0.01;
      cohesionY = (cohesionY - this.y) * 0.01;

      separationX *= 0.1;
      separationY *= 0.1;

      this.vx += alignmentX + cohesionX + separationX;
      this.vy += alignmentY + cohesionY + separationY;
    }

    // Limit Speed
    const speed = Math.sqrt(this.vx ** 2 + this.vy ** 2);
    const maxSpeed = 4;
    const minSpeed = 2;
    if (speed > maxSpeed) {
      this.vx = (this.vx / speed) * maxSpeed;
      this.vy = (this.vy / speed) * maxSpeed;
    }
    if (speed < minSpeed) {
      this.vx = (this.vx / speed) * minSpeed;
      this.vy = (this.vy / speed) * minSpeed;
    }

    this.x += this.vx;
    this.y += this.vy;

    // Wrap
    if (this.x > this.width) this.x = 0;
    if (this.x < 0) this.x = this.width;
    if (this.y > this.height) this.y = 0;
    if (this.y < 0) this.y = this.height;
  }

  draw(ctx: CanvasRenderingContext2D) {
    const angle = Math.atan2(this.vy, this.vx);
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.moveTo(10, 0);
    ctx.lineTo(-5, 5);
    ctx.lineTo(-5, -5);
    ctx.closePath();
    ctx.fillStyle = "rgba(255, 100, 100, 0.8)";
    ctx.fill();
    ctx.restore();
  }
}

export default function BoidsSimulation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const boidsRef = useRef<Boid[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      // Re-init boids to stay within new bounds if needed, or just let them wrap
    };
    window.addEventListener("resize", resize);

    // Initial boids
    boidsRef.current = Array.from({ length: 150 }, () => new Boid(width, height));

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Background
      ctx.fillStyle = "#1a1a1a";
      ctx.fillRect(0, 0, width, height);

      boidsRef.current.forEach((boid) => {
        boid.update(boidsRef.current);
        boid.draw(ctx);
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full -z-10"
    />
  );
}
