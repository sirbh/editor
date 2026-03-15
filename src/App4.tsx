import { Button } from "@/components/ui/button";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "./components/ui/resizable";
import { Files, Type, type LucideIcon } from "lucide-react";
import { useLayout, type LeftView } from "./contexts/LayoutContext";
import { TooltipContent, TooltipProvider, TooltipTrigger } from "@radix-ui/react-tooltip"; import { Tooltip } from "./components/ui/tooltip";
;

export default function App() {
  // Left Panel State
  const {
    leftRef, rightRef, leftOpen, rightOpen,
    leftView, rightView, isAnimating, stopAnimation
  } = useLayout();

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
            className={isAnimating ? "transition-[flex-basis] duration-300 ease-in-out" : ""}
          >
            <div className="p-4 h-full border-r bg-white">
              {leftView === "files" && <div>📂 File Explorer</div>}
              {leftView === "text" && <div>🔍 Text Files</div>}
            </div>
          </ResizablePanel>

          {leftOpen && <ResizableHandle withHandle />}

          {/* MAIN CONTENT */}
          <ResizablePanel defaultSize={60} className="min-w-0" order={2}>
            <div className="p-6">Main Content Area</div>
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


// export function LeftSidebar() {
//   const { setLeftView, leftView, leftOpen } = useLayout();

//   return (
//     <aside className="flex flex-col gap-2 p-2 border-r bg-gray-200 w-[4.5rem]">
//       <Button 
//         variant={leftOpen && leftView === "files" ? "secondary" : "ghost"} 
//         onClick={() => setLeftView("files")}
//       >
//         <Files size={40} />
//       </Button>

//        <Button 
//         variant={leftOpen && leftView === "text" ? "secondary" : "ghost"} 
//         onClick={() => setLeftView("text")}
//       >
//         <Type size={40} />
//       </Button>

//     </aside>
//   );
// }


// export function RightSidebar() {
//   const { setRightView, rightView, rightOpen } = useLayout();

//   return (
//     <aside className="flex flex-col gap-2 p-2 border-l bg-gray-50 items-center w-[4.5rem]">
//       <Button 
//         size="icon"
//         variant={rightOpen && rightView === "text" ? "secondary" : "ghost"} 
//         onClick={() => setRightView("text")}
//       >
//         <Type size={40} />
//       </Button>
//     </aside>
//   );
// }



export function LeftSidebar() {
  const { setLeftView, leftView, leftOpen } = useLayout();

  const items: {
    id: LeftView,
    icon: LucideIcon,
    label: string
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
                <Button className="flex flex-col h-16 w-full" variant={"outline"}>
                  <Icon size={40} className="!w-16 !h-6"  />
                  <span className="text-[10px] leading-none">
                    {item.label}
                  </span>
                </Button>
              </TooltipTrigger>

              <TooltipContent side="right" className="bg-white text-black rounded-md !px-6 py-1.5 shadow-md">
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

          <TooltipContent side="left">
            Text Panel
          </TooltipContent>
        </Tooltip>
      </aside>
    </TooltipProvider>
  );
}