"use client";
import { useEffect, useRef } from "react";

// --- Interfaces for our 3D world ---
interface Point3D {
  x: number;
  y: number;
  z: number;
}

interface Shard {
  points: Point3D[];
  vx: number;
  vy: number;
  vz: number;
  life: number;
}

interface Cube {
  id: number;
  x: number;
  y: number;
  z: number;
  state: "idle" | "shattering";
  shards: Shard[];
  shatterTime: number;
}

export default function CrystallineLatticeBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);

  const cubesRef = useRef<Map<number, Cube>>(new Map());
  const cameraRef = useRef({ z: 0, fov: 300 });
  const mouseRef = useRef({ x: 0, y: 0 });
  const cascadeRef = useRef({ radius: 0, maxRadius: 0, isActive: false });

  // --- Configuration ---
  const config = {
    gridSize: 200,
    gridRange: 4, // Creates a grid of (range*2+1)^3 cubes
    cameraSpeed: 0.5,
    shatterRadius: 100,
    shatterLife: 120, // Frames for shards to live
    returnForce: 0.001,
    damping: 0.95,
  };

  const project = (p: Point3D, canvasWidth: number, canvasHeight: number) => {
    const relativeZ = p.z - cameraRef.current.z;
    const scale = cameraRef.current.fov / (cameraRef.current.fov + relativeZ);
    return {
      x: canvasWidth / 2 + p.x * scale,
      y: canvasHeight / 2 + p.y * scale,
      scale: Math.max(0, scale),
    };
  };

  const shatterCube = (cube: Cube) => {
    if (cube.state === "idle") {
      cube.state = "shattering";
      cube.shatterTime = config.shatterLife;
      cube.shards = [];
      const size = config.gridSize / 2;
      for (let i = 0; i < 12; i++) {
        // 12 shards per cube
        const p1 = { x: (Math.random() - 0.5) * size, y: (Math.random() - 0.5) * size, z: (Math.random() - 0.5) * size };
        const p2 = { x: (Math.random() - 0.5) * size, y: (Math.random() - 0.5) * size, z: (Math.random() - 0.5) * size };
        const p3 = { x: (Math.random() - 0.5) * size, y: (Math.random() - 0.5) * size, z: (Math.random() - 0.5) * size };
        cube.shards.push({
          points: [p1, p2, p3],
          vx: (Math.random() - 0.5) * 5,
          vy: (Math.random() - 0.5) * 5,
          vz: (Math.random() - 0.5) * 5,
          life: 1,
        });
      }
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const initialize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      mouseRef.current = { x: canvas.width / 2, y: canvas.height / 2 };
      cameraRef.current.z = 0;
      cubesRef.current.clear();
    };
    initialize();
    window.addEventListener("resize", initialize);

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    const handleClick = () => {
      if (!cascadeRef.current.isActive) {
        cascadeRef.current = { radius: 0, maxRadius: config.gridSize * config.gridRange * 1.5, isActive: true };
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("click", handleClick);

    const animate = () => {
      ctx.fillStyle = "rgba(8, 5, 12, 0.4)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      cameraRef.current.z += config.cameraSpeed;

      // --- Update Cascade ---
      if (cascadeRef.current.isActive) {
        cascadeRef.current.radius += 20;
        if (cascadeRef.current.radius > cascadeRef.current.maxRadius) {
          cascadeRef.current.isActive = false;
        }
      }

      // --- Procedurally Generate and Update Cubes ---
      const cameraGridZ = Math.floor(cameraRef.current.z / config.gridSize);
      for (let z = -config.gridRange; z <= config.gridRange; z++) {
        for (let y = -config.gridRange; y <= config.gridRange; y++) {
          for (let x = -config.gridRange; x <= config.gridRange; x++) {
            const cz = (cameraGridZ + z) * config.gridSize;
            if (cz < cameraRef.current.z) continue; // Cull cubes behind camera

            const cx = x * config.gridSize;
            const cy = y * config.gridSize;
            const id = x * 100 + y * 10000 + (cameraGridZ + z) * 1000000;

            if (!cubesRef.current.has(id)) {
              cubesRef.current.set(id, { id, x: cx, y: cy, z: cz, state: "idle", shards: [], shatterTime: 0 });
            }
            const cube = cubesRef.current.get(id)!;

            const { x: projX, y: projY } = project({ x: cube.x, y: cube.y, z: cube.z }, canvas.width, canvas.height);
            const distToMouse = Math.sqrt(Math.pow(projX - mouseRef.current.x, 2) + Math.pow(projY - mouseRef.current.y, 2));
            if (distToMouse < config.shatterRadius) shatterCube(cube);

            if (cascadeRef.current.isActive) {
              const distToCam = Math.sqrt(Math.pow(cube.x, 2) + Math.pow(cube.y, 2) + Math.pow(cube.z - cameraRef.current.z, 2));
              if (Math.abs(distToCam - cascadeRef.current.radius) < 50) shatterCube(cube);
            }

            if (cube.state === "shattering") {
              cube.shatterTime--;
              if (cube.shatterTime <= 0) cube.state = "idle";

              ctx.beginPath();
              cube.shards.forEach((shard) => {
                const lifeRatio = cube.shatterTime / config.shatterLife;
                shard.vx *= config.damping;
                shard.vy *= config.damping;
                shard.vz *= config.damping;
                shard.points.forEach((p) => {
                  p.x += shard.vx;
                  p.y += shard.vy;
                  p.z += shard.vz;
                  p.x -= p.x * config.returnForce * (1 - lifeRatio);
                  p.y -= p.y * config.returnForce * (1 - lifeRatio);
                  p.z -= p.z * config.returnForce * (1 - lifeRatio);
                });

                const p1 = project(
                  { x: cube.x + shard.points[0].x, y: cube.y + shard.points[0].y, z: cube.z + shard.points[0].z },
                  canvas.width,
                  canvas.height
                );
                const p2 = project(
                  { x: cube.x + shard.points[1].x, y: cube.y + shard.points[1].y, z: cube.z + shard.points[1].z },
                  canvas.width,
                  canvas.height
                );
                const p3 = project(
                  { x: cube.x + shard.points[2].x, y: cube.y + shard.points[2].y, z: cube.z + shard.points[2].z },
                  canvas.width,
                  canvas.height
                );

                if (p1.scale > 0 && p2.scale > 0 && p3.scale > 0) {
                  ctx.moveTo(p1.x, p1.y);
                  ctx.lineTo(p2.x, p2.y);
                  ctx.lineTo(p3.x, p3.y);
                  ctx.closePath();
                }
              });
              const hue = 300 - (cube.shatterTime / config.shatterLife) * 100;
              ctx.strokeStyle = `hsla(${hue}, 100%, 70%, ${cube.shatterTime / config.shatterLife})`;
              ctx.stroke();
            } else {
              // Draw idle cube wireframe
              const size = (config.gridSize / 2) * project({ x: cube.x, y: cube.y, z: cube.z }, canvas.width, canvas.height).scale;
              if (size > 1) {
                ctx.strokeStyle = `hsla(220, 100%, 80%, ${size / 20})`;
                ctx.strokeRect(projX - size, projY - size, size * 2, size * 2);
              }
            }
          }
        }
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener("resize", initialize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("click", handleClick);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
    // Intentionally run once on mount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-10"
      style={{
        backgroundColor: "rgb(8, 5, 12)",
        cursor: "none",
      }}
    />
  );
}
