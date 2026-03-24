import { Button } from "@/components/ui/button";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "./components/ui/resizable";
import {PointerActivationConstraints} from "@dnd-kit/dom"
import {
  ArrowLeftFromLine,
  ChevronsLeft,
  ChevronsRight,
  Files,
  Play,
  Type,
  type LucideIcon,
} from "lucide-react";
import {
  useLayout,
  type LeftView,
  type PanelComponent,
} from "./contexts/LayoutContext";
import {
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";
import { Tooltip } from "./components/ui/tooltip";
import FilesPanel from "./components/custom/FilePanel";
import TextPanel from "./components/custom/TextPanel";
import {
  DragDropProvider,
  PointerSensor,
  use
} from "@dnd-kit/react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "./store/store";
import { selectAsset } from "./store/assets";
import ReelEditorPanel from "./components/custom/ReelEditorPAnel";
import { ScrollArea } from "./components/ui/scroll-area";
import { Slider } from "./components/custom/slider";
import Seekbar from "./components/custom/Seekbar2";
export default function App() {
  // Left Panel State
  const {
    leftRef,
    rightRef,
    leftOpen,
    rightOpen,
    leftView,
    rightView,
    stopAnimation,
    setLeftOpen,
  } = useLayout();


  const LEFT_PANEL_MAP: Record<LeftView, PanelComponent> = {
    files: FilesPanel,
    text: TextPanel,
  };
  const LeftPanelContent = LEFT_PANEL_MAP[leftView];






  return (
      <div className="flex flex-col h-screen w-full overflow-hidden">
        {/* HEADER */}
        <header className="h-12 bg-gray-200 flex items-center px-4 border-b shrink-0">
          Header
        </header>

        {/* MAIN LAYOUT */}
        <div className="flex flex-1 overflow-hidden">
          <LeftSidebar />

          <ResizablePanelGroup
            direction="horizontal"
            onPointerDown={stopAnimation}
          >
            {/* LEFT PANEL */}
            <ResizablePanel
              order={1}
              ref={leftRef}
              collapsible
              defaultSize={0}
              minSize={20}
              maxSize={50}
              className="bg-tansparent !mx-2 !h-full !flex !flex-col !min-h-0"
              onCollapse={() => {
                setLeftOpen(false);
              }}
            >
              <LeftPanelContent />
            </ResizablePanel>

            {leftOpen && <ResizableHandle withHandle />}

            {/* MAIN CONTENT */}
            <ResizablePanel defaultSize={60} className="min-w-0" order={2}>
              <ResizablePanelGroup direction="vertical">
                <ResizablePanel defaultSize={70}>
                  <ReelEditorPanel />
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel
                  defaultSize={30}
                  minSize={42}
                  maxSize={60}
                >
                        <Seekbar/>
                </ResizablePanel>
              </ResizablePanelGroup>
            </ResizablePanel>

            {rightOpen && <ResizableHandle withHandle />}

            {/* RIGHT PANEL */}
            <ResizablePanel
              order={3}
              ref={rightRef}
              collapsible
              defaultSize={0}
              minSize={20}
              maxSize={20}
            >
              <div className="p-4 h-full border-l bg-white">
                {rightView === "text" && <div>ℹ️ Text Info Details</div>}
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
          <RightSidebar />
        </div>
      </div>
  );
}

export function LeftSidebar() {
  const { setLeftView, leftView, leftOpen } = useLayout();

  const items: {
    id: LeftView;
    icon: LucideIcon;
    label: string;
  }[] = [
    { id: "files", icon: Files, label: "Files" },
    { id: "text", icon: Type, label: "Text" },
  ];

  return (
    <TooltipProvider delayDuration={200}>
      <aside className="flex flex-col items-center gap-3 !px-2 border-r bg-muted w-[5rem]">
        {items.map((item) => {
          const Icon = item.icon;
          const active = leftOpen && leftView === item.id;

          return (
            <Tooltip key={item.id}>
              <TooltipTrigger asChild>
                <Button
                  className="flex flex-col h-16 w-full"
                  variant={active ? "secondary" : "ghost"}
                  onClick={() => setLeftView(item.id)}
                >
                  <Icon size={40} className="!w-16 !h-6" />
                  <span className="text-[10px] leading-none">{item.label}</span>
                </Button>
              </TooltipTrigger>

              <TooltipContent
                side="right"
                className="bg-white text-black rounded-md !px-6 py-1.5 shadow-md"
              >
                {item.label}
              </TooltipContent>
            </Tooltip>
          );
        })}
      </aside>
    </TooltipProvider>
  );
}

export function RightSidebar() {
  const { setRightView, rightView, rightOpen } = useLayout();

  const active = rightOpen && rightView === "text";

  return (
    <TooltipProvider delayDuration={200}>
      <aside className="flex flex-col items-center gap-3 p-2 border-l bg-muted w-[5rem]">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size={"icon"}
              variant={active ? "secondary" : "ghost"}
              className="flex flex-col items-center "
              onClick={() => setRightView("text")}
            >
              <Type size={40} />
              <span className="text-[10px] leading-none">Text</span>
            </Button>
          </TooltipTrigger>

          <TooltipContent side="left">Text Panel</TooltipContent>
        </Tooltip>
      </aside>
    </TooltipProvider>
  );
}
