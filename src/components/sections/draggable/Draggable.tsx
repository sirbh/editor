import { useDraggable } from "@dnd-kit/core";

export default function Draggable({ children, id }: { children: React.ReactNode, id?: string }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: id || 'draggable',
  });



  return (
    <div ref={setNodeRef}  {...listeners} {...attributes}>
      {children}
    </div>
  );
}