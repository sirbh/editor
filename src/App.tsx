import styles from "./App.module.css";
import Assets from "./components/sections/assets/Assets";
import Card from "./components/ui/card/Card";
// import Seekbar from "./components/custom/Seekbar";
import { DndContext, DragOverlay, type DragMoveEvent, type UniqueIdentifier } from "@dnd-kit/core";
import Droppable from "./components/sections/droppable/Droppable";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "./store/store";
import { selectAsset } from "./store/assets";
import { useState } from "react";
import TextPanel from "./components/sections/text/TextPanel";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { LayersIcon, SettingsIcon } from "lucide-react";

export default function App() {

  // const selectedAssets = useSelector((state: RootState) => state.assets.selectedAssests)
  const assets = useSelector((state: RootState) => state.assets.assets)
  const [activeSection, setActiveSection] = useState<"assets" | "text">("assets");
  const [activeId, setActiveId] = useState<UniqueIdentifier>("");
  const dispatch = useDispatch();

  // State to control the right-side drawer
  const [isRightDrawerOpen, setIsRightDrawerOpen] = useState(false);
  const [drawerContent, setDrawerContent] = useState("");

  const handleOpenDrawer = (type: string) => {
    setDrawerContent(type);
    setIsRightDrawerOpen(true);
  };



  function handleDragStart(event: DragMoveEvent) {
    const { active } = event;
    setActiveId(active.id);
  }
  function handleDragEnd(event: DragMoveEvent) {
    console.log("callee")

    const { active, over } = event;
    if (over && over.id === 'droppable') {
      const draggedItem = assets.find((item) => item.id === active.id);
      console.log(draggedItem)
      if (draggedItem) {
        dispatch(selectAsset({
          ...draggedItem,
        }));
      }
    }
    setActiveId("");
  }
  return (
    <DndContext onDragEnd={handleDragEnd} onDragStart={handleDragStart} >
      <div className={styles.layout}>
        <div className={styles.container}>
          <div className={styles["top-bar"]}>
            <Card>
              <div></div>
            </Card>
          </div>
          <div className={styles["side-bar"]}>
            <Card>
              <div className="flex flex-col gap-2 p-2">

                <button
                  onClick={() => setActiveSection("assets")}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition
        ${activeSection === "assets"
                      ? "bg-blue-500 text-white"
                      : "bg-neutral-800 text-gray-200 hover:bg-neutral-700"}`}
                >
                  Assets
                </button>

                <button
                  onClick={() => setActiveSection("text")}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition
        ${activeSection === "text"
                      ? "bg-blue-500 text-white"
                      : "bg-neutral-800 text-gray-200 hover:bg-neutral-700"}`}
                >
                  Text
                </button>

              </div>
            </Card>
          </div>
          <div className={styles["media-menu"]}>
            {activeSection === "assets" && <Assets />}
            {activeSection === "text" && <TextPanel />}
          </div>
          <div className={styles["editor"]}>
            <Card>
              <Droppable />
            </Card>
          </div>
          {/* SHARED DRAWER (SHEET) */}
          <Sheet open={isRightDrawerOpen} onOpenChange={setIsRightDrawerOpen}>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle>Edit {drawerContent}</SheetTitle>
              </SheetHeader>
              <div className="py-4">
                {/* Render content based on which icon was clicked */}
                {drawerContent === "Settings" && <p>Settings Config...</p>}
                {drawerContent === "Layers" && <p>Layer Management...</p>}
              </div>
            </SheetContent>
          </Sheet>
          <div className={styles["end-bar"]}>
            <Card>
              <div className="flex flex-col gap-4 p-2">
                {/* Example Icons that trigger the drawer */}
                <button
                  onClick={() => handleOpenDrawer("Settings")}
                  className="p-2 hover:bg-neutral-700 rounded-md transition"
                >
                  <SettingsIcon className="w-5 h-5 text-white" />
                </button>

                <button
                  onClick={() => handleOpenDrawer("Layers")}
                  className="p-2 hover:bg-neutral-700 rounded-md transition"
                >
                  <LayersIcon className="w-5 h-5 text-white" />
                </button>
              </div>
            </Card>
          </div>
        </div>
      </div>
      <DragOverlay dropAnimation={null}>
        {activeId ? (
          <p>{activeId} hell0</p>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
