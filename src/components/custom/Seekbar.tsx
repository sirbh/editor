// import { useState } from "react";
// import type { ChangeEvent } from "react";

import { DndContext, useDraggable, useDroppable, type DragMoveEvent } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities"
import {
  restrictToHorizontalAxis,
  createSnapModifier,
  restrictToParentElement
} from '@dnd-kit/modifiers';
import { useState } from "react";
import { Rnd } from "react-rnd";


const gridSize = 20; // pixels
const snapToGridModifier = createSnapModifier(gridSize);

export default function Seekbar() {
  // const [value, setValue] = useState<number>(50);
  const [{ x, y }, setCordinates] = useState({ x: 0, y: 0 })

  function handleDragEnd(event: DragMoveEvent) {
    console.log("callee")
    console.log(event.delta)
    setCordinates(prev =>
    (
      {
        x: prev.x + event.delta.x,
        y: prev.y + event.delta.y
      }
    )
    )

  }



  return (
    <DndContext modifiers={[restrictToHorizontalAxis, snapToGridModifier, restrictToParentElement]} onDragEnd={handleDragEnd}>
      <div style={{ width: '100%', height: "240px", alignItems: "center", display: "flex", flexDirection: "column", justifyContent: "start", zIndex: 1, position: "relative", backgroundColor: "blue" }}>

        <div style={{ width: '100%' }}>
          {/* <Draggable cordinates={{x,y}}>
          <div style={{ width: "40px", height: "30px", backgroundColor: "brown" }}>

          </div>
        </Draggable> */}

          <Rnd
            default={{
              x: 0,
              y: 0,
              width: 320,
              height: 200,
            }}
            enableResizing={false}
            bounds={"parent"}
            dragAxis="x"
            dragGrid={[20,5]}
          >
            <div style={{height:"40px", backgroundColor:"brown"}}>

            </div>
          </Rnd>

        </div>
      </div>

    </DndContext>
  );
};



function Draggable({ children, id, cordinates }: { children: React.ReactNode, id?: string, cordinates: { x: number, y: number } }) {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: id || 'draggable',
  });

  // const x = transform? transform.x : 0;
  // const y = transform?transform.y:0;

  const { x, y } = cordinates



  return (
    <div ref={setNodeRef}  {...listeners} {...attributes} style={{
      transform: `translate3d(${x}px, ${y}px, 0)`, width: "fit-content"
    }}>
      {children}
    </div>
  );
}


function Droppable({ children }: { children: React.ReactNode }) {
  const { setNodeRef } = useDroppable({
    id: 'droppable',
  });



  return (
    <div ref={setNodeRef} style={{ width: "100%" }}>
      {children}
    </div>
  );
}
