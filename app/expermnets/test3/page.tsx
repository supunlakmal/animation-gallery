"use client";
import { useEffect, useRef } from "react";

// --- Interfaces for our new Network visualization ---
interface Node {
  x: number;
  y: number;
  activity: number; // How "lit up" the node is (0 to 1)
}

interface Pulse {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  life: number;
}

export default function NeuralWebBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const nodesRef = useRef<Node[]>([]);
  const pulsesRef = useRef<Pulse[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });

  // --- Configuration for the Neural Web theme ---
  const config = {
    nodeCount: 300,
    connectionRadius: 120, // How close nodes need to be to connect
    mouseRadius: 150, // Area of influence for the mouse cursor
    activityDecay: 0.96, // How quickly nodes and lines fade (higher is slower)
    pulseSpeed: 4, // How fast the click pulse expands
    nodeColor: { r: 150, g: 220, b: 255 }, // A bright, cybernetic blue
    lineColor: { r: 100, g: 180, b: 220 }, // A slightly softer blue for connections
    backgroundColor: "rgb(15, 18, 28)", // A dark, techy background
  };

  // Function to create nodes just once
  const initializeNodes = (width: number, height: number) => {
    return Array.from({ length: config.nodeCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      activity: 0,
    }));
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      nodesRef.current = initializeNodes(canvas.width, canvas.height);
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // --- Event Handlers ---
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleClick = (e: MouseEvent) => {
      pulsesRef.current.push({
        x: e.clientX,
        y: e.clientY,
        radius: 0,
        maxRadius: 300,
        life: 1, // Will fade as it expands
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("click", handleClick);

    // --- Main Animation Loop ---
    const animate = () => {
      // 1. Clear the canvas with a solid color
      ctx.fillStyle = config.backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 2. Update and filter active pulses
      pulsesRef.current = pulsesRef.current.filter((p) => {
        p.radius += config.pulseSpeed;
        p.life = 1 - p.radius / p.maxRadius;
        return p.life > 0;
      });

      // 3. Update node activity based on mouse, pulses, and decay
      nodesRef.current.forEach((node) => {
        // Check for mouse proximity
        const dxMouse = node.x - mouseRef.current.x;
        const dyMouse = node.y - mouseRef.current.y;
        const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);

        if (distMouse < config.mouseRadius) {
          node.activity = 1;
        }

        // Check for pulse proximity
        pulsesRef.current.forEach((p) => {
          const dxPulse = node.x - p.x;
          const dyPulse = node.y - p.y;
          const distPulse = Math.sqrt(dxPulse * dxPulse + dyPulse * dyPulse);
          if (distPulse < p.radius && distPulse > p.radius - 20) {
            // Activate in a "ring"
            node.activity = Math.max(node.activity, p.life);
          }
        });

        // Apply decay
        node.activity *= config.activityDecay;
      });

      // 4. Draw connections and nodes
      for (let i = 0; i < nodesRef.current.length; i++) {
        const nodeA = nodesRef.current[i];

        // Only proceed if the node has some activity
        if (nodeA.activity > 0.01) {
          // Draw the node itself
          ctx.beginPath();
          ctx.arc(nodeA.x, nodeA.y, nodeA.activity * 2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${config.nodeColor.r}, ${config.nodeColor.g}, ${config.nodeColor.b}, ${nodeA.activity * 0.8})`;
          ctx.fill();

          // Check for connections with other nodes
          for (let j = i + 1; j < nodesRef.current.length; j++) {
            const nodeB = nodesRef.current[j];

            if (nodeB.activity > 0.01) {
              const dx = nodeA.x - nodeB.x;
              const dy = nodeA.y - nodeB.y;
              const distance = Math.sqrt(dx * dx + dy * dy);

              if (distance < config.connectionRadius) {
                // Opacity is based on the activity of both nodes and distance
                const opacity = nodeA.activity * nodeB.activity * (1 - distance / config.connectionRadius);

                if (opacity > 0.01) {
                  ctx.beginPath();
                  ctx.moveTo(nodeA.x, nodeA.y);
                  ctx.lineTo(nodeB.x, nodeB.y);
                  ctx.strokeStyle = `rgba(${config.lineColor.r}, ${config.lineColor.g}, ${config.lineColor.b}, ${opacity})`;
                  ctx.lineWidth = 1;
                  ctx.stroke();
                }
              }
            }
          }
        }
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("click", handleClick);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-10"
      style={{
        backgroundColor: config.backgroundColor,
      }}
    />
  );
}
