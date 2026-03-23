import { Button } from "@/components/ui/button";
import {
  Play,
  ChevronsLeft,
  ChevronsRight,
  ArrowLeftFromLine,
} from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";

import { DragDropProvider, useDraggable, useDroppable, type DragDropEventHandlers } from "@dnd-kit/react";
import { useRef, useState } from "react";
import { SnapModifier } from "@/lib/MyModi";
import ClipchampSeekbar, { Slider } from "./slider";





type ItemType = "text" | "image" | "video" | "audio";

type TimelineItem = {
  id: string;
  type: ItemType;
  start: number;
  width: number;
};

type Layer = {
  id: string;
  name: string;
  itemIds: string[]; // ordered item IDs
};


type TimelineState = {
  items: Record<string, TimelineItem>; // itemId → item
  layers: Layer[];
};


const sampleTimeline: TimelineState = {
  items: {
    "item1": { id: "item1", type: "video", start: 0, width: 100 },
    "item2": { id: "item2", type: "text", start: 112, width: 60 },
    "item3": { id: "item3", type: "audio", start: 180, width: 150 },
    "item4": { id: "item4", type: "image", start: 15, width: 260 },
    "item5": { id: "item5", type: "text", start: 20, width: 170 }
  },
  layers: [
    {
      id: "layer1",
      name: "Video & Text Layer",
      itemIds: ["item1", "item2", "item3"] // ordered items in this layer
    },
    {
      id: "layer2",
      name: "Audio & Image Layer",
      itemIds: ["item4"] // ordered items in this layer
    },
  ]
};



