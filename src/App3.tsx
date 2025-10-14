import { DndContext, useDraggable, useDroppable, type DragMoveEvent } from "@dnd-kit/core";
import { useState } from "react";

interface items {
    type: 'video' | 'text' | 'image';
    id: string;
    duration: number
}

const MIN_TIME_LINE = 120;

const tempAssets: items[] = [
    { type: 'video', id: '1', duration: 20 },
    { type: 'text', id: '2', duration: 10 },
    { type: 'image', id: '3', duration: 10 },
];

export default function App(){
    const [assets, setAssets] = useState<items[]>(tempAssets);
    const [layers, setLayers] = useState<items[]>([]);

    function handleDragEnd(event:DragMoveEvent) {
        const { active, over } = event;
        if (over && over.id === 'droppable') {
          // Move the dragged item into droppedItems
          const draggedItem = assets.find((item) => item.id === active.id);
          if (draggedItem) {
            setLayers((prev) => [...prev, draggedItem]);
          }
        }
      }

    return <DndContext onDragEnd={handleDragEnd}>
        <div>
            {assets.map(asset => (
                <div style={{display:'flex', flexDirection:'column', width:'100px', margin:'10px', border:'1px solid black', padding:'10px', borderRadius:'5px', alignItems:'center'}}>
                  <Draggable key={asset.id} id={asset.id}>
                    {asset.type}
                  </Draggable>

                </div>
            ))}
        </div>

        <Droppable>
            {
                layers.length > 0 ? layers.map(layer => (
                    <div key={layer.id} style={{width:layer.duration, height:'20px', backgroundColor:'lightblue'}}>
                        {layer.type}
                    </div>
                )) : <p>Drop here</p>
            }
        </Droppable>
    </DndContext>
}

function Droppable({ children }: { children: React.ReactNode }) {
  const { isOver, setNodeRef } = useDroppable({
    id: 'droppable',
  });


  return (
    <div ref={setNodeRef} style={{
        display: 'flex',
        flexDirection:'column',
        border: '1px dashed gray',
        padding: '10px',
        borderRadius: '5px',
        backgroundColor: isOver ? 'lightgreen' : 'lightgray',
        maxHeight: '200px',
        alignItems: 'center',
        justifyContent: 'center',
    }}>
      {children}
    </div>
  );
}


function Draggable({ children, id }: { children: React.ReactNode, id?: string }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: id || 'draggable',
  });
  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;


  return (
    <button ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {children}
    </button>
  );
}

