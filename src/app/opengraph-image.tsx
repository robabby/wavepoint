import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "WavePoint - Explore Sacred Geometry and Timeless Patterns";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

// Generate Flower of Life circles data
function generateFlowerOfLifeCircles() {
  const circles: Array<{ cx: number; cy: number }> = [];
  const centerX = 600;
  const centerY = 260;
  const radius = 60;

  // Center circle
  circles.push({ cx: centerX, cy: centerY });

  // First ring (6 circles)
  for (let i = 0; i < 6; i++) {
    const angle = (i * 60 * Math.PI) / 180;
    circles.push({
      cx: centerX + radius * Math.cos(angle),
      cy: centerY + radius * Math.sin(angle),
    });
  }

  // Second ring (12 circles)
  for (let i = 0; i < 12; i++) {
    const angle = (i * 30 * Math.PI) / 180;
    const dist = radius * Math.sqrt(3);
    circles.push({
      cx: centerX + dist * Math.cos(angle),
      cy: centerY + dist * Math.sin(angle),
    });
  }

  return circles;
}

// Generate Metatron's Cube geometry data
function generateMetatronsCube() {
  const centerX = 600;
  const centerY = 260;
  const innerRadius = 55;
  const outerRadius = 110;

  type Vertex = { x: number; y: number };
  const innerVertices: Vertex[] = [];
  const outerVertices: Vertex[] = [];

  for (let i = 0; i < 6; i++) {
    const angle = ((i * 60 - 90) * Math.PI) / 180;
    innerVertices.push({
      x: centerX + innerRadius * Math.cos(angle),
      y: centerY + innerRadius * Math.sin(angle),
    });
    outerVertices.push({
      x: centerX + outerRadius * Math.cos(angle),
      y: centerY + outerRadius * Math.sin(angle),
    });
  }

  const lines: Array<{ x1: number; y1: number; x2: number; y2: number }> = [];

  // Connect center to inner vertices
  innerVertices.forEach((v) => {
    lines.push({ x1: centerX, y1: centerY, x2: v.x, y2: v.y });
  });

  // Connect inner vertices to each other
  for (let i = 0; i < 6; i++) {
    for (let j = i + 1; j < 6; j++) {
      const vi = innerVertices[i]!;
      const vj = innerVertices[j]!;
      lines.push({ x1: vi.x, y1: vi.y, x2: vj.x, y2: vj.y });
    }
  }

  // Connect inner to outer vertices
  for (let i = 0; i < 6; i++) {
    const inner = innerVertices[i]!;
    const outer = outerVertices[i]!;
    const outerNext = outerVertices[(i + 1) % 6]!;
    lines.push({ x1: inner.x, y1: inner.y, x2: outer.x, y2: outer.y });
    lines.push({ x1: inner.x, y1: inner.y, x2: outerNext.x, y2: outerNext.y });
  }

  // Connect outer vertices to each other
  for (let i = 0; i < 6; i++) {
    for (let j = i + 1; j < 6; j++) {
      const vi = outerVertices[i]!;
      const vj = outerVertices[j]!;
      lines.push({ x1: vi.x, y1: vi.y, x2: vj.x, y2: vj.y });
    }
  }

  return {
    center: { x: centerX, y: centerY },
    innerVertices,
    outerVertices,
    lines,
    innerRadius,
    outerRadius,
  };
}

// Build Flower of Life SVG as data URL
function buildFlowerOfLifeSvg(): string {
  const circles = generateFlowerOfLifeCircles();
  const radius = 60;

  const circleElements = circles
    .map(
      (c) =>
        `<circle cx="${c.cx}" cy="${c.cy}" r="${radius}" fill="none" stroke="#d4a84b" stroke-width="1" opacity="0.15"/>`
    )
    .join("");

  return `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">${circleElements}</svg>`
  )}`;
}

// Build Metatron's Cube SVG as data URL
function buildMetatronsCubeSvg(): string {
  const cube = generateMetatronsCube();

  const lineElements = cube.lines
    .map(
      (l) =>
        `<line x1="${l.x1}" y1="${l.y1}" x2="${l.x2}" y2="${l.y2}" stroke="#e8c068" stroke-width="1.5"/>`
    )
    .join("");

  const glowLineElements = cube.lines
    .map(
      (l) =>
        `<line x1="${l.x1}" y1="${l.y1}" x2="${l.x2}" y2="${l.y2}" stroke="#d4a84b" stroke-width="4" opacity="0.3"/>`
    )
    .join("");

  const centerCircle = `<circle cx="${cube.center.x}" cy="${cube.center.y}" r="10" fill="#d4a84b"/>`;

  const innerCircles = cube.innerVertices
    .map((v) => `<circle cx="${v.x}" cy="${v.y}" r="7" fill="#d4a84b"/>`)
    .join("");

  const outerCircles = cube.outerVertices
    .map((v) => `<circle cx="${v.x}" cy="${v.y}" r="6" fill="#d4a84b"/>`)
    .join("");

  const containingCircles = `
    <circle cx="${cube.center.x}" cy="${cube.center.y}" r="${cube.innerRadius}" fill="none" stroke="#d4a84b" stroke-width="1" opacity="0.5"/>
    <circle cx="${cube.center.x}" cy="${cube.center.y}" r="${cube.outerRadius}" fill="none" stroke="#d4a84b" stroke-width="1" opacity="0.3"/>
  `;

  return `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">${glowLineElements}${lineElements}${containingCircles}${centerCircle}${innerCircles}${outerCircles}</svg>`
  )}`;
}

export default async function Image() {
  const flowerSvg = buildFlowerOfLifeSvg();
  const metatronSvg = buildMetatronsCubeSvg();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background:
            "radial-gradient(ellipse at center, #1a1714 0%, #0c0c0c 50%, #080808 100%)",
          position: "relative",
        }}
      >
        {/* Vignette overlay */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background:
              "radial-gradient(ellipse at center, transparent 20%, rgba(0,0,0,0.5) 100%)",
          }}
        />

        {/* Flower of Life - subtle background */}
        <img
          src={flowerSvg}
          alt=""
          width={1200}
          height={630}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
          }}
        />

        {/* Metatron's Cube - prominent foreground */}
        <img
          src={metatronSvg}
          alt=""
          width={1200}
          height={630}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
          }}
        />

        {/* Text content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            position: "absolute",
            bottom: 100,
          }}
        >
          {/* Main title */}
          <div
            style={{
              fontSize: 72,
              fontWeight: 700,
              letterSpacing: "0.12em",
              color: "#f5f0e6",
              textShadow: "0 0 60px rgba(212, 168, 75, 0.6)",
            }}
          >
            WAVEPOINT
          </div>

          {/* Tagline */}
          <div
            style={{
              fontSize: 26,
              fontWeight: 400,
              letterSpacing: "0.08em",
              color: "#b8a99a",
              marginTop: 16,
            }}
          >
            Explore Timeless Patterns & Platonic Solids
          </div>
        </div>

        {/* Decorative accent line */}
        <div
          style={{
            position: "absolute",
            bottom: 80,
            width: 500,
            height: 1,
            background:
              "linear-gradient(90deg, transparent 0%, #d4a84b 50%, transparent 100%)",
            opacity: 0.4,
          }}
        />
      </div>
    ),
    {
      ...size,
    }
  );
}
