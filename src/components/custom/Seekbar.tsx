// import { useState } from "react";
// import type { ChangeEvent } from "react";

import { DndContext, useDraggable, useDroppable, type DragMoveEvent } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities"
import {
  restrictToHorizontalAxis,
  createSnapModifier,
  restrictToParentElement
} from '@dnd-kit/modifiers';
import { useEffect, useState } from "react";
import { Rnd } from "react-rnd";



const gridSize = 20; // pixels
const snapToGridModifier = createSnapModifier(gridSize);

export default function Seekbar() {
  // const [value, setValue] = useState<number>(50);
  const duration_sec = 120
  const duration_px = 750
  const slot = (duration_px*16.6)/(120*1000)


  const [time, setTime] = useState(0);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    let interval:NodeJS.Timeout;
    if (playing) {
      interval = setInterval(() => {
        setTime((t) => (t < duration_sec*1000 ? t + 16.6 : t));
      }, 16.6); // advance 1 sec per second
    }
    return () => clearInterval(interval);
  }, [playing]);


  return (
    <DndContext modifiers={[restrictToHorizontalAxis, snapToGridModifier, restrictToParentElement]}>
      <>
      <p>{time}</p>
      <button onClick={()=>{setPlaying(prev=>!prev)}}>{playing?"Stop":"Play"}</button>
      <input value={time} type="range" step={slot} min={0} max={duration_sec*1000} onChange={(e) => setTime(parseFloat(e.target.value))} style={{width:`${duration_px}px`}}></input>
      <div style={{ width: `${duration_px}px`, height: "240px", alignItems: "center", display: "flex", flexDirection: "column", justifyContent: "start", zIndex: 1, position: "relative", backgroundColor: "blue" }}>

        <div style={{ width: '100%' }}>

          <Rnd
            onDrag={(e, data)=>{
                console.log(data.x)
            }}
            default={{
              x: 0,
              y: 0,
              width: 320,
              height: 200,
            }}
            enableResizing={false}
            bounds={"parent"}
            dragAxis="x"
            dragGrid={[slot,5]}
          >
            <div style={{height:"40px", backgroundColor:"brown"}}>

            </div>
          </Rnd>

        </div>
      </div>
      </>

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
