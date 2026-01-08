"use client";
import { useEffect, useRef } from "react";

export default function NeonVoid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let frame = 0;
    
    // Synthwave / Retro grid parameters
    const horizon = height * 0.4;
    const gridSize = 40;
    const speed = 2;
    let offset = 0;

    const animate = () => {
      ctx.fillStyle = "#050510";
      ctx.fillRect(0, 0, width, height);

      // Draw Sun
      const sunGradient = ctx.createLinearGradient(width / 2, horizon - 150, width / 2, horizon);
      sunGradient.addColorStop(0, "#ffcc00");
      sunGradient.addColorStop(0.5, "#ff3366");
      sunGradient.addColorStop(1, "#9900cc");
      
      ctx.fillStyle = sunGradient;
      ctx.beginPath();
      ctx.arc(width / 2, horizon - 50, 100, 0, Math.PI * 2);
      ctx.fill();

      // Sun bars (retro style)
      ctx.fillStyle = "#050510";
      for(let i=0; i<5; i++) {
        const barHeight = 4 + i * 3;
        const barY = horizon - 50 + 20 + i * 15;
        ctx.fillRect(width/2 - 110, barY, 220, barHeight);
      }


      // Grid Perspective
      ctx.save();
      
      // Moving floor lines
      offset = (offset + speed) % gridSize;
      
      ctx.strokeStyle = "#ff00dd";
      ctx.lineWidth = 2;
      ctx.shadowBlur = 10;
      ctx.shadowColor = "#ff00dd";

      // Horizontal lines
      // We want them to get closer together as they go to horizon
      // Simple perspective simulation
      for (let i = 0; i < height - horizon; i+=gridSize) {
        // Linear spacing in 2D is wrong for 3D perspective, but for 'retro' feel linear + acceleration is ok
        // Let's do a simple 3D projection look
        // Fake z depth calc skipped for retro simplicity
      }

      // Draw Vertical Lines (converging to center)
      const centerX = width / 2;
      // Draw grid floor
      for(let z=0; z<2000; z+=gridSize * 2) {
          const depth = (z - offset) % 1000; // loop
          if(depth < 1) continue;
          
          // Horizontal moving lines
         // This is getting complicated to do purely from scratch in one go conceptually.
         // Let's stick to a simpler "Lines moving down" approach for the floor.
      }
      
      // Simpler approach: 
      // Draw vertical lines converging to (centerX, horizon)
      ctx.beginPath();
      for(let x = -width; x < width * 2; x+=100) {
          ctx.moveTo(x, height);
          ctx.lineTo(centerX, horizon);
      }
      ctx.stroke();

      // Draw horizontal lines moving down
      offset = (frame * speed) % 50;
      for(let y = horizon; y < height; y += (y - horizon) * 0.1 + 2) {
         // This creates exponential spacing
         const drawY = y + offset * ((y-horizon)/200); // Scale moment by depth
         if(drawY > height) continue;
         
         ctx.beginPath();
         // We simply draw a straight line
         ctx.moveTo(0, drawY);
         ctx.lineTo(width, drawY);
         ctx.stroke();
      }


      ctx.restore();
      
      frame++;
      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);

  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 bg-black" />;
}
