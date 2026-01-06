"use client";
import React, { useEffect, useRef } from "react";

// 4D Rotation matrices and projection
// Basic hypercube vertices
const vertices4D = [
  [-1, -1, -1, -1], [1, -1, -1, -1], [-1, 1, -1, -1], [1, 1, -1, -1],
  [-1, -1, 1, -1], [1, -1, 1, -1], [-1, 1, 1, -1], [1, 1, 1, -1],
  [-1, -1, -1, 1], [1, -1, -1, 1], [-1, 1, -1, 1], [1, 1, -1, 1],
  [-1, -1, 1, 1], [1, -1, 1, 1], [-1, 1, 1, 1], [1, 1, 1, 1],
];

const edges = [
  [0, 1], [0, 2], [0, 4], [0, 8],
  [1, 3], [1, 5], [1, 9],
  [2, 3], [2, 6], [2, 10],
  [3, 7], [3, 11],
  [4, 5], [4, 6], [4, 12],
  [5, 7], [5, 13],
  [6, 7], [6, 14],
  [7, 15],
  [8, 9], [8, 10], [8, 12],
  [9, 11], [9, 13],
  [10, 11], [10, 14],
  [11, 15],
  [12, 13], [12, 14],
  [13, 15],
  [14, 15],
];

export default function Hypercube() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    let angle = 0;

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);

    const matMul = (v: number[], m: number[][]) => {
      const result = [0, 0, 0, 0];
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
          result[i] += v[j] * m[j][i];
        }
      }
      return result;
    };

    const animate = () => {
      ctx.fillStyle = "#111"; // Background
      ctx.fillRect(0, 0, width, height);
      
      angle += 0.01;

      // Rotation matrices (XY and ZW planes)
      const c = Math.cos(angle);
      const s = Math.sin(angle);
      
      const rotXY = [
        [c, -s, 0, 0],
        [s, c, 0, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 1],
      ];
      
      const rotZW = [
        [1, 0, 0, 0],
        [0, 1, 0, 0],
        [0, 0, c, -s],
        [0, 0, s, c],
      ];

      // Project and Draw
      const projected2D: {x: number, y: number}[] = [];
      const scale = 150;

      for (let i = 0; i < vertices4D.length; i++) {
        let v = vertices4D[i];
        // Rotate
        v = matMul(v, rotXY);
        v = matMul(v, rotZW); // Double rotation

        // 4D -> 3D Projection
        const distance = 3;
        const w = 1 / (distance - v[3]);
        const proj3D = [
          v[0] * w,
          v[1] * w,
          v[2] * w
        ];

        // 3D -> 2D Projection
        const z = 1 / (distance - proj3D[2]);
        const p2d = {
            x: proj3D[0] * z * width * 0.4 + width / 2, // Scale up
            y: proj3D[1] * z * width * 0.4 + height / 2
        };
        projected2D.push(p2d);
        
        // Draw Vertex
        ctx.fillStyle = "#fff";
        ctx.beginPath();
        ctx.arc(p2d.x, p2d.y, 4, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw Edges
      ctx.strokeStyle = "rgba(100, 200, 255, 0.5)";
      ctx.lineWidth = 2;
      for (let i = 0; i < edges.length; i++) {
        const p1 = projected2D[edges[i][0]];
        const p2 = projected2D[edges[i][1]];
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      }

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
