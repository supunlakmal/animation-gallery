"use client";
import { useEffect, useRef } from "react";

// --- Interfaces for our generative architecture ---
interface Node {
  id: string;
  x: number;
  y: number;
  z: number;
  life: number; // 0 (gone) to 1 (fully built)
  state: "building" | "decaying";
}

// --- Configuration (outside component for stability) ---
const config = {
  gridSize: 150,
  viewDistance: 4, // in grid units
  buildSpeed: 0.05,
  decaySpeed: 0.01,
  blueprintDuration: 90, // frames
};

export default function ArchitectsDreamBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);

  const nodesRef = useRef<Map<string, Node>>(new Map());
  const cameraRef = useRef({ x: 0, y: 0, z: 0, targetX: 0, targetY: 0, fov: 300 });
  const mouseRef = useRef({ x: 0, y: 0, isMoving: false });
  const mouseMoveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const blueprintStateRef = useRef({ isActive: false, timer: 0 });

  const project = (p: { x: number; y: number; z: number }, canvasWidth: number, canvasHeight: number) => {
    const relativeZ = p.z - cameraRef.current.z;
    if (relativeZ <= 0) return { x: 0, y: 0, scale: -1 }; // Behind camera
    const scale = cameraRef.current.fov / relativeZ;
    return {
      x: canvasWidth / 2 + (p.x - cameraRef.current.x) * scale,
      y: canvasHeight / 2 + (p.y - cameraRef.current.y) * scale,
      scale: scale,
    };
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // --- Initialization and Resizing ---
    const initialize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      mouseRef.current.x = canvas.width / 2;
      mouseRef.current.y = canvas.height / 2;
      nodesRef.current.clear();
    };
    initialize();
    window.addEventListener("resize", initialize);

    // --- Event Handlers ---
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY, isMoving: true };
      if (mouseMoveTimeoutRef.current) clearTimeout(mouseMoveTimeoutRef.current);
      mouseMoveTimeoutRef.current = setTimeout(() => {
        mouseRef.current.isMoving = false;
      }, 200);
    };
    const handleClick = () => {
      if (!blueprintStateRef.current.isActive) {
        blueprintStateRef.current = { isActive: true, timer: config.blueprintDuration };
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("click", handleClick);

    // --- Main Animation Loop ---
    const animate = () => {
      ctx.fillStyle = "rgb(8, 5, 12)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // --- 1. Update Camera and Blueprint State ---
      cameraRef.current.targetX = (mouseRef.current.x - canvas.width / 2) * 0.5;
      cameraRef.current.targetY = (mouseRef.current.y - canvas.height / 2) * 0.5;
      cameraRef.current.x += (cameraRef.current.targetX - cameraRef.current.x) * 0.05;
      cameraRef.current.y += (cameraRef.current.targetY - cameraRef.current.y) * 0.05;
      if (mouseRef.current.isMoving) cameraRef.current.z += 1;

      if (blueprintStateRef.current.isActive) {
        blueprintStateRef.current.timer--;
        if (blueprintStateRef.current.timer <= 0) blueprintStateRef.current.isActive = false;
      }

      // --- 2. Manage Nodes (Creation, Update, Deletion) ---
      const camGridX = Math.round(cameraRef.current.x / config.gridSize);
      const camGridY = Math.round(cameraRef.current.y / config.gridSize);
      const camGridZ = Math.round(cameraRef.current.z / config.gridSize);

      const nodesToDraw: { p1: Node; p2: Node; life: number }[] = [];

      for (let z = -config.viewDistance; z <= config.viewDistance; z++) {
        for (let y = -config.viewDistance; y <= config.viewDistance; y++) {
          for (let x = -config.viewDistance; x <= config.viewDistance; x++) {
            const worldX = (camGridX + x) * config.gridSize;
            const worldY = (camGridY + y) * config.gridSize;
            const worldZ = (camGridZ + z) * config.gridSize;
            const id = `${worldX},${worldY},${worldZ}`;

            // Should this node exist?
            const shouldExist = worldZ > cameraRef.current.z;
            let node = nodesRef.current.get(id);

            if (shouldExist && !node) {
              node = { id, x: worldX, y: worldY, z: worldZ, life: 0, state: "building" };
              nodesRef.current.set(id, node);
            }

            if (node) {
              // Update node state
              if (mouseRef.current.isMoving || blueprintStateRef.current.isActive) {
                node.state = "building";
              } else {
                node.state = "decaying";
              }

              if (node.state === "building") node.life += (1 - node.life) * config.buildSpeed;
              else node.life += (0 - node.life) * config.decaySpeed;

              if (node.life < 0.001 && !shouldExist) {
                nodesRef.current.delete(id);
              } else if (node.life > 0.001) {
                // Find neighbors to draw links
                const neighbors = [
                  [1, 0, 0],
                  [-1, 0, 0],
                  [0, 1, 0],
                  [0, -1, 0],
                  [0, 0, 1],
                  [0, 0, -1],
                ];
                neighbors.forEach((n) => {
                  const neighborId = `${worldX + n[0] * config.gridSize},${worldY + n[1] * config.gridSize},${worldZ + n[2] * config.gridSize}`;
                  const neighbor = nodesRef.current.get(neighborId);
                  if (neighbor) {
                    nodesToDraw.push({ p1: node!, p2: neighbor, life: Math.min(node!.life, neighbor.life) });
                  }
                });
              }
            }
          }
        }
      }

      // --- 3. Drawing ---
      nodesToDraw.sort((a, b) => b.p1.z + b.p2.z - (a.p1.z + a.p2.z)); // Z-sorting

      nodesToDraw.forEach((link) => {
        const proj1 = project(link.p1, canvas.width, canvas.height);
        const proj2 = project(link.p2!, canvas.width, canvas.height);
        if (proj1.scale > 0 && proj2.scale > 0) {
          const midX = proj1.x + (proj2.x - proj1.x) * link.life;
          const midY = proj1.y + (proj2.y - proj1.y) * link.life;

          const alpha = link.life * Math.min(proj1.scale, proj2.scale) * 2;
          ctx.strokeStyle = `hsla(180, 100%, 70%, ${alpha})`;
          ctx.lineWidth = proj1.scale * 2;
          ctx.beginPath();
          ctx.moveTo(proj1.x, proj1.y);
          ctx.lineTo(midX, midY);
          ctx.stroke();
        }
      });

      if (blueprintStateRef.current.isActive) {
        const life = blueprintStateRef.current.timer / config.blueprintDuration;
        ctx.fillStyle = `hsla(220, 100%, 80%, ${life * 0.1})`;
        nodesRef.current.forEach((node) => {
          const proj = project(node, canvas.width, canvas.height);
          if (proj.scale > 0) {
            ctx.beginPath();
            ctx.arc(proj.x, proj.y, proj.scale * 2, 0, Math.PI * 2);
            ctx.fill();
          }
        });
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
