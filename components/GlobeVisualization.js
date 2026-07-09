"use client";

import { useEffect, useRef } from "react";
import { geoOrthographic, geoPath, geoGraticule } from "d3-geo";
import { feature } from "topojson-client";
import countries110m from "world-atlas/countries-110m.json";

// ISO 3166-1 numeric codes for North America
const NORTH_AMERICA = new Set([
  840, 124, 304, 484, 320, 84, 340, 222, 558, 188, 591,
  192, 332, 214, 388, 630, 44, 28, 52, 659, 670, 662, 308, 780,
]);

export function GlobeVisualization() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const SIZE = 520;
    const SCALE = SIZE / 2 - 18;
    const CX = SIZE / 2;
    const CY = SIZE / 2;

    const prefersReduced =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let animationId;
    let rotation = 0;

    const world = countries110m;
    const countries = feature(world, world.objects.countries);
    const graticule = geoGraticule().step([15, 15]);

    function draw() {
      rotation += prefersReduced ? 0 : 0.018;

      const projection = geoOrthographic()
        .scale(SCALE)
        .translate([CX, CY])
        .rotate([95 + rotation, -38, 0])
        .clipAngle(90);

      const path = geoPath(projection, ctx);

      ctx.clearRect(0, 0, SIZE, SIZE);

      //
      // Atmosphere
      //
      const atmosphere = ctx.createRadialGradient(
        CX,
        CY,
        SCALE - 5,
        CX,
        CY,
        SCALE + 22
      );

      atmosphere.addColorStop(0, "rgba(120,200,255,0.18)");
      atmosphere.addColorStop(0.6, "rgba(120,200,255,0.07)");
      atmosphere.addColorStop(1, "rgba(120,200,255,0)");

      ctx.beginPath();
      ctx.arc(CX, CY, SCALE + 22, 0, Math.PI * 2);
      ctx.fillStyle = atmosphere;
      ctx.fill();

      //
      // Ocean
      //
      const ocean = ctx.createRadialGradient(
        CX - 60,
        CY - 70,
        10,
        CX,
        CY,
        SCALE
      );

      ocean.addColorStop(0, "#4FA9D8");
      ocean.addColorStop(0.45, "#2B7FB0");
      ocean.addColorStop(1, "#174C73");

      ctx.beginPath();
      path({ type: "Sphere" });
      ctx.fillStyle = ocean;
      ctx.fill();

      //
      // Latitude / Longitude Grid
      //
      ctx.beginPath();
      path(graticule());
      ctx.strokeStyle = "rgba(255,255,255,0.08)";
      ctx.lineWidth = 0.5;
      ctx.stroke();

      //
      // Countries
      //
      for (const country of countries.features) {
        const id = Number(country.id);
        const isNA = NORTH_AMERICA.has(id);

        ctx.beginPath();
        path(country);

        if (isNA) {
          ctx.fillStyle = "#78BE5A";
          ctx.strokeStyle = "#3F6F31";
          ctx.lineWidth = 0.7;
        } else {
          ctx.fillStyle = "#5F944C";
          ctx.strokeStyle = "#456B3C";
          ctx.lineWidth = 0.35;
        }

        ctx.fill();
        ctx.stroke();
      }

      //
      // North America Glow
      //
      const glow = ctx.createRadialGradient(
        CX - 15,
        CY - 20,
        0,
        CX - 15,
        CY - 20,
        SCALE * 0.65
      );

      glow.addColorStop(0, "rgba(120,255,140,0.08)");
      glow.addColorStop(1, "rgba(120,255,140,0)");

      ctx.beginPath();
      path({ type: "Sphere" });
      ctx.fillStyle = glow;
      ctx.fill();

      //
      // Sunlight
      //
      const light = ctx.createRadialGradient(
        CX - 90,
        CY - 95,
        0,
        CX - 90,
        CY - 95,
        190
      );

      light.addColorStop(0, "rgba(255,255,255,0.18)");
      light.addColorStop(0.4, "rgba(255,255,255,0.05)");
      light.addColorStop(1, "rgba(255,255,255,0)");

      ctx.beginPath();
      path({ type: "Sphere" });
      ctx.fillStyle = light;
      ctx.fill();

      //
      // Shadow
      //
      const shadow = ctx.createRadialGradient(
        CX + 90,
        CY + 70,
        SCALE * 0.25,
        CX + 90,
        CY + 70,
        SCALE
      );

      shadow.addColorStop(0, "rgba(0,0,0,0)");
      shadow.addColorStop(1, "rgba(0,0,0,0.28)");

      ctx.beginPath();
      path({ type: "Sphere" });
      ctx.fillStyle = shadow;
      ctx.fill();

      //
      // Rim
      //
      ctx.beginPath();
      path({ type: "Sphere" });
      ctx.strokeStyle = "rgba(255,255,255,0.16)";
      ctx.lineWidth = 1.2;
      ctx.stroke();

      if (!prefersReduced) {
        animationId = requestAnimationFrame(draw);
      }
    }

    draw();

    return () => cancelAnimationFrame(animationId);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={520}
      height={520}
      style={{
        width: "100%",
        height: "auto",
        display: "block",
        background: "transparent",
      }}
    />
  );
}