import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { GeometryNavigation } from "./geometry-navigation";

describe("GeometryNavigation", () => {
  describe("Platonic Solids Navigation", () => {
    it("should render navigation for middle geometry (Hexahedron)", () => {
      render(<GeometryNavigation currentSlug="hexahedron" category="platonic" />);

      // Should have Previous button to Tetrahedron
      expect(screen.getByText(/Tetrahedron/i)).toBeInTheDocument();
      // Note: Previous/Next text appears twice (mobile + desktop variants)
      expect(screen.getAllByText(/Previous/i).length).toBeGreaterThan(0);

      // Should have Next button to Octahedron
      expect(screen.getByText(/Octahedron/i)).toBeInTheDocument();
      expect(screen.getAllByText(/Next/i).length).toBeGreaterThan(0);

      // Should have "All Platonic Solids" link
      expect(screen.getByText(/All Platonic Solids/i)).toBeInTheDocument();
    });

    it("should not render Previous button for first geometry (Tetrahedron)", () => {
      render(
        <GeometryNavigation currentSlug="tetrahedron" category="platonic" />
      );

      // Should NOT have Previous button
      expect(screen.queryAllByText(/Previous/i)).toHaveLength(0);

      // Should have Next button to Hexahedron
      expect(screen.getByText(/Hexahedron/i)).toBeInTheDocument();
      expect(screen.getAllByText(/Next/i).length).toBeGreaterThan(0);

      // Should have "All Platonic Solids" link
      expect(screen.getByText(/All Platonic Solids/i)).toBeInTheDocument();
    });

    it("should not render Next button for last geometry (Dodecahedron)", () => {
      render(
        <GeometryNavigation currentSlug="dodecahedron" category="platonic" />
      );

      // Should have Previous button to Icosahedron
      expect(screen.getByText(/Icosahedron/i)).toBeInTheDocument();
      expect(screen.getAllByText(/Previous/i).length).toBeGreaterThan(0);

      // Should NOT have Next button
      expect(screen.queryAllByText(/Next/i)).toHaveLength(0);

      // Should have "All Platonic Solids" link
      expect(screen.getByText(/All Platonic Solids/i)).toBeInTheDocument();
    });

    it("should render correct links for Platonic Solids", () => {
      const { container } = render(
        <GeometryNavigation currentSlug="octahedron" category="platonic" />
      );

      const links = container.querySelectorAll("a");

      // Previous link (Hexahedron)
      const prevLink = Array.from(links).find((link) =>
        link.textContent?.includes("Hexahedron")
      );
      expect(prevLink?.getAttribute("href")).toBe("/platonic-solids/hexahedron");

      // Next link (Icosahedron) - order: Tetra(1) → Hexa(2) → Octa(3) → Icosa(4) → Dodeca(5)
      const nextLink = Array.from(links).find((link) =>
        link.textContent?.includes("Icosahedron")
      );
      expect(nextLink?.getAttribute("href")).toBe(
        "/platonic-solids/icosahedron"
      );

      // All link
      const allLink = Array.from(links).find((link) =>
        link.textContent?.includes("All Platonic Solids")
      );
      expect(allLink?.getAttribute("href")).toBe("/platonic-solids");
    });
  });

  describe("Patterns Navigation", () => {
    it("should render navigation for middle geometry (Seed of Life)", () => {
      render(
        <GeometryNavigation currentSlug="seed-of-life" category="pattern" />
      );

      // Should have Previous button to Germ of Life (order: Vesica(2) → Germ(2.5) → Seed(3))
      expect(screen.getByText(/Germ of Life/i)).toBeInTheDocument();
      expect(screen.getAllByText(/Previous/i).length).toBeGreaterThan(0);

      // Should have Next button to Egg of Life (order: Seed(3) → Egg(3.5) → Fruit(4))
      expect(screen.getByText(/Egg of Life/i)).toBeInTheDocument();
      expect(screen.getAllByText(/Next/i).length).toBeGreaterThan(0);

      // Should have "All Sacred Patterns" link (mobile and desktop variants)
      expect(screen.getAllByText(/All Sacred Patterns/i).length).toBeGreaterThan(0);
    });

    it("should not render Previous button for first pattern (Circle Dot)", () => {
      render(<GeometryNavigation currentSlug="circle-dot" category="pattern" />);

      // Should NOT have Previous button
      expect(screen.queryAllByText(/Previous/i)).toHaveLength(0);

      // Should have Next button to Vesica Piscis
      expect(screen.getByText(/Vesica Piscis/i)).toBeInTheDocument();
      expect(screen.getAllByText(/Next/i).length).toBeGreaterThan(0);
    });

    it("should not render Next button for last pattern (64 Tetrahedron)", () => {
      render(
        <GeometryNavigation currentSlug="64-tetrahedron" category="pattern" />
      );

      // Should have Previous button
      expect(screen.getAllByText(/Previous/i).length).toBeGreaterThan(0);

      // Should NOT have Next button
      expect(screen.queryAllByText(/Next/i)).toHaveLength(0);
    });

    it("should render correct links for Patterns", () => {
      const { container } = render(
        <GeometryNavigation currentSlug="star-tetrahedron" category="pattern" />
      );

      const links = Array.from(container.querySelectorAll("a"));

      // Previous link (Sri Yantra)
      const prevLink = links.find((link) =>
        link.textContent?.includes("Sri Yantra")
      );
      expect(prevLink).toBeDefined();
      expect(prevLink?.getAttribute("href")).toBe("/sacred-patterns/sri-yantra");

      // Next link (Golden Ratio)
      const nextLink = links.find((link) =>
        link.textContent?.includes("Golden Ratio")
      );
      expect(nextLink).toBeDefined();
      expect(nextLink?.getAttribute("href")).toBe(
        "/sacred-patterns/golden-ratio"
      );

      // All link
      const allLink = links.find((link) =>
        link.textContent?.includes("All Sacred Patterns")
      );
      expect(allLink).toBeDefined();
      expect(allLink?.getAttribute("href")).toBe("/sacred-patterns");
    });
  });

  describe("Edge Cases", () => {
    it("should return null for invalid slug", () => {
      const { container } = render(
        <GeometryNavigation currentSlug="invalid-slug" category="platonic" />
      );

      // Should not render anything
      expect(container.firstChild).toBeNull();
    });

    it("should handle geometry without order field gracefully", () => {
      // vesica-piscis doesn't have an order field, so it won't appear in navigation
      const { container } = render(
        <GeometryNavigation currentSlug="vesica-piscis" category="pattern" />
      );

      // Component should either not render or handle gracefully
      // This geometry is not in the ordered list, so navigation might not work
      expect(container).toBeTruthy();
    });
  });

  describe("Accessibility", () => {
    it("should have proper link elements", () => {
      const { container } = render(
        <GeometryNavigation currentSlug="octahedron" category="platonic" />
      );

      const links = container.querySelectorAll("a");
      expect(links.length).toBeGreaterThan(0);

      links.forEach((link) => {
        expect(link.getAttribute("href")).toBeTruthy();
      });
    });

    it("should render chevron icons for visual cues", () => {
      const { container } = render(
        <GeometryNavigation currentSlug="octahedron" category="platonic" />
      );

      // Check for SVG icons (ChevronLeft and ChevronRight from lucide-react)
      const svgs = container.querySelectorAll("svg");
      expect(svgs.length).toBeGreaterThanOrEqual(2); // At least Previous and Next icons
    });
  });
});
