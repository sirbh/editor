import { DndContext, type DragMoveEvent } from '@dnd-kit/core';
import { useDraggable } from '@dnd-kit/core';
import { useDroppable } from '@dnd-kit/core';
import { useState } from 'react';

export default function App() {

  const [items, setItems] = useState([
    { id: 'item-1', label: 'Item 1' },
    { id: 'item-2', label: 'Item 2' },
    { id: 'item-3', label: 'Item 3' },
  ]);

  const [droppedItems, setDroppedItems] = useState<{ id: string; label: string }[]>([]);
  function handleDragEnd(event:DragMoveEvent) {
    const { active, over } = event;
    if (over && over.id === 'droppable') {
      // Move the dragged item into droppedItems
      const draggedItem = items.find((item) => item.id === active.id);
      if (draggedItem) {
        setItems((prev) => prev.filter((item) => item.id !== active.id));
        setDroppedItems((prev) => [...prev, draggedItem]);
      }
    }
  }
  return (
    <DndContext onDragEnd={handleDragEnd}>
        <div>
          <h3>Items</h3>
          {items.map((item) => (
            <Draggable key={item.id} id={item.id}>
              {item.label}
            </Draggable>
          ))}
        </div>

        <Droppable>
          {droppedItems.length > 0
            ? droppedItems.map((item) => (
                <div key={item.id} style={{ padding: '5px' }}>
                  {item.label}
                </div>
              ))
            : 'Drop here'}
        </Droppable>
    </DndContext>
  )
}


function Droppable({ children }: { children: React.ReactNode }) {
  const { isOver, setNodeRef } = useDroppable({
    id: 'droppable',
  });
  const style = {
    color: isOver ? 'green' : undefined,
  };


  return (
    <div ref={setNodeRef} style={style}>
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