"use client";

import { useEffect, useRef } from "react";

interface Point {
  x: number;
  y: number;
  originX: number;
  originY: number;
  vx: number;
  vy: number;
}

export default function ElasticNetwork() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>(0);
  const pointsRef = useRef<Point[]>([]);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const imagePatternRef = useRef<number[]>([]);

  const config = {
    spacing: 40,
    mouseDist: 150,
    stiffness: 0.05,
    damping: 0.9,
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let cols = Math.ceil(width / config.spacing) + 1;
    let rows = Math.ceil(height / config.spacing) + 1;

    const mouse = { x: -1000, y: -1000 };

    // Load images
    const imageCount = 17;
    let imagesLoaded = 0;
    
    for (let i = 1; i <= imageCount; i++) {
      const img = new Image();
      img.src = `/icons/1 (${i}).jpg`;
      img.onload = () => {
        imagesLoaded++;
        if (imagesLoaded === imageCount && !animationFrameRef.current) {
          animate();
        }
      };
      imagesRef.current.push(img);
    }

    const initPoints = () => {
      pointsRef.current = [];
      imagePatternRef.current = [];
      cols = Math.ceil(width / config.spacing) + 1;
      rows = Math.ceil(height / config.spacing) + 1;
      
      // Create random image pattern
      const totalCells = (cols - 1) * (rows - 1);
      for (let i = 0; i < totalCells; i++) {
        imagePatternRef.current.push(Math.floor(Math.random() * imageCount));
      }
      
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            const x = i * config.spacing;
            const y = j * config.spacing;
            pointsRef.current.push({
                x, y,
                originX: x,
                originY: y,
                vx: 0,
                vy: 0
            });
        }
      }
    };

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initPoints();
    };

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    initPoints();

    const animate = () => {
      // Clear with black background
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, width, height);

      pointsRef.current.forEach((p, idx) => {
         // Spring force to origin
         const ex = p.originX - p.x;
         const ey = p.originY - p.y;
         
         const ax = ex * config.stiffness;
         const ay = ey * config.stiffness;
         
         p.vx += ax;
         p.vy += ay;
         
         // Mouse repulsion
         const dx = p.x - mouse.x;
         const dy = p.y - mouse.y;
         const dist = Math.sqrt(dx * dx + dy * dy);
         
         if (dist < config.mouseDist) {
             const angle = Math.atan2(dy, dx);
             const force = (config.mouseDist - dist) / config.mouseDist;
             const push = force * 5;
             
             p.vx += Math.cos(angle) * push;
             p.vy += Math.sin(angle) * push;
         }
         
         p.vx *= config.damping;
         p.vy *= config.damping;
         
         p.x += p.vx;
         p.y += p.vy;
      });
      
      // Draw image-filled grid cells
      let cellIndex = 0;
      for (let i = 0; i < cols - 1; i++) {
          for (let j = 0; j < rows - 1; j++) {
              const idx = i * rows + j;
              const p1 = pointsRef.current[idx];
              const p2 = pointsRef.current[idx + 1];
              const p3 = pointsRef.current[idx + rows];
              const p4 = pointsRef.current[idx + rows + 1];
              
              if (!p1 || !p2 || !p3 || !p4) continue;

              const imageIndex = imagePatternRef.current[cellIndex];
              const img = imagesRef.current[imageIndex];
              
              if (img && img.complete) {
                // Save context state
                ctx.save();
                
                // Create clipping path for the deformed cell
                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.lineTo(p4.x, p4.y);
                ctx.lineTo(p3.x, p3.y);
                ctx.closePath();
                ctx.clip();
                
                // Calculate bounding box of the deformed cell
                const minX = Math.min(p1.x, p2.x, p3.x, p4.x);
                const maxX = Math.max(p1.x, p2.x, p3.x, p4.x);
                const minY = Math.min(p1.y, p2.y, p3.y, p4.y);
                const maxY = Math.max(p1.y, p2.y, p3.y, p4.y);
                const cellWidth = maxX - minX;
                const cellHeight = maxY - minY;
                
                // Draw image to fill the cell
                ctx.drawImage(img, minX, minY, cellWidth, cellHeight);
                
                // Restore context
                ctx.restore();
                
                // Draw subtle border
                ctx.strokeStyle = "rgba(0, 0, 0, 0.3)";
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.lineTo(p4.x, p4.y);
                ctx.lineTo(p3.x, p3.y);
                ctx.closePath();
                ctx.stroke();
              }
              
              cellIndex++;
          }
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    // Animation will start once all images are loaded
    if (imagesLoaded === imageCount) {
      animate();
    }

    return () => {
      window.removeEventListener("resize", resize);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
    // Intentionally run once on mount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full bg-black" />;
}
