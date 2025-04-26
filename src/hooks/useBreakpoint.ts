// src/lib/hooks/useBreakpoint.ts
import { useState, useEffect } from "react";

// Define breakpoints (adjust as needed, matching Tailwind's defaults is common)
const breakpoints = {
  sm: 640, // Phone landscape / Small tablet portrait
  md: 768, // Tablet portrait / Laptop small
  lg: 1024, // Laptop / Desktop small
  xl: 1280, // Desktop standard
  "2xl": 1536, // Desktop large
};

type Breakpoint = keyof typeof breakpoints | "base"; // Add 'base' for smallest

export function useBreakpoint(): Breakpoint {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>("base");

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width >= breakpoints["2xl"]) {
        setBreakpoint("2xl");
      } else if (width >= breakpoints.xl) {
        setBreakpoint("xl");
      } else if (width >= breakpoints.lg) {
        setBreakpoint("lg");
      } else if (width >= breakpoints.md) {
        setBreakpoint("md");
      } else if (width >= breakpoints.sm) {
        setBreakpoint("sm");
      } else {
        setBreakpoint("base"); // Smallest screens (like phone portrait)
      }
    };

    handleResize(); // Set initial breakpoint
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return breakpoint;
}
