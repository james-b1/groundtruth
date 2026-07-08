"use client";

import { useEffect, useRef } from "react";
import { geoOrthographic, geoPath, geoGraticule } from "d3-geo";
import { feature } from "topojson-client";
import countries110m from "world-atlas/countries-110m.json";

// ISO 3166-1 numeric codes for North America
const NORTH_AMERICA = new Set([
  840, 124, 304, 484, 320, 84, 340, 222, 558, 188, 591, 192, 332, 214, 388,
  630, 44, 28, 52, 659, 670, 662, 308, 780,
]);

export function GlobeVisualization() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const SIZE = 520;
    const SCALE = SIZE / 2 - 24;
    const CX = SIZE / 2;
    const CY = SIZE / 2;

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let animId;
    let rotationOffset = 0;

    async function init() {
      const world = countries110m;
      const countries = feature(world, world.objects.countries);
      const graticule = geoGraticule().step([15, 15]);

      function draw() {
        rotationOffset += prefersReduced ? 0 : 0.018;

        const projection = geoOrthographic()
          .scale(SCALE)
          .translate([CX, CY])
          .rotate([95 + rotationOffset, -40, 0])
          .clipAngle(90);

        const path = geoPath(projection, ctx);

        ctx.clearRect(0, 0, SIZE, SIZE);

        // Ocean sphere
        const oceanGrad = ctx.createRadialGradient(
          CX - 55,
          CY - 65,
          8,
          CX,
          CY,
          SCALE
        );
        oceanGrad.addColorStop(0, "#1a3d32");
        oceanGrad.addColorStop(1, "#0f241c");
        ctx.beginPath();
        path({ type: "Sphere" });
        ctx.fillStyle = oceanGrad;
        ctx.fill();

        // Lat/lon grid
        ctx.beginPath();
        path(graticule());
        ctx.strokeStyle = "rgba(31, 77, 61, 0.12)";
        ctx.lineWidth = 0.5;
        ctx.stroke();

        // Country fills
        for (const f of countries.features) {
          const id = parseInt(f.id, 10);
          const isNA = NORTH_AMERICA.has(id);

          ctx.beginPath();
          path(f);

          if (isNA) {
            ctx.fillStyle = "rgba(31, 77, 61, 0.75)";
            ctx.strokeStyle = "rgba(22, 56, 44, 0.5)";
            ctx.lineWidth = 0.6;
          } else {
            ctx.fillStyle = "rgba(31, 77, 61, 0.15)";
            ctx.strokeStyle = "rgba(31, 77, 61, 0.25)";
            ctx.lineWidth = 0.4;
          }

          ctx.fill();
          ctx.stroke();
        }

        // Soft emerald glow over NA region
        const naGlow = ctx.createRadialGradient(
          CX - 10,
          CY - 20,
          0,
          CX - 10,
          CY - 20,
          SCALE * 0.58
        );
        naGlow.addColorStop(0, "rgba(31, 77, 61, 0.12)");
        naGlow.addColorStop(1, "rgba(31, 77, 61, 0)");
        ctx.beginPath();
        path({ type: "Sphere" });
        ctx.fillStyle = naGlow;
        ctx.fill();

        // Specular highlight
        const spec = ctx.createRadialGradient(
          CX - 95,
          CY - 95,
          0,
          CX - 95,
          CY - 95,
          190
        );
        spec.addColorStop(0, "rgba(255,255,255,0.06)");
        spec.addColorStop(1, "rgba(255,255,255,0)");
        ctx.beginPath();
        path({ type: "Sphere" });
        ctx.fillStyle = spec;
        ctx.fill();

        // Atmosphere ring
        const atmo = ctx.createRadialGradient(
          CX,
          CY,
          SCALE - 4,
          CX,
          CY,
          SCALE + 26
        );
        atmo.addColorStop(0, "rgba(31, 77, 61, 0.15)");
        atmo.addColorStop(0.5, "rgba(31, 77, 61, 0.06)");
        atmo.addColorStop(1, "rgba(31, 77, 61, 0)");
        ctx.beginPath();
        ctx.arc(CX, CY, SCALE + 26, 0, Math.PI * 2);
        ctx.fillStyle = atmo;
        ctx.fill();

        // Globe rim
        ctx.beginPath();
        path({ type: "Sphere" });
        ctx.strokeStyle = "rgba(31, 77, 61, 0.2)";
        ctx.lineWidth = 1.5;
        ctx.stroke();

        animId = prefersReduced ? null : requestAnimationFrame(draw);
      }

      draw();
      if (prefersReduced) return;
    }

    init();
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={520}
      height={520}
      style={{ width: "100%", height: "auto", display: "block" }}
    />
  );
}
