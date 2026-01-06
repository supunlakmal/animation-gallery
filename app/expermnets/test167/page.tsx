"use client";

import { useEffect, useRef } from "react";

export default function Confetti() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // No need for state to track clicks in loop usually, can push to array directly

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);
    resize();

    interface ConfettiPiece {
        x: number;
        y: number;
        vx: number;
        vy: number;
        color: string;
        rotation: number;
        vRotation: number;
        scale: number;
    }

    const confettis: ConfettiPiece[] = [];
    const gravity = 0.2;

    const createBurst = (x: number, y: number) => {
        for(let i=0; i<50; i++) {
            confettis.push({
                x, y,
                vx: (Math.random() - 0.5) * 15,
                vy: (Math.random() - 1) * 15 - 5,
                color: `hsl(${Math.random()*360}, 100%, 50%)`,
                rotation: Math.random() * 360,
                vRotation: (Math.random() - 0.5) * 10,
                scale: Math.random() + 0.5
            });
        }
    };

    const draw = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear transparent

        for (let i = confettis.length - 1; i >= 0; i--) {
            const c = confettis[i];
            c.x += c.vx;
            c.y += c.vy;
            c.vy += gravity;
            c.rotation += c.vRotation;
            
            // Air resistance
            c.vx *= 0.96;
            
            ctx.save();
            ctx.translate(c.x, c.y);
            ctx.rotate(c.rotation * Math.PI / 180);
            ctx.fillStyle = c.color;
            ctx.fillRect(-5 * c.scale, -3 * c.scale, 10 * c.scale, 6 * c.scale);
            ctx.restore();

            if (c.y > canvas.height + 20) {
                confettis.splice(i, 1);
            }
        }

        animationId = requestAnimationFrame(draw);
    };

    draw();

    const handleClick = (e: MouseEvent) => createBurst(e.clientX, e.clientY);
    window.addEventListener("click", handleClick);
    
    // Auto burst
    const interval = setInterval(() => {
        createBurst(canvas.width/2, canvas.height/2);
    }, 2000);

    return () => {
        window.removeEventListener("resize", resize);
        window.removeEventListener("click", handleClick);
        clearInterval(interval);
        cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full bg-white cursor-pointer">
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-400 text-xl font-bold select-none pointer-events-none">
             Click Me
         </div>
         <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
}
