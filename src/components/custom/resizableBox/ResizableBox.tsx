import React, { useState, useRef, useEffect } from "react";
import styles from "./ResizableBox.module.css";

type Direction =
  | "top"
  | "bottom"
  | "left"
  | "right"
  | "topLeft"
  | "topRight"
  | "bottomLeft"
  | "bottomRight";

interface ResizableBoxProps {
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
  initialWidth?: number;
  initialHeight?: number;
  children?: React.ReactNode;
}

const ResizableBox: React.FC<ResizableBoxProps> = ({
  minWidth = 100,
  minHeight = 100,
  maxWidth = 800,
  maxHeight = 600,
  initialWidth = 250,
  initialHeight = 200,
  children,
}) => {
  const boxRef = useRef<HTMLDivElement>(null);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDir, setResizeDir] = useState<Direction | null>(null);
  const [dimensions, setDimensions] = useState({
    width: initialWidth,
    height: initialHeight,
    x: 0,
    y: 0,
  });

  const startResize = (dir: Direction) => {
    setIsResizing(true);
    setResizeDir(dir);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing || !boxRef.current || !resizeDir) return;

      const rect = boxRef.current.getBoundingClientRect();
      let newWidth = dimensions.width;
      let newHeight = dimensions.height;
      let newX = dimensions.x;
      let newY = dimensions.y;

      // Horizontal resizing
      if (resizeDir.includes("right")) {
        newWidth = Math.min(Math.max(minWidth, e.clientX - rect.left), maxWidth);
      } else if (resizeDir.includes("left")) {
        const diff = rect.right - e.clientX;
        newWidth = Math.min(Math.max(minWidth, diff), maxWidth);
        newX = e.clientX - rect.left;
      }

      // Vertical resizing
      if (resizeDir.includes("bottom")) {
        newHeight = Math.min(Math.max(minHeight, e.clientY - rect.top), maxHeight);
      } else if (resizeDir.includes("top")) {
        const diff = rect.bottom - e.clientY;
        newHeight = Math.min(Math.max(minHeight, diff), maxHeight);
        newY = e.clientY - rect.top;
      }

      // Update state
      setDimensions({
        width: newWidth,
        height: newHeight,
        x: newX,
        y: newY,
      });
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      setResizeDir(null);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing, resizeDir, dimensions, minWidth, minHeight, maxWidth, maxHeight]);

  return (
    <div
      ref={boxRef}
      className={styles.box}
      style={{
        width: dimensions.width,
        height: dimensions.height,
        transform: `translate(${dimensions.x}px, ${dimensions.y}px)`,
      }}
    >
      {children}

      {/* Side handles */}
      <div className={`${styles.handle} ${styles.handleTop}`} onMouseDown={() => startResize("top")} />
      <div className={`${styles.handle} ${styles.handleBottom}`} onMouseDown={() => startResize("bottom")} />
      <div className={`${styles.handle} ${styles.handleLeft}`} onMouseDown={() => startResize("left")} />
      <div className={`${styles.handle} ${styles.handleRight}`} onMouseDown={() => startResize("right")} />

      {/* Corner handles */}
      <div
        className={`${styles.handle} ${styles.handleCorner} ${styles.handleTopLeft}`}
        onMouseDown={() => startResize("topLeft")}
      />
      <div
        className={`${styles.handle} ${styles.handleCorner} ${styles.handleTopRight}`}
        onMouseDown={() => startResize("topRight")}
      />
      <div
        className={`${styles.handle} ${styles.handleCorner} ${styles.handleBottomLeft}`}
        onMouseDown={() => startResize("bottomLeft")}
      />
      <div
        className={`${styles.handle} ${styles.handleCorner} ${styles.handleBottomRight}`}
        onMouseDown={() => startResize("bottomRight")}
      />
    </div>
  );
};

export default ResizableBox;
