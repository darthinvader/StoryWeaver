import React, { useState, useCallback, JSX, useRef, useEffect } from "react";
import _ from "lodash";
import RGL, {
  WidthProvider,
  Layout,
  ReactGridLayoutProps,
} from "react-grid-layout";
import { cn } from "@/lib/utils";

interface BasicLayoutProps extends ReactGridLayoutProps {
  className?: string;
  rowHeight?: number;
  automatic?: boolean;
  layout?: Layout[];
  onLayoutChange?: (layout: Layout[]) => void;
  cols?: number;
  containerPadding?: [number, number];
  containerMargin?: [number, number];
  children?: JSX.Element[];
}

const ReactGridLayout = WidthProvider(RGL);

// Use React.FC with the props interface
export const BasicLayout: React.FC<BasicLayoutProps> = ({
  className = "layout",
  automatic = true,
  cols = 12,
  rowHeight = 30,
  layout = [],
  containerPadding = [0, 0],
  containerMargin = [0, 0],
  onLayoutChange = () => {},
  children,
  ...props
}) => {
  const [currentLayout, _setCurrentLayout] = useState<Layout[]>(layout);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  // Memoized function to update dimensions
  const updateDimensions = useCallback(() => {
    if (containerRef.current) {
      setDimensions({
        width: containerRef.current.offsetWidth, // Includes padding and border
        height: containerRef.current.offsetHeight, // Includes padding and border
        // Alternatively, use clientWidth/clientHeight for size excluding border
        // width: containerRef.current.clientWidth,
        // height: containerRef.current.clientHeight,
      });
    }
  }, []); // No dependencies, relies on ref.current

  useEffect(() => {
    // Initial measurement on mount
    updateDimensions();

    // Add resize event listener
    window.addEventListener("resize", updateDimensions);

    // Cleanup function to remove listener on unmount
    return () => {
      window.removeEventListener("resize", updateDimensions);
    };
  }, [updateDimensions]); // Re-run effect if updateDimensions changes (it won't here due to useCallback)

  const handleLayoutChange = useCallback(
    (newLayout: Layout[]) => {
      onLayoutChange(newLayout);
    },
    [onLayoutChange],
  );
  const containerRef = useRef<HTMLDivElement>(null);
  console.log("width", containerRef.current?.clientWidth);
  console.log("height", containerRef.current?.clientHeight);
  const childrenWithKeys = children?.map((child, index) => {
    return (
      <div className="m-0 h-full w-full p-0" key={index}>
        {child}
      </div>
    );
  });
  const height = () => {
    if (!automatic) return rowHeight;
    if (dimensions.height) {
      const allHeight = dimensions.height;
      const heightDivider = allHeight > 800 ? 8 : 6;
      console.log("newHeight", (2 * allHeight) / heightDivider);

      return Math.ceil((2 * allHeight) / heightDivider);
    }
    return 12;
  };
  const newCols = () => {
    if (!automatic) return cols;
    if (dimensions.width) {
      const allWidth = dimensions.width;
      return allWidth > 1280 ? 12 : allWidth > 1024 ? 8 : 4;
    }
    return 8;
  };
  console.log("dimensions", dimensions);
  return (
    <div ref={containerRef} className="h-full w-full">
      <ReactGridLayout
        layout={currentLayout}
        onLayoutChange={handleLayoutChange}
        className={cn(className)}
        rowHeight={height()}
        cols={newCols()}
        containerPadding={containerPadding}
        margin={containerMargin}
        {...props}
      >
        {childrenWithKeys}
      </ReactGridLayout>
    </div>
  );
};