export default function Seekbar() {
  const [data, setData] = useState<TimelineState>(sampleTimeline);



  // const handleDragEnd: DragDropEventHandlers["onDragEnd"] = (e, m) => {
  //   const { operation } = e;
  //   const sourceId = operation.source?.id as string;
  //   const targetId = operation.target?.id as string;

  //     const collisions = m.collisionObserver.collisions;


  // // 🔹 Apply only when exactly 2 collisions
  // // if (collisions.length>=2) {

  // //   console.log(collisions)
  // //   console.log("two")
  // //   const el1 = m.registry.droppables.get(collisions[0].id)?.element;
  // //   const el2 = m.registry.droppables.get(collisions[1].id)?.element;

  // //   if (el1 instanceof HTMLElement) {
  // //     el1.style.borderBottom = "";
  // //     el1.style.borderTop = "";
  // //   }

  // //   if (el2 instanceof HTMLElement) {
  // //     el2.style.borderTop = "";
  // //     el2.style.borderBottom = "";
  // //   }
  // // }


  //   if (!sourceId || !targetId) return;

  //   const translationX = operation.transform.x;

  //   setData((prev) => {
  //     const currentItem = prev.items[sourceId];
  //     if (!currentItem) return prev;

  //     const newStart = Math.max(0, currentItem.start + translationX);

  //     // Find source layer
  //     const sourceLayer = prev.layers.find((l) =>
  //       l.itemIds.includes(sourceId)
  //     );

  //     const targetLayerId = targetId;

  //     // Clone items
  //     const nextItems: TimelineState["items"] = {
  //       ...prev.items,
  //       [sourceId]: { ...currentItem, start: newStart },
  //     };

  //     let nextLayers = [...prev.layers];

  //     // Move item between layers if needed
  //     if (sourceLayer && sourceLayer.id !== targetLayerId) {
  //       nextLayers = nextLayers.map((layer) => {
  //         if (layer.id === sourceLayer.id) {
  //           return {
  //             ...layer,
  //             itemIds: layer.itemIds.filter((id) => id !== sourceId),
  //           };
  //         }
  //         if (layer.id === targetLayerId) {
  //           return {
  //             ...layer,
  //             itemIds: [...layer.itemIds, sourceId],
  //           };
  //         }
  //         return layer;
  //       });
  //     }

  //     // 🔥 APPLY NON-OVERLAP LOGIC ON TARGET LAYER
  //     const targetLayer = nextLayers.find(
  //       (l) => l.id === (sourceLayer?.id === targetLayerId ? sourceLayer.id : targetLayerId)
  //     );

  //     if (!targetLayer) {
  //       return { items: nextItems, layers: nextLayers };
  //     }

  //     // Get items in that layer
  //     const layerItems = targetLayer.itemIds.map((id) => nextItems[id]);

  //     // Sort by start
  //     layerItems.sort((a, b) => a.start - b.start);

  //     // Sweep and fix overlaps
  //     for (let i = 0; i < layerItems.length; i++) {
  //       const current = layerItems[i];

  //       if (current.start < 0) current.start = 0;

  //       if (i === 0) continue;

  //       const prevItem = layerItems[i - 1];
  //       const prevEnd = prevItem.start + prevItem.width;

  //       if (current.start < prevEnd) {
  //         current.start = prevEnd;
  //       }
  //     }

  //     // Write back corrected positions
  //     const finalItems = { ...nextItems };
  //     layerItems.forEach((item) => {
  //       finalItems[item.id] = item;
  //     });

  //     return {
  //       items: finalItems,
  //       layers: nextLayers,
  //     };
  //   });
  // };

const handleDragEnd: DragDropEventHandlers["onDragEnd"] = (e, m) => {
  const { operation } = e;
  const sourceId = operation.source?.id as string;
  const targetId = operation.target?.id as string;

  const collisions = m.collisionObserver.collisions;

  if (!sourceId) return;

  // 🔥 clear borders on drop
  handleDragMove.clear();

  const translationX = operation.transform.x;

  setData((prev) => {
    const currentItem = prev.items[sourceId];
    if (!currentItem) return prev;

    const newStart = Math.max(0, currentItem.start + translationX);

    const nextItems = {
      ...prev.items,
      [sourceId]: { ...currentItem, start: newStart },
    };

    let nextLayers = [...prev.layers];

    // =========================
    // 🔥 CASE 1: BETWEEN LAYERS (Create New)
    // =========================
    if (collisions.length === 2) {
      const [c1, c2] = collisions;

      const el1 = m.registry.droppables.get(c1.id)?.element;
      const el2 = m.registry.droppables.get(c2.id)?.element;
      const dragEl = m.registry.draggables.get(sourceId)?.element;

      if (
        el1 instanceof HTMLElement &&
        el2 instanceof HTMLElement &&
        dragEl instanceof HTMLElement
      ) {
        const rect1 = el1.getBoundingClientRect();
        const rect2 = el2.getBoundingClientRect();
        const dragRect = dragEl.getBoundingClientRect();

        let topRect: DOMRect, bottomRect: DOMRect;

        if (rect1.top < rect2.top) {
          topRect = rect1;
          bottomRect = rect2;
        } else {
          topRect = rect2;
          bottomRect = rect1;
        }

        const isBetween =
          dragRect.top - topRect.top > 10 && dragRect.top - topRect.top < 30;

        if (isBetween) {
          const idx1 = prev.layers.findIndex((l) => l.id === c1.id);
          const idx2 = prev.layers.findIndex((l) => l.id === c2.id);

          if (idx1 !== -1 && idx2 !== -1) {
            const insertIndex = Math.min(idx1, idx2) + 1;

            // Remove from old layer before inserting into new
            nextLayers = nextLayers.map((layer) => ({
              ...layer,
              itemIds: layer.itemIds.filter((id) => id !== sourceId),
            }));

            // Create new layer
            nextLayers.splice(insertIndex, 0, {
              id: `layer-${Date.now()}`,
              name: "New Layer",
              itemIds: [sourceId],
            });

            // We skip "Case 2" and go straight to cleanup below
          }
        }
      }
    } 
    // =========================
    // 🔥 CASE 2: NORMAL DROP (Change Layer)
    // =========================
    else {
      const sourceLayer = prev.layers.find((l) => l.itemIds.includes(sourceId));

      if (sourceLayer && targetId && sourceLayer.id !== targetId) {
        nextLayers = nextLayers.map((layer) => {
          if (layer.id === sourceLayer.id) {
            return {
              ...layer,
              itemIds: layer.itemIds.filter((id) => id !== sourceId),
            };
          }
          if (layer.id === targetId) {
            return {
              ...layer,
              itemIds: [...layer.itemIds, sourceId],
            };
          }
          return layer;
        });
      }
    }

    // =========================
    // 🔥 NON-OVERLAP FIX
    // =========================
    const targetLayer = nextLayers.find((l) => l.itemIds.includes(sourceId));

    if (targetLayer) {
      const items = targetLayer.itemIds
        .map((id) => nextItems[id])
        .sort((a, b) => a.start - b.start);

      for (let i = 1; i < items.length; i++) {
        const prevItem = items[i - 1];
        const curr = items[i];
        const prevEnd = prevItem.start + (prevItem.width || 0);

        if (curr.start < prevEnd) {
          curr.start = prevEnd;
        }
      }

      items.forEach((it) => {
        nextItems[it.id] = it;
      });
    }

    // =========================
    // 🔥 CLEANUP: REMOVE EMPTY LAYERS
    // =========================
    // Filter out any layers that have 0 items.
    let finalLayers = nextLayers.filter((layer) => layer.itemIds.length > 0);

    // Production Suggestion: Ensure there's always at least one layer so the 
    // timeline drop zone doesn't vanish entirely.
    if (finalLayers.length === 0) {
      finalLayers = [{ id: "layer-default", name: "Layer 1", itemIds: [] }];
    }

    return {
      items: nextItems,
      layers: finalLayers,
    };
  });
};


const handleDragMove = (() => {
  let prevEl1: HTMLElement | null = null;
  let prevEl2: HTMLElement | null = null;

  const clear = () => {
    if (prevEl1) prevEl1.style.borderBottom = "";
    if (prevEl2) prevEl2.style.borderTop = "";
    prevEl1 = null;
    prevEl2 = null;
  };

  const fn = ((e, m) => {
    const collisions = m.collisionObserver.collisions;
    const draggable = m.registry.draggables.get(e.operation.source?.id || "");
    const dragEl = draggable?.element;

    console.log(e.operation.target?.id)

    if (!(dragEl instanceof HTMLElement)) return;

    const dragRect = dragEl.getBoundingClientRect();

    if (collisions.length !== 2) {
      clear();
      return;
    }

    const [c1, c2] = collisions;

    const el1 = m.registry.droppables.get(c1.id)?.element;
    const el2 = m.registry.droppables.get(c2.id)?.element;

    if (!(el1 instanceof HTMLElement) || !(el2 instanceof HTMLElement)) {
      clear();
      return;
    }

    const rect1 = el1.getBoundingClientRect();
    const rect2 = el2.getBoundingClientRect();

    let topEl: HTMLElement, bottomEl: HTMLElement;
    let topRect: DOMRect, bottomRect: DOMRect;

    if (rect1.top < rect2.top) {
      topEl = el1;
      bottomEl = el2;
      topRect = rect1;
      bottomRect = rect2;
    } else {
      topEl = el2;
      bottomEl = el1;
      topRect = rect2;
      bottomRect = rect1;
    }

    // ✅ CORRECT GAP DETECTION
    const gapStart = topRect.bottom;
    const gapEnd = bottomRect.top;

    const isBetween =
      dragRect.top - topRect.top > 15 && dragRect.top - topRect.top < 25
      // dragRect.bottom < gapEnd + 10;

    // avoid unnecessary DOM updates
    if (isBetween) {
      if (prevEl1 !== topEl || prevEl2 !== bottomEl) {
        clear();

        topEl.style.borderBottom = "2px solid red";
        bottomEl.style.borderTop = "2px solid red";

        prevEl1 = topEl;
        prevEl2 = bottomEl;
      }
    } else {
      clear();
    }
  }) as DragDropEventHandlers["onDragMove"] & { clear: () => void };

  fn.clear = clear;

  return fn;
})();


  return (
    <DragDropProvider
      // modifiers={(defaults) => [...defaults, 
      //   SnapModifier.configure({
      //     size:{
      //       x:2,
      //       y:40
      //     }
      //   })
      // ]}
      onDragEnd={handleDragEnd}
      onDragMove={handleDragMove}

    >
      <div className="flex flex-col h-full">
        <div className="relative p-6 h-[3rem] w-full !mt-4">
          {/* CENTER - Play button */}
          <div className="absolute left-1/2 -translate-x-1/2">
            <Button className="w-10 h-10 rounded-full flex items-center justify-center">
              <Play />
            </Button>
          </div>

          {/* LEFT of center */}
          <div className="absolute right-1/2 -translate-x-8 flex gap-2">
            <Button
              variant="ghost"
              className="w-10 h-10 rounded-full flex items-center justify-center"
            >
              <ArrowLeftFromLine />
            </Button>
            <Button
              variant="ghost"
              className="w-10 h-10 rounded-full flex items-center justify-center"
            >
              <ChevronsLeft />
            </Button>
            <Button
              variant="ghost"
              className="w-10 h-10 rounded-full flex items-center justify-center"
            >
              <ChevronsRight />
            </Button>
          </div>

          {/* RIGHT of center */}
          <div className="absolute left-1/2 translate-x-12 h-10 flex items-center">
            0:23/4:00
          </div>
        </div>
        <ScrollArea className="flex-1 min-h-0 !pr-4">
          {data.layers.map((ele, i) => {
            return (
              <Droppable id={ele.id} key={ele.id} index={i}>
                <div className="w-full bg-gray-200 rounded h-full">
                  {
                    ele.itemIds.map(i => {
                      return (
                        <Draggable
                          key={i}
                          id={i}
                          left={data.items[i].start}
                        >
                          <div
                            className="h-full bg-blue-200 rounded border border-blue-900"
                            style={{ width: data.items[i].width }}
                          ></div>
                        </Draggable>
                      )
                    })
                  }

                </div>
              </Droppable>
            );
          })}
        </ScrollArea>
      </div>
    </DragDropProvider>
  );
}





function Draggable(props) {
  const { ref } = useDraggable({
    id: props.id,
    modifiers: [
      SnapModifier.configure({
        size: {
          x: 2,
          y: 5
        }
      })
    ]
  });


  return (
    <div
      ref={ref}
      className={`h-full absolute top-0 !py-[2px]`}
      style={{ left: props.left }}
    >
      {props.children}
    </div>
  );
}

function Droppable(props) {

  console.log(props.index)
  const { ref } = useDroppable({
    id: props.id,
  });

  return (
    <div ref={ref} className="w-full bg-transparent rounded h-[2.5rem] relative !py-[2px] !z-10">
      {props.children}
    </div>
  );
}



