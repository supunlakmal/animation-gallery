"use client";
import { useEffect, useRef } from "react";

export default function ZenGarden() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Procedural Fractal Tree / Vines
    
    // Config
    const maxDepth = 10;
    // We want it to grow over time.
    
    // Actually, let's do L-system style or just recursive drawing that slowly expands.
    // To make it persistent and growing, we need to track state.

    interface Branch {
        x: number;
        y: number;
        angle: number;
        length: number;
        depth: number;
        width: number;
        color: string;
        finished: boolean;
        growth: number; // 0 to 1
    }
    
    let activeBranches: Branch[] = [];
    
    const startTree = () => {
        activeBranches = [];
        // Start from bottom center
        activeBranches.push({
            x: width / 2,
            y: height,
            angle: -Math.PI / 2, // Up
            length: 150,
            depth: 0,
            width: 15,
            color: 'rgb(100, 80, 60)',
            finished: false,
            growth: 0
        });
        
        ctx.fillStyle = '#f0f0f0'; // Paper color
        ctx.fillRect(0,0,width,height);
    };
    
    const animate = () => {
        // We only draw updates, not clear rect, to persist the tree
        
        // Randomly pick an active branch to grow? No, grow all active ones
        
        // Check if we need to spawn children
        for(let i = activeBranches.length - 1; i >= 0; i--) {
            const b = activeBranches[i];
            
            // Draw current segment
            // We draw a small line segment corresponding to current growth
            // This is tricky without clearing.
            // Better: calculate the tip position based on growth
            
            const prevGrowth = b.growth;
            b.growth += 0.02; // growth speed
            
            if (b.growth > 1) b.growth = 1;
            
            // Calculate segments
            const startX = b.x + Math.cos(b.angle) * b.length * prevGrowth;
            const startY = b.y + Math.sin(b.angle) * b.length * prevGrowth;
            
            const endX = b.x + Math.cos(b.angle) * b.length * b.growth;
            const endY = b.y + Math.sin(b.angle) * b.length * b.growth;
            
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(endX, endY);
            ctx.strokeStyle = `rgba(60, 40, 30, ${1 - b.depth/maxDepth})`;
            // ctx.strokeStyle = "black";
            ctx.lineWidth = b.width * (1 - b.growth * 0.5); // Tapering
            ctx.lineCap = "round";
            ctx.stroke();
            
            
            // If finished growing, spawn children
            if (b.growth >= 1 && !b.finished) {
                b.finished = true;
                activeBranches.splice(i, 1); // Remove from active list
                
                if (b.depth < maxDepth) {
                    // Spawn 2 branches
                    const numSub = 2;
                    for(let j=0; j<numSub; j++) {
                        const angleOffset = (Math.random() - 0.5) * Math.PI / 2;
                        activeBranches.push({
                            x: endX,
                            y: endY,
                            angle: b.angle + angleOffset,
                            length: b.length * 0.75,
                            depth: b.depth + 1,
                            width: b.width * 0.7,
                            color: b.color,
                            finished: false,
                            growth: 0
                        });
                    }
                    
                    // Add leaves?
                    if (b.depth > 4) {
                         if(Math.random() > 0.5){
                            ctx.beginPath();
                            ctx.fillStyle = `rgba(${Math.random()*50 + 50}, ${Math.random()*100+100}, 50, 0.6)`;
                            ctx.arc(endX, endY, 5, 0, Math.PI*2);
                            ctx.fill();
                         }
                    }
                }
            }
        }

        if (activeBranches.length > 0) {
            requestAnimationFrame(animate); 
        } else {
             // Restart on click? or loop?
             // setTimeout(startTree, 3000);
        }
    };
    
    startTree();
    animate();

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      startTree();
      animate();
    };
    
    const handleClick = () => {
        startTree();
        animate();
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("click", handleClick);
    return () => {
        window.removeEventListener("resize", handleResize);
        window.removeEventListener("click", handleClick);
    };

  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 bg-[#f0f0f0]" />;
}
