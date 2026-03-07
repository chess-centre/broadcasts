"use client";

import { useEffect, useRef } from "react";

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  pulse: number;
}

interface Pulse {
  fromIdx: number;
  toIdx: number;
  progress: number;
  speed: number;
  color: string;
}

const COLORS = {
  node: "rgba(52, 211, 153, 0.6)",
  nodePulse: "rgba(52, 211, 153, 0.9)",
  line: "rgba(52, 211, 153, 0.06)",
  lineActive: "rgba(52, 211, 153, 0.15)",
  pulseGreen: "#34d399",
  pulseCyan: "#22d3ee",
  pulseIndigo: "#818cf8",
};

const PULSE_COLORS = [COLORS.pulseGreen, COLORS.pulseCyan, COLORS.pulseIndigo];

export function NetworkAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let nodes: Node[] = [];
    let pulses: Pulse[] = [];
    let w = 0;
    let h = 0;

    const NODE_COUNT = 40;
    const MAX_DIST = 200;

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
      nodes = Array.from({ length: NODE_COUNT }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        radius: Math.random() * 1.5 + 0.5,
        pulse: Math.random() * Math.PI * 2,
      }));
      pulses = [];
    }

    function spawnPulse() {
      if (pulses.length > 12) return;
      const fromIdx = Math.floor(Math.random() * nodes.length);
      let toIdx = fromIdx;
      let bestDist = Infinity;
      // Find a nearby node
      for (let i = 0; i < nodes.length; i++) {
        if (i === fromIdx) continue;
        const dx = nodes[i].x - nodes[fromIdx].x;
        const dy = nodes[i].y - nodes[fromIdx].y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < MAX_DIST && d < bestDist && Math.random() > 0.5) {
          bestDist = d;
          toIdx = i;
        }
      }
      if (toIdx !== fromIdx) {
        pulses.push({
          fromIdx,
          toIdx,
          progress: 0,
          speed: 0.008 + Math.random() * 0.012,
          color: PULSE_COLORS[Math.floor(Math.random() * PULSE_COLORS.length)],
        });
      }
    }

    function draw() {
      ctx!.clearRect(0, 0, w, h);

      // Update nodes
      for (const node of nodes) {
        node.x += node.vx;
        node.y += node.vy;
        node.pulse += 0.02;
        if (node.x < 0 || node.x > w) node.vx *= -1;
        if (node.y < 0 || node.y > h) node.vy *= -1;
      }

      // Draw connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[j].x - nodes[i].x;
          const dy = nodes[j].y - nodes[i].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < MAX_DIST) {
            const alpha = 1 - d / MAX_DIST;
            ctx!.beginPath();
            ctx!.moveTo(nodes[i].x, nodes[i].y);
            ctx!.lineTo(nodes[j].x, nodes[j].y);
            ctx!.strokeStyle = `rgba(52, 211, 153, ${0.04 * alpha})`;
            ctx!.lineWidth = 0.5;
            ctx!.stroke();
          }
        }
      }

      // Draw nodes
      for (const node of nodes) {
        const glow = 0.5 + 0.5 * Math.sin(node.pulse);
        ctx!.beginPath();
        ctx!.arc(node.x, node.y, node.radius + glow, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(52, 211, 153, ${0.15 + 0.25 * glow})`;
        ctx!.fill();

        ctx!.beginPath();
        ctx!.arc(node.x, node.y, node.radius * 0.5, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(52, 211, 153, ${0.4 + 0.4 * glow})`;
        ctx!.fill();
      }

      // Draw and update pulses
      for (let i = pulses.length - 1; i >= 0; i--) {
        const p = pulses[i];
        p.progress += p.speed;
        if (p.progress >= 1) {
          pulses.splice(i, 1);
          continue;
        }

        const from = nodes[p.fromIdx];
        const to = nodes[p.toIdx];
        const x = from.x + (to.x - from.x) * p.progress;
        const y = from.y + (to.y - from.y) * p.progress;

        // Pulse trail
        const trailLen = 0.15;
        const trailStart = Math.max(0, p.progress - trailLen);
        const gradient = ctx!.createLinearGradient(
          from.x + (to.x - from.x) * trailStart,
          from.y + (to.y - from.y) * trailStart,
          x,
          y
        );
        gradient.addColorStop(0, "transparent");
        gradient.addColorStop(1, p.color);

        ctx!.beginPath();
        ctx!.moveTo(
          from.x + (to.x - from.x) * trailStart,
          from.y + (to.y - from.y) * trailStart
        );
        ctx!.lineTo(x, y);
        ctx!.strokeStyle = gradient;
        ctx!.lineWidth = 1.5;
        ctx!.stroke();

        // Pulse head glow
        ctx!.beginPath();
        ctx!.arc(x, y, 3, 0, Math.PI * 2);
        ctx!.fillStyle = p.color;
        ctx!.fill();

        // Outer glow
        const glowGrad = ctx!.createRadialGradient(x, y, 0, x, y, 12);
        glowGrad.addColorStop(0, p.color + "40");
        glowGrad.addColorStop(1, "transparent");
        ctx!.beginPath();
        ctx!.arc(x, y, 12, 0, Math.PI * 2);
        ctx!.fillStyle = glowGrad;
        ctx!.fill();

        // Light up the connection line
        ctx!.beginPath();
        ctx!.moveTo(from.x, from.y);
        ctx!.lineTo(to.x, to.y);
        ctx!.strokeStyle = `${p.color}18`;
        ctx!.lineWidth = 1;
        ctx!.stroke();
      }

      // Spawn new pulses randomly
      if (Math.random() < 0.06) spawnPulse();

      animId = requestAnimationFrame(draw);
    }

    init();
    draw();

    window.addEventListener("resize", () => {
      resize();
    });

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.7 }}
    />
  );
}
