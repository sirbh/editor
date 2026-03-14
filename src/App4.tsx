import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "./components/ui/resizable";
import type { ImperativePanelHandle } from "react-resizable-panels";

export default function App() {
  // Left Panel State
  const [leftOpen, setLeftOpen] = useState(false);
  const [leftAnimating, setLeftAnimating] = useState(false);
  const leftRef = useRef<ImperativePanelHandle>(null);

  // Right Panel State
  const [rightOpen, setRightOpen] = useState(false);
  const [rightAnimating, setRightAnimating] = useState(false);
  const rightRef = useRef<ImperativePanelHandle>(null);

const toggleLeft = () => {
  const panel = leftRef.current;
  if (!panel) return; // Production safety check

  setLeftAnimating(true);
  
  if (leftOpen) {
    panel.collapse();
  } else {
    panel.expand();
  }
  
  setLeftOpen(!leftOpen);
  setTimeout(() => setLeftAnimating(false), 300);
};

const toggleRight = () => {
    const panel = rightRef.current;
    if (panel) {
      setRightAnimating(true);
      if (rightOpen) {
        panel.collapse();
      } else {
        panel.expand();
      }
      setRightOpen(!rightOpen);
      setTimeout(() => setRightAnimating(false), 300);
    }
  };

  return (
    <div className="grid h-screen grid-rows-[4rem_1fr] grid-cols-[4.5rem_1fr_4.5rem]">
      {/* Header */}
      <header className="col-span-full bg-gray-200 flex items-center px-4 border-b">
        Header
      </header>

      {/* Extreme Left Sidebar */}
      <aside className="bg-red-200 flex justify-center p-2 border-r">
        <Button onClick={toggleLeft}>{leftOpen ? "✕" : "☰"}</Button>
      </aside>

      {/* Main Workspace */}
      <main className="flex h-full overflow-hidden bg-blue-300 p-4">
        <ResizablePanelGroup
          direction="horizontal"
          className="rounded-lg border bg-background"
          onPointerDown={() => {
            setLeftAnimating(false);
            setRightAnimating(false);
          }}
        >
          {/* 1. Left Resizable Menu */}
          <ResizablePanel
            ref={leftRef}
            defaultSize={0}
            minSize={20}
            maxSize={40}
            collapsible
            onCollapse={() => setLeftOpen(false)}
            onExpand={() => setLeftOpen(true)}
            className={leftAnimating ? "transition-all duration-300" : ""}
          >
            <div className="flex h-full items-center justify-center bg-red-50">Left</div>
          </ResizablePanel>

          {leftOpen && <ResizableHandle withHandle />}

          {/* 2 & 3. Center Stack */}
          <ResizablePanel defaultSize={50}>
            <ResizablePanelGroup direction="vertical">
              <ResizablePanel defaultSize={30}>
                <div className="flex h-full items-center justify-center bg-slate-50">Top</div>
              </ResizablePanel>
              <ResizableHandle withHandle />
              <ResizablePanel defaultSize={70}>
                <div className="flex h-full items-center justify-center bg-slate-100">Bottom</div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>

          {/* 4. Fixed Width Right Panel (No Handle before it if you want it strictly fixed) */}
          <ResizablePanel
            ref={rightRef}
            defaultSize={0}
            // By setting min and max to the same %, it becomes "fixed"
            minSize={20}
            maxSize={20}
            collapsible
            onCollapse={() => setRightOpen(false)}
            onExpand={() => setRightOpen(true)}
            className={rightAnimating ? "transition-all duration-300" : ""}
          >
            <div className="flex h-full items-center justify-center border-l bg-blue-50">
              Fixed Right
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </main>

      {/* Extreme Right Sidebar */}
      <aside className="bg-blue-200 flex justify-center p-2 border-l">
        <Button onClick={toggleRight} variant="secondary">
          {rightOpen ? "✕" : "ⓘ"}
        </Button>
      </aside>
    </div>
  );
}