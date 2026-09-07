"use client";

import { useEffect, useRef } from "react";

type Point = { x: number; y: number; vx: number; vy: number };

/**
 * Quiet animated point network — slow drift, thin lines, low opacity.
 * Nearby points draw a line to the cursor; the whole network eases into a
 * light parallax offset and settles back to neutral when the pointer leaves.
 * No-op on reduced-motion or if canvas isn't supported.
 */
export function NetworkCanvas({
  density = 0.00009,
  maxDist = 140,
  speed = 0.12,
  color = "197, 199, 201",
  parallax = false,
  className = "",
}: {
  density?: number;
  maxDist?: number;
  speed?: number;
  color?: string;
  parallax?: boolean;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    if (!canvas || !parent || !canvas.getContext) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = canvas.getContext("2d")!;
    let points: Point[] = [];
    let width = 0;
    let height = 0;
    let rafId = 0;
    let resizeTimer: ReturnType<typeof setTimeout>;
    const mouse: { x: number | null; y: number | null } = { x: null, y: null };
    const offset = { x: 0, y: 0 };
    const interactRadius = maxDist * 1.4;

    function resize() {
      const rect = parent!.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas!.width = width * dpr;
      canvas!.height = height * dpr;
      canvas!.style.width = `${width}px`;
      canvas!.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.round(width * height * density);
      points = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * speed,
        vy: (Math.random() - 0.5) * speed,
      }));
    }

    function onPointerMove(e: PointerEvent) {
      const rect = canvas!.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    }
    function onPointerLeave() {
      mouse.x = null;
      mouse.y = null;
    }
    function onScroll() {
      const rect = parent!.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;
      canvas!.style.transform = `translateY(${window.scrollY * 0.12}px)`;
    }
    function onResize() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        cancelAnimationFrame(rafId);
        resize();
        tick();
      }, 200);
    }

    function tick() {
      const targetX = mouse.x !== null ? (mouse.x / width - 0.5) * -18 : 0;
      const targetY = mouse.y !== null ? (mouse.y / height - 0.5) * -18 : 0;
      offset.x += (targetX - offset.x) * 0.06;
      offset.y += (targetY - offset.y) * 0.06;

      ctx.clearRect(0, 0, width, height);
      ctx.save();
      ctx.translate(offset.x, offset.y);

      points.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
      });

      for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
          const dx = points[i].x - points[j].x;
          const dy = points[i].y - points[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDist) {
            ctx.strokeStyle = `rgba(${color}, ${(1 - dist / maxDist) * 0.35})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(points[i].x, points[i].y);
            ctx.lineTo(points[j].x, points[j].y);
            ctx.stroke();
          }
        }

        if (mouse.x !== null && mouse.y !== null) {
          const mdx = points[i].x - mouse.x;
          const mdy = points[i].y - mouse.y;
          const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
          if (mdist < interactRadius) {
            ctx.strokeStyle = `rgba(${color}, ${(1 - mdist / interactRadius) * 0.55})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(points[i].x, points[i].y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
          }
        }

        ctx.fillStyle = `rgba(${color}, 0.5)`;
        ctx.beginPath();
        ctx.arc(points[i].x, points[i].y, 1.4, 0, Math.PI * 2);
        ctx.fill();
      }

      if (mouse.x !== null && mouse.y !== null) {
        ctx.fillStyle = `rgba(${color}, 0.85)`;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 2, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
      rafId = requestAnimationFrame(tick);
    }

    resize();
    tick();

    parent.addEventListener("pointermove", onPointerMove, { passive: true });
    parent.addEventListener("pointerleave", onPointerLeave, { passive: true });
    window.addEventListener("resize", onResize);
    if (parallax) window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(resizeTimer);
      parent.removeEventListener("pointermove", onPointerMove);
      parent.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("resize", onResize);
      if (parallax) window.removeEventListener("scroll", onScroll);
    };
  }, [density, maxDist, speed, color, parallax]);

  return <canvas ref={canvasRef} aria-hidden="true" className={className} />;
}
