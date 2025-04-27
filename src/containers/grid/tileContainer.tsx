import React, { useState, useCallback, JSX, useRef, useEffect } from "react";
import _ from "lodash";
import RGL, {
  WidthProvider,
  Layout,
  ReactGridLayoutProps,
} from "react-grid-layout";
import { cn } from "@/lib/utils";
import { BackgroundComponent } from "./corner-guide-background";
const availableHandles: ResizeHandle = [
  "s",
  "w",
  "e",
  "n",
  "sw",
  "nw",
  "se",
  "ne",
] as const;
interface BasicLayoutProps extends ReactGridLayoutProps {
  className?: string;
  rowHeight?: number;
  automatic?: boolean;
  layout?: Layout[];
  onLayoutChange?: (layout: Layout[]) => void;
  cols?: number;
  containerPadding?: [number, number];
  containerMargin?: [number, number];
  height?: number;
  children?: JSX.Element[];
}

const ReactGridLayout = WidthProvider(RGL);

export const BasicLayout: React.FC<BasicLayoutProps> = ({
  className = "layout",
  automatic = true,
  cols = 12,
  rowHeight = 30,
  layout = [],
  containerPadding = [0, 0],
  containerMargin = [0, 1],
  onLayoutChange = () => {},
  children,
  ...props
}) => {
  const [currentLayout, _setCurrentLayout] = useState<Layout[]>(layout);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const containerRef = useRef<HTMLDivElement>(null);

  const updateDimensions = useCallback(() => {
    if (containerRef.current) {
      setDimensions({
        width: containerRef.current.offsetWidth,
        height: containerRef.current.offsetHeight,
      });
    }
  }, []);

  useEffect(() => {
    updateDimensions();

    window.addEventListener("resize", updateDimensions);

    return () => {
      window.removeEventListener("resize", updateDimensions);
    };
  }, [updateDimensions]);

  const handleLayoutChange = useCallback(
    (newLayout: Layout[]) => {
      onLayoutChange(newLayout);
    },
    [onLayoutChange],
  );
  console.log("width", containerRef.current?.clientWidth);
  console.log("height", containerRef.current?.clientHeight);
  const childrenWithKeys = children?.map((child, index) => {
    return (
      <div className="bg- h-full w-full" key={index}>
        {child}
      </div>
    );
  });
  const tileHeight = () => {
    if (!automatic) return rowHeight;
    // Why Math.SQRT2? Because the grid is a square, and we want to make sure that ratios are similar to A4 paper.
    // So we need to divide the width by the square root of 2 to get the height.
    // This is a bit of a visual trick, will try with different values later. (1.5 is a good value too 16/9 is 1.7777 which is also a good value too)
    const columnCount = getColumnCount();
    const columnWidth = dimensions.width / columnCount;
    if (columnCount === 0) return 0;
    if (columnCount === 12 || columnCount === 8)
      return columnWidth / (2 * Math.SQRT2);
    else return columnWidth / Math.SQRT2;
  };
  const getColumnCount = () => {
    if (!automatic) return cols;
    if (dimensions.width) {
      const allWidth = dimensions.width;
      return allWidth > 1280 ? 12 : allWidth > 800 ? 8 : 4;
    }
    return 8;
  };
  console.log("dimensions", dimensions);

  return (
    <BackgroundComponent
      gridWidth={dimensions.width / getColumnCount()}
      gridHeight={tileHeight()}
      ref={containerRef}
      variant="dashed-lines"
    >
      <ReactGridLayout
        resizeHandles={availableHandles}
        verticalCompact={false}
        layout={currentLayout}
        onLayoutChange={handleLayoutChange}
        className={cn(className)}
        rowHeight={tileHeight()}
        cols={getColumnCount()}
        containerPadding={containerPadding}
        margin={containerMargin}
        {...props}
      >
        {childrenWithKeys}
      </ReactGridLayout>
    </BackgroundComponent>
  );
};
