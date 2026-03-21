import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Play,
  ChevronsLeft,
  ChevronsRight,
  ArrowLeftFromLine,
} from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";

import { RestrictToHorizontalAxis } from "@dnd-kit/abstract/modifiers"
import { DragDropProvider, useDraggable, useDroppable, type DragDropEventHandlers } from "@dnd-kit/react";
import {useSortable} from "@dnd-kit/react/sortable"
import { useState } from "react";
import { SnapModifier } from "@/lib/MyModi";





type ItemType = "text" | "image" | "video" | "audio";

type TimelineItem = {
  id: string;
  type: ItemType;
  start: number;
  duration: number;
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
    "item1": { id: "item1", type: "video", start: 0, duration: 10, width: 100 },
    "item2": { id: "item2", type: "text", start: 12, duration: 5, width: 60 },
    "item3": { id: "item3", type: "audio", start: 5, duration: 8, width: 150 },
    "item4": { id: "item4", type: "image", start: 15, duration: 10, width: 160 },
    "item5": { id: "item5", type: "text", start: 20, duration: 7, width: 70 }
  },
  layers: [
    {
      id: "layer1",
      name: "Video & Text Layer",
      itemIds: ["item1"] // ordered items in this layer
    },
    {
      id: "layer2",
      name: "Audio & Image Layer",
      itemIds:["item4"] // ordered items in this layer
    }
  ]
};



export default function Seekbar() {
  const [data, setData] = useState<TimelineState>(sampleTimeline);

console.log(data)
const handleDragEnd: DragDropEventHandlers["onDragEnd"] = (e) => {

  
  const { operation } = e;
  const sourceId = operation.source?.id as string;
  const targetId = operation.target?.id as string;

  if (!sourceId || !targetId) return;
  console.log("dragging")

  // 1. Calculate the new 'start' position (X-axis)
  // We use the translation from the drag event to update the item's start point
  const translationX = operation.transform.x;
  
  setData((prev) => {
    const currentItem = prev.items[sourceId];
    const newStart = Math.max(0, currentItem.start + translationX);

    // 2. Determine if the layer has changed
    // Find which layer currently owns this item
    const sourceLayer = prev.layers.find((l) => l.itemIds.includes(sourceId));
    console.log(sourceLayer?.id)
    const targetLayerId = targetId; // In your code, Droppable ID is the layer ID
    console.log(targetId)

    // Clone the items and layers
    const nextItems = {
      ...prev.items,
      [sourceId]: { ...currentItem, start: newStart },
    };

    let nextLayers = [...prev.layers];

    // 3. If dropped on a new layer, move the reference
    if (sourceLayer && sourceLayer.id !== targetLayerId) {
      console.log("layer diffrent")
      nextLayers = nextLayers.map((layer) => {
        // Remove from old layer
        if (layer.id === sourceLayer.id) {
          return { ...layer, itemIds: layer.itemIds.filter((id) => id !== sourceId) };
        }
        // Add to new layer
        if (layer.id === targetLayerId) {
          return { ...layer, itemIds: [...layer.itemIds, sourceId] };
        }
        return layer;
      });
    }

    return {
      items: nextItems,
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
                    ele.itemIds.map((i,ind) => {
                        console.log(ind)
                      return (
                        <Sortable
                          index={ind}
                          key={i}
                          id={i}
                          left={data.items[i].start}
                        >
                          <div
                            className="h-full bg-blue-200 rounded border border-blue-900"
                            style={{ width: data.items[i].width }}
                          ></div>
                        </Sortable>
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
    modifiers:[
     SnapModifier.configure({
      size:{
        x:2,
        y:40
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
  const {ref} = useDroppable({
    id: props.id,

  });

  return (
    <div ref={ref} className="w-full bg-transparent rounded h-[2.5rem] relative !py-[2px]">
      {props.children}
    </div>
  );
}


function Sortable(props) {
  const {ref} = useSortable({id:props.id, index:props.index, modifiers:[
    SnapModifier.configure({
        size:{
            x:2,
            y:40
        }
    })
  ]});

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



