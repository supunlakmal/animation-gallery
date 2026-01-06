"use client";

import { useEffect, useRef } from "react";

export default function GameOfLife() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;

    const cellSize = 10;
    let cols = 0;
    let rows = 0;
    let grid: number[][] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      cols = Math.ceil(canvas.width / cellSize);
      rows = Math.ceil(canvas.height / cellSize);
      initGrid();
    };
    
    const initGrid = () => {
        grid = new Array(cols).fill(0).map(() => 
            new Array(rows).fill(0).map(() => Math.round(Math.random()))
        );
    };

    window.addEventListener("resize", resize);
    resize();

    const draw = () => {
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const nextGrid = grid.map(arr => [...arr]); // Deepish copy

        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
                const state = grid[i][j];
                
                // Count neighbors
                let sum = 0;
                for (let x = -1; x < 2; x++) {
                    for (let y = -1; y < 2; y++) {
                        const col = (i + x + cols) % cols;
                        const row = (j + y + rows) % rows;
                        sum += grid[col][row];
                    }
                }
                sum -= state;

                // Rules
                if (state === 0 && sum === 3) {
                    nextGrid[i][j] = 1;
                } else if (state === 1 && (sum < 2 || sum > 3)) {
                    nextGrid[i][j] = 0;
                } else {
                    nextGrid[i][j] = state;
                }

                if (grid[i][j] === 1) {
                    ctx.fillStyle = "#0F0";
                    ctx.fillRect(i * cellSize, j * cellSize, cellSize - 1, cellSize - 1);
                }
            }
        }

        grid = nextGrid;

        // Slow down? Nah, full speed
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
