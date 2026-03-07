"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  speed: number;
  size: number;
  opacity: number;
  color: string;
}

const COLORS = ["#34d399", "#22d3ee", "#818cf8"];

export function DataFlowAnimation({ direction = "horizontal" }: { direction?: "horizontal" | "vertical" }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let particles: Particle[] = [];
    let w = 0;
    let h = 0;

    function resize() {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas!.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas!.width = w * dpr;
      canvas!.height = h * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function init() {
      resize();
      const count = Math.floor((w * h) / 8000);
      particles = Array.from({ length: Math.min(count, 60) }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        speed: 0.2 + Math.random() * 0.6,
        size: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.4 + 0.1,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      }));
    }

    function draw() {
      ctx!.clearRect(0, 0, w, h);

      for (const p of particles) {
        if (direction === "horizontal") {
          p.x += p.speed;
          if (p.x > w + 10) {
            p.x = -10;
            p.y = Math.random() * h;
          }
        } else {
          p.y += p.speed;
          if (p.y > h + 10) {
            p.y = -10;
            p.x = Math.random() * w;
          }
        }

        // Draw particle with trail
        const trailLen = direction === "horizontal" ? p.speed * 12 : 0;
        const trailLenY = direction === "vertical" ? p.speed * 12 : 0;

        if (trailLen > 0 || trailLenY > 0) {
          const grad = ctx!.createLinearGradient(
            p.x - trailLen, p.y - trailLenY,
            p.x, p.y
          );
          grad.addColorStop(0, "transparent");
          grad.addColorStop(1, p.color);
          ctx!.beginPath();
          ctx!.moveTo(p.x - trailLen, p.y - trailLenY);
          ctx!.lineTo(p.x, p.y);
          ctx!.strokeStyle = grad;
          ctx!.globalAlpha = p.opacity * 0.6;
          ctx!.lineWidth = p.size * 0.8;
          ctx!.stroke();
        }

        // Particle dot
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx!.globalAlpha = p.opacity;
        ctx!.fillStyle = p.color;
        ctx!.fill();
      }

      ctx!.globalAlpha = 1;
      animId = requestAnimationFrame(draw);
    }

    init();
    draw();
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, [direction]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.4 }}
    />
  );
}
