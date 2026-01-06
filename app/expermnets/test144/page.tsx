"use client";

import { useEffect, useRef } from "react";

interface Cube {
  x: number;
  y: number;
  z: number;
  size: number;
  rx: number;
  ry: number;
  rz: number;
  vrx: number;
  vry: number;
  vrz: number;
  color: string;
}

export default function FloatingGlassCubes() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const cubesRef = useRef<Cube[]>([]);

  const config = {
    cubeCount: 20,
    depth: 800,
    perspective: 600,
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const initCubes = () => {
      cubesRef.current = [];
      for (let i = 0; i < config.cubeCount; i++) {
        cubesRef.current.push({
          x: (Math.random() - 0.5) * width,
          y: (Math.random() - 0.5) * height,
          z: Math.random() * config.depth,
          size: Math.random() * 50 + 30,
          rx: Math.random() * Math.PI,
          ry: Math.random() * Math.PI,
          rz: Math.random() * Math.PI,
          vrx: (Math.random() - 0.5) * 0.02,
          vry: (Math.random() - 0.5) * 0.02,
          vrz: (Math.random() - 0.5) * 0.02,
          color: `hsla(${Math.random() * 60 + 200}, 70%, 60%, 0.3)`
        });
      }
    };

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initCubes();
    };

    window.addEventListener("resize", resize);
    initCubes();

    const project = (x: number, y: number, z: number) => {
      const scale = config.perspective / (config.perspective + z);
      return {
        x: width / 2 + x * scale,
        y: height / 2 + y * scale,
        scale,
      };
    };

    const rotate = (x: number, y: number, z: number, rx: number, ry: number, rz: number) => {
        // Simple rotation matrices applied
        // Rotate X
        let y1 = y * Math.cos(rx) - z * Math.sin(rx);
        let z1 = y * Math.sin(rx) + z * Math.cos(rx);
        
        // Rotate Y
        let x2 = x * Math.cos(ry) + z1 * Math.sin(ry);
        let z2 = -x * Math.sin(ry) + z1 * Math.cos(ry);
        
        // Rotate Z
        let x3 = x2 * Math.cos(rz) - y1 * Math.sin(rz);
        let y3 = x2 * Math.sin(rz) + y1 * Math.cos(rz);
        
        return { x: x3, y: y3, z: z2 };
    };

    const animate = () => {
      // Gradient bg
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, "#eef2f3"); 
      gradient.addColorStop(1, "#8e9eab");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Sort cubes by Z (simple painter alg)
      cubesRef.current.sort((a, b) => b.z - a.z);

      cubesRef.current.forEach((cube) => {
        cube.rx += cube.vrx;
        cube.ry += cube.vry;
        cube.rz += cube.vrz;
        cube.z -= 1; // Move forward
        
        if (cube.z < -config.perspective + 100) {
            cube.z = config.depth;
        }

        const vertices = [
            {x: -1, y: -1, z: -1}, {x: 1, y: -1, z: -1}, {x: 1, y: 1, z: -1}, {x: -1, y: 1, z: -1},
            {x: -1, y: -1, z: 1}, {x: 1, y: -1, z: 1}, {x: 1, y: 1, z: 1}, {x: -1, y: 1, z: 1}
        ];

        const pVertices = vertices.map(v => {
            const rot = rotate(v.x * cube.size, v.y * cube.size, v.z * cube.size, cube.rx, cube.ry, cube.rz);
            return project(cube.x + rot.x, cube.y + rot.y, cube.z + rot.z);
        });

        // Faces (indices of vertices)
        const faces = [
             [0, 1, 2, 3], [5, 4, 7, 6], // Back, Front
             [4, 0, 3, 7], [1, 5, 6, 2], // Left, Right
             [4, 5, 1, 0], [3, 2, 6, 7]  // Top, Bottom
        ];

        // Draw faces
        ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
        ctx.lineWidth = 1;
        ctx.fillStyle = cube.color;

        faces.forEach(face => {
             // Only draw if visible? (Backface culling approx or just draw all for glass effect)
             // For glass effect, we draw all but sorted. 
             // Ideally we sort faces too, but that's expensive.
             
             ctx.beginPath();
             ctx.moveTo(pVertices[face[0]].x, pVertices[face[0]].y);
             for(let i=1; i<4; i++) {
                 ctx.lineTo(pVertices[face[i]].x, pVertices[face[i]].y);
             }
             ctx.closePath();
             ctx.fill();
             ctx.stroke();
        });
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full bg-white" />;
}
