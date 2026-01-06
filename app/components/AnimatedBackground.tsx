"use client";
import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  depth: number;
}

export default function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const smoothedMouseRef = useRef({ x: 0, y: 0 });
  const animationFrameRef = useRef<number | undefined>(undefined);
  const clickBoostRef = useRef({ active: false, x: 0, y: 0, timestamp: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Particle system configuration
    const particles: Particle[] = [];
    const connectionDistance = 150;
    const mouseInfluence = 100;

    const getParticleCount = () => {
      const w = window.innerWidth;
      if (w >= 1024) return 400; // desktop
      if (w >= 768) return 100; // tablet
      return 100; // mobile
    };

    let particleCount = getParticleCount();

    const initParticles = (count: number) => {
      particles.length = 0;
      for (let i = 0; i < count; i++) {
        const depth = Math.random() * 0.5 + 0.5; // 0.5 to 1.0
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.8,
          vy: (Math.random() - 0.5) * 0.8,
          radius: Math.random() * 2 + 1,
          depth: depth,
        });
      }
    };

    // Initialize particles
    initParticles(particleCount);

    // Mouse move handler
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", handleMouseMove);

    // Click handler for 3x speed boost
    const handleClick = (e: MouseEvent) => {
      clickBoostRef.current = {
        active: true,
        x: e.clientX,
        y: e.clientY,
        timestamp: Date.now(),
      };
    };
    window.addEventListener("click", handleClick);

    // Animation loop
    const animate = () => {
      ctx.fillStyle = "rgba(227, 227, 225, 0.1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Smooth mouse position with lerping
      smoothedMouseRef.current.x += (mouseRef.current.x - smoothedMouseRef.current.x) * 0.1;
      smoothedMouseRef.current.y += (mouseRef.current.y - smoothedMouseRef.current.y) * 0.1;

      // Calculate click boost multiplier (3x for 800ms after click)
      let speedMultiplier = 1;
      if (clickBoostRef.current.active) {
        const elapsed = Date.now() - clickBoostRef.current.timestamp;
        if (elapsed < 800) {
          // 3x speed boost that decays over 800ms
          speedMultiplier = 3 - (elapsed / 800) * 2; // Decays from 3 to 1
        } else {
          clickBoostRef.current.active = false;
        }
      }

      // Draw and update particles
      particles.forEach((particle) => {
        // Mouse interaction with smoothed position
        const dx = smoothedMouseRef.current.x - particle.x;
        const dy = smoothedMouseRef.current.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouseInfluence) {
          const force = (mouseInfluence - distance) / mouseInfluence;
          // Apply speed multiplier (3x on click) to repulsion force
          particle.vx -= (dx / distance) * force * 0.2 * speedMultiplier;
          particle.vy -= (dy / distance) * force * 0.2 * speedMultiplier;
        }

        // Update position with depth-based parallax
        particle.x += particle.vx * particle.depth;
        particle.y += particle.vy * particle.depth;

        // Add friction (reduced from 0.99 to 0.97 for faster movement)
        particle.vx *= 0.97;
        particle.vy *= 0.97;

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Keep minimum velocity (increased for more dynamic movement)
        const speed = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy);
        if (speed < 0.15) {
          particle.vx += (Math.random() - 0.5) * 0.15;
          particle.vy += (Math.random() - 0.5) * 0.15;
        }

        // Calculate grayscale brightness based on speed
        const speedBrightness = Math.min(80, 30 + speed * 100); // Faster = brighter gray

        // Apply depth to size and opacity
        const depthRadius = particle.radius * particle.depth;
        const depthOpacity = 0.4 + particle.depth * 0.6; // 0.4 to 1.0

        // Add subtle glow effect scaled by depth
        const glowIntensity = Math.min(15, 8 + speed * 20) * particle.depth;
        ctx.shadowBlur = glowIntensity;
        ctx.shadowColor = `rgba(0, 0, 0, ${depthOpacity * 0.5})`;

        // Draw particle with grayscale color
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, depthRadius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${speedBrightness}, ${speedBrightness}, ${speedBrightness}, ${depthOpacity})`;
        ctx.fill();

        // Reset shadow to avoid affecting other drawings
        ctx.shadowBlur = 0;
      });

      // Spatial partitioning: Create grid-based spatial hash for efficient neighbor lookup
      const cellSize = connectionDistance;
      const grid = new Map<string, Particle[]>();

      // Populate grid
      particles.forEach((particle) => {
        const cellX = Math.floor(particle.x / cellSize);
        const cellY = Math.floor(particle.y / cellSize);
        const key = `${cellX},${cellY}`;

        if (!grid.has(key)) {
          grid.set(key, []);
        }
        grid.get(key)!.push(particle);
      });

      // Draw connections between particles using spatial partitioning
      const drawnConnections = new Set<string>();

      particles.forEach((particle) => {
        const cellX = Math.floor(particle.x / cellSize);
        const cellY = Math.floor(particle.y / cellSize);

        // Check current cell and adjacent cells (3x3 grid)
        for (let offsetX = -1; offsetX <= 1; offsetX++) {
          for (let offsetY = -1; offsetY <= 1; offsetY++) {
            const key = `${cellX + offsetX},${cellY + offsetY}`;
            const nearbyParticles = grid.get(key);

            if (nearbyParticles) {
              nearbyParticles.forEach((other) => {
                if (particle === other) return;

                // Create unique connection ID to avoid drawing duplicates
                const connectionId =
                  particle.x < other.x || (particle.x === other.x && particle.y < other.y)
                    ? `${particle.x},${particle.y}-${other.x},${other.y}`
                    : `${other.x},${other.y}-${particle.x},${particle.y}`;

                if (drawnConnections.has(connectionId)) return;

                const dx = particle.x - other.x;
                const dy = particle.y - other.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < connectionDistance) {
                  drawnConnections.add(connectionId);

                  const opacity = (1 - distance / connectionDistance) * 0.25;

                  ctx.beginPath();
                  ctx.moveTo(particle.x, particle.y);
                  ctx.lineTo(other.x, other.y);
                  ctx.strokeStyle = `rgba(60, 60, 60, ${opacity})`;
                  ctx.lineWidth = 0.5;
                  ctx.stroke();
                }
              });
            }
          }
        }
      });

      // Subtle glow effect near mouse with smoothed position
      const mouseGradient = ctx.createRadialGradient(
        smoothedMouseRef.current.x,
        smoothedMouseRef.current.y,
        0,
        smoothedMouseRef.current.x,
        smoothedMouseRef.current.y,
        150
      );
      mouseGradient.addColorStop(0, "rgba(40, 40, 40, 0.04)");
      mouseGradient.addColorStop(1, "rgba(40, 40, 40, 0)");
      ctx.fillStyle = mouseGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Handle resize that may require reinitializing particles when crossing breakpoints
    const handleResizeBreakpoint = () => {
      // keep canvas sizing as before
      resizeCanvas();
      const newCount = getParticleCount();
      if (newCount !== particleCount) {
        particleCount = newCount;
        initParticles(particleCount);
      }
    };
    // Listen for breakpoint-aware resize
    window.addEventListener("resize", handleResizeBreakpoint);

    // Cleanup
    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("resize", handleResizeBreakpoint);
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
      className="fixed top-0 left-0 w-full h-full cursor-pointer"
      style={{
        background: "linear-gradient(135deg, #e3e3e1 0%, #d5d5d3 100%)",
        zIndex: 0,
      }}
    />
  );
}
