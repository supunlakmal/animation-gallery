"use client";

import { useEffect, useRef } from "react";

interface Point3D {
  x: number;
  y: number;
  z: number;
}

interface Shape {
  points: Point3D[];
  edges: [number, number][];
  x: number;
  y: number;
  z: number;
  rx: number;
  ry: number;
  rz: number;
  dx: number;
  dy: number;
  drx: number;
  dry: number;
  drz: number;
  color: string;
  size: number;
}

export default function FloatingShapes() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    const shapes: Shape[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);
    resize();

    // Create a Cube
    const createCube = (size: number): { points: Point3D[]; edges: [number, number][] } => {
      const p = [];
      for(let x=-1; x<=1; x+=2)
        for(let y=-1; y<=1; y+=2)
          for(let z=-1; z<=1; z+=2)
            p.push({x: x*size, y: y*size, z: z*size});
      
      const edges: [number, number][] = [
        [0,1], [1,3], [3,2], [2,0], // Front (relative)
        [4,5], [5,7], [7,6], [6,4], // Back
        [0,4], [1,5], [2,6], [3,7]  // Connecting
      ];
      return { points: p, edges };
    };

    // Initialize shapes
    for (let i = 0; i < 15; i++) {
        const cube = createCube(1);
        shapes.push({
            points: cube.points,
            edges: cube.edges,
            x: Math.random() * canvas.width - canvas.width/2,
            y: Math.random() * canvas.height - canvas.height/2,
            z: Math.random() * 500 + 100, // Depth
            rx: Math.random() * Math.PI,
            ry: Math.random() * Math.PI,
            rz: Math.random() * Math.PI,
            dx: (Math.random() - 0.5) * 2,
            dy: (Math.random() - 0.5) * 2,
            drx: (Math.random() - 0.5) * 0.02,
            dry: (Math.random() - 0.5) * 0.02,
            drz: (Math.random() - 0.5) * 0.02,
            color: `hsl(${Math.random() * 360}, 80%, 60%)`,
            size: Math.random() * 30 + 20
        });
    }

    const project = (p: Point3D, shape: Shape): {x: number, y: number} => {
        // Rotate
        let x = p.x * shape.size;
        let y = p.y * shape.size;
        let z = p.z * shape.size;

        // Rotation matrices (simplified application)
        // X
        let y1 = y * Math.cos(shape.rx) - z * Math.sin(shape.rx);
        let z1 = y * Math.sin(shape.rx) + z * Math.cos(shape.rx);
        y = y1; z = z1;
        // Y
        let x1 = x * Math.cos(shape.ry) + z * Math.sin(shape.ry);
        z1 = -x * Math.sin(shape.ry) + z * Math.cos(shape.ry);
        x = x1; z = z1;
        // Z
        x1 = x * Math.cos(shape.rz) - y * Math.sin(shape.rz);
        y1 = x * Math.sin(shape.rz) + y * Math.cos(shape.rz);
        x = x1; y = y1;

        // Translate
        // Perspective projection
        const fov = 300;
        const scale = fov / (fov + z + shape.z);
        
        return {
            x: (x + shape.x) * scale + canvas.width / 2,
            y: (y + shape.y) * scale + canvas.height / 2
        };
    };

    const draw = () => {
        ctx.fillStyle = "#111";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        shapes.forEach(shape => {
            shape.x += shape.dx;
            shape.y += shape.dy;
            shape.rx += shape.drx;
            shape.ry += shape.dry;
            shape.rz += shape.drz;

            // Bounce bounds (rough)
            if (shape.x < -canvas.width/2 || shape.x > canvas.width/2) shape.dx *= -1;
            if (shape.y < -canvas.height/2 || shape.y > canvas.height/2) shape.dy *= -1;

            const projectedPoints = shape.points.map(p => project(p, shape));

            ctx.strokeStyle = shape.color;
            ctx.lineWidth = 2;
            ctx.beginPath();
            shape.edges.forEach(edge => {
                const p1 = projectedPoints[edge[0]];
                const p2 = projectedPoints[edge[1]];
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
            });
            ctx.stroke();
        });

        animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
        window.removeEventListener("resize", resize);
        cancelAnimationFrame(animationId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 w-full h-full bg-black" />;
}
