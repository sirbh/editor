import React, { useState } from "react";

export default function DragDropExample() {
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [dropItems, setDropItems] = useState<string[]>([]);

  // When drag starts
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, item: string) => {
    setDraggedItem(item);
  };

  // Allow drop
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); // important!
  };

  // On drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (draggedItem) {
      setDropItems((prev) => [...prev, draggedItem]);
      setDraggedItem(null);
    }
  };

  return (
    <div style={{ display: "flex", gap: "40px", padding: "20px" }}>
      {/* Draggable Items */}
      <div>
        <h3>Drag these:</h3>
        {["🍎 Apple", "🍌 Banana", "🍊 Orange"].map((item) => (
          <div
            key={item}
            draggable
            onDragStart={(e) => handleDragStart(e, item)}
            style={{
              padding: "8px",
              margin: "5px",
              background: "#ddd",
              cursor: "grab",
              borderRadius: "5px",
            }}
          >
            {item}
          </div>
        ))}
      </div>

      {/* Drop Area */}
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        style={{
          width: "200px",
          minHeight: "200px",
          border: "2px dashed gray",
          borderRadius: "10px",
          padding: "10px",
        }}
      >
        <h3>Dropped here:</h3>
        {dropItems.map((item, index) => (
          <div
            key={index}
            style={{
              margin: "5px",
              padding: "5px",
              background: "#b3e5fc",
              borderRadius: "5px",
            }}
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}
