"use client";

import { useEffect, useRef } from "react";

export default function InteractiveCloth() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef<{ x: number; y: number; isDown: boolean }>({
    x: 0,
    y: 0,
    isDown: false,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);
    resize();

    // Physics constants
    const gravity = 0.5;
    const friction = 0.99;
    const bounce = 0.9;
    const tension = 6; // stiffness

    interface Point {
      x: number;
      y: number;
      oldx: number;
      oldy: number;
      pinned: boolean;
    }

    interface Stick {
      p0: Point;
      p1: Point;
      length: number;
    }

    const points: Point[] = [];
    const sticks: Stick[] = [];

    const spacing = 20;
    const startX = canvas.width / 2 - 200;
    const startY = 50;
    const rows = 20;
    const cols = 25;

    // Create points
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const p: Point = {
          x: startX + x * spacing,
          y: startY + y * spacing,
          oldx: startX + x * spacing,
          oldy: startY + y * spacing,
          pinned: y === 0 // Pin top row
        };
        points.push(p);
      }
    }

    // Create sticks
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        if (x < cols - 1) { // Connect right
          sticks.push({
            p0: points[y * cols + x],
            p1: points[y * cols + x + 1],
            length: spacing
          });
        }
        if (y < rows - 1) { // Connect down
          sticks.push({
            p0: points[y * cols + x],
            p1: points[(y + 1) * cols + x],
            length: spacing
          });
        }
      }
    }

    const updatePoints = () => {
      for (let i = 0; i < points.length; i++) {
        const p = points[i];
        if (!p.pinned) {
          const vx = (p.x - p.oldx) * friction;
          const vy = (p.y - p.oldy) * friction;

          p.oldx = p.x;
          p.oldy = p.y;

          p.x += vx;
          p.y += vy;
          p.y += gravity;
        }
      }
    };

    const updateSticks = () => {
      for (let i = 0; i < sticks.length; i++) {
        const s = sticks[i];
        const dx = s.p1.x - s.p0.x;
        const dy = s.p1.y - s.p0.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const difference = s.length - distance;
        const percent = difference / distance / 2;
        const offsetX = dx * percent;
        const offsetY = dy * percent;

        if (!s.p0.pinned) {
          s.p0.x -= offsetX;
          s.p0.y -= offsetY;
        }
        if (!s.p1.pinned) {
          s.p1.x += offsetX;
          s.p1.y += offsetY;
        }
      }
    };

    const handleMouseInteraction = () => {
        if (!mouseRef.current.isDown) return;

        // Cut or drag? Let's do drag for now.
        // Find nearest point
        let nearestDist = 50;
        let nearestPoint: Point | null = null;

        for(const p of points) {
            const dx = p.x - mouseRef.current.x;
            const dy = p.y - mouseRef.current.y;
            const dist = Math.sqrt(dx*dx + dy*dy);
            if (dist < nearestDist) {
                nearestDist = dist;
                nearestPoint = p;
            }
        }

        if (nearestPoint) {
            // Pull it
            // Simple: move it to mouse
            // But we can't break physics too hard.
            // Just set position, Verlet will handle velocity next frame
            nearestPoint.oldx = nearestPoint.x; // Stop velocity buildup?
            nearestPoint.oldy = nearestPoint.y;
            nearestPoint.x = mouseRef.current.x;
            nearestPoint.y = mouseRef.current.y;
        }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height); // Standard clear

      updatePoints();
      for(let i=0; i<3; i++) updateSticks(); // Iterate constraints
      handleMouseInteraction();

      ctx.strokeStyle = "#444";
      ctx.beginPath();
      for (const s of sticks) {
        ctx.moveTo(s.p0.x, s.p0.y);
        ctx.lineTo(s.p1.x, s.p1.y);
      }
      ctx.stroke();

      animationId = requestAnimationFrame(draw);
    };

    draw();

    const onMouseMove = (e: MouseEvent) => {
        mouseRef.current.x = e.clientX;
        mouseRef.current.y = e.clientY;
    };
    const onMouseDown = () => mouseRef.current.isDown = true;
    const onMouseUp = () => mouseRef.current.isDown = false;

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 w-full h-full bg-[#f0f0f0]" />;
}
