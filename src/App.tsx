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

export default function App() {
  
  // const selectedAssets = useSelector((state: RootState) => state.assets.selectedAssests)
  const assets = useSelector((state: RootState) => state.assets.assets)
  const [activeId, setActiveId] = useState<UniqueIdentifier>("");
  console.log(assets);
  const dispatch = useDispatch();

  function handleDragStart(event:DragMoveEvent) {
     const { active } = event;
     setActiveId(active.id);
  }
  function handleDragEnd(event:DragMoveEvent) {
          console.log("callee")
         
          const { active, over } = event;
          if (over && over.id === 'droppable') {
            const draggedItem = assets.find((item) => item.id === active.id);
            console.log(draggedItem)
            if (draggedItem) {
              dispatch(selectAsset(draggedItem));
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
              <div></div>
            </Card>
          </div>
          <div className={styles["media-menu"]}>
            <Assets />
          </div>
          <div className={styles["editor"]}>
            <Card>
              <Droppable/>
            </Card>
          </div>
          <div className={styles["end-bar"]}>
            <Card>
              <div></div>
            </Card>
          </div>
        </div>
      </div>
      <DragOverlay dropAnimation={null}>
        {activeId ? (
          <p>{activeId}</p>
        ): null}
      </DragOverlay>
    </DndContext>
  );
}
