// src/components/BackgroundComponent_LinesAndCenterDots.tsx

import React from "react";
import { cn } from "@/lib/utils"; // Adjust import path as needed

interface BackgroundComponentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  gridWidth: number;
  gridHeight: number;
  lineColor?: string;
  lineWidth?: number;
  dotColor?: string;
  dotSize?: number; // Radius of the center dot
  children: React.ReactNode;
}

/**
 * A background component displaying both full grid lines and center dots.
 */
export const BackgroundComponent: React.FC<BackgroundComponentProps> = ({
  gridWidth,
  gridHeight,
  lineColor = "rgba(255, 255, 255, 0.38)",
  lineWidth = 1,
  dotColor = "rgba(255, 255, 255, 0.55)",
  dotSize = 1,
  children,
  className,
  style,
  ...props
}) => {
  if (gridWidth <= 0 || gridHeight <= 0 || lineWidth <= 0 || dotSize <= 0) {
    console.error(
      "BackgroundComponent: grid dimensions, lineWidth, and dotSize must be positive.",
    );
    return (
      <div className={cn("relative h-full w-full", className)} {...props}>
        {children}
      </div>
    );
  }

  const safeDotSize = Math.max(1, dotSize);
  const safeLineWidth = Math.max(1, lineWidth);

  // --- CSS Gradient Magic ---
  // Layering multiple backgrounds:
  // 1. Center dot (radial gradient)
  // 2. Horizontal line (linear gradient)
  // 3. Vertical line (linear gradient)
  // The order matters if there's overlap; layers listed first are drawn on top.
  const backgroundStyle: React.CSSProperties = {
    backgroundImage: `
      radial-gradient(circle at center, ${dotColor} ${safeDotSize}px, transparent ${safeDotSize}px),
      linear-gradient(to bottom, ${lineColor} ${safeLineWidth}px, transparent ${safeLineWidth}px),
      linear-gradient(to right, ${lineColor} ${safeLineWidth}px, transparent ${safeLineWidth}px)
    `,
    // All layers repeat with the same grid size
    backgroundSize: `${gridWidth}px ${gridHeight}px`,
    ...style,
  };

  return (
    <div
      className={cn(
        "h-full w-full",
        "bg-gradient-to-br from-zinc-900 to-zinc-800", // Base background
        className,
      )}
      style={backgroundStyle}
      {...props}
    >
      {/* Ensure children are relatively positioned to appear above the background */}
      <div className="relative z-[1] h-full w-full">{children}</div>
    </div>
  );
};

export default BackgroundComponent;
