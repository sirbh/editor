import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Play,
  ChevronsLeft,
  ChevronsRight,
  ArrowLeftFromLine,
} from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";

import { DragDropProvider, useDraggable, useDroppable, type DragDropEventHandlers } from "@dnd-kit/react";
import { useState } from "react";
import { SnapModifier } from "@/lib/MyModi";





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
    {
      id: "layer3",
      name: "Audio & Image Layer",
      itemIds: [] // ordered items in this layer
    },
    {
      id: "layer4",
      name: "Audio & Image Layer",
      itemIds: [] // ordered items in this layer
    },
    {
      id: "layer5",
      name: "Audio & Image Layer",
      itemIds: [] // ordered items in this layer
    },
    {
      id: "layer6",
      name: "Audio & Image Layer",
      itemIds: [] // ordered items in this layer
    },
    {
      id: "layer7",
      name: "Audio & Image Layer",
      itemIds: [] // ordered items in this layer
    },
    {
      id: "layer8",
      name: "Audio & Image Layer",
      itemIds: [] // ordered items in this layer
    },
    {
      id: "layer9",
      name: "Audio & Image Layer",
      itemIds: [] // ordered items in this layer
    },
  ]
};



export default function Seekbar() {
  const [data, setData] = useState<TimelineState>(sampleTimeline);
 


  const handleDragEnd: DragDropEventHandlers["onDragEnd"] = (e, m) => {
    const { operation } = e;
    const sourceId = operation.source?.id as string;
    const targetId = operation.target?.id as string;

    console.log(m.collisionObserver.collisions[0].value)


    if (!sourceId || !targetId) return;

    const translationX = operation.transform.x;

    setData((prev) => {
      const currentItem = prev.items[sourceId];
      if (!currentItem) return prev;

      const newStart = Math.max(0, currentItem.start + translationX);

      // Find source layer
      const sourceLayer = prev.layers.find((l) =>
        l.itemIds.includes(sourceId)
      );

      const targetLayerId = targetId;

      // Clone items
      const nextItems: TimelineState["items"] = {
        ...prev.items,
        [sourceId]: { ...currentItem, start: newStart },
      };

      let nextLayers = [...prev.layers];

      // Move item between layers if needed
      if (sourceLayer && sourceLayer.id !== targetLayerId) {
        nextLayers = nextLayers.map((layer) => {
          if (layer.id === sourceLayer.id) {
            return {
              ...layer,
              itemIds: layer.itemIds.filter((id) => id !== sourceId),
            };
          }
          if (layer.id === targetLayerId) {
            return {
              ...layer,
              itemIds: [...layer.itemIds, sourceId],
            };
          }
          return layer;
        });
      }

      // 🔥 APPLY NON-OVERLAP LOGIC ON TARGET LAYER
      const targetLayer = nextLayers.find(
        (l) => l.id === (sourceLayer?.id === targetLayerId ? sourceLayer.id : targetLayerId)
      );

      if (!targetLayer) {
        return { items: nextItems, layers: nextLayers };
      }

      // Get items in that layer
      const layerItems = targetLayer.itemIds.map((id) => nextItems[id]);

      // Sort by start
      layerItems.sort((a, b) => a.start - b.start);

      // Sweep and fix overlaps
      for (let i = 0; i < layerItems.length; i++) {
        const current = layerItems[i];

        if (current.start < 0) current.start = 0;

        if (i === 0) continue;

        const prevItem = layerItems[i - 1];
        const prevEnd = prevItem.start + prevItem.width;

        if (current.start < prevEnd) {
          current.start = prevEnd;
        }
      }

      // Write back corrected positions
      const finalItems = { ...nextItems };
      layerItems.forEach((item) => {
        finalItems[item.id] = item;
      });

      return {
        items: finalItems,
        layers: nextLayers,
      };
    });
  };




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
      // onDragMove={handleDragMove}

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
        <div className="h-[1.5rem] bg-transparent">
          <Slider />
        </div>
        <ScrollArea className="flex-1 min-h-0 !pr-4">
          {data.layers.map((ele) => {
            return (
              <Droppable id={ele.id} key={ele.id}>
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
          y: 40
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
  const { ref } = useDroppable({
    id: props.id,

  });

  return (
    <div ref={ref} className="w-full bg-transparent rounded h-[2.5rem] relative !py-[2px]">
      {props.children}
    </div>
  );
}



