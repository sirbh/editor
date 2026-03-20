import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Play,
  ChevronsLeft,
  ChevronsRight,
  ArrowLeftFromLine,
} from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";

import { SnapModifier, AxisModifier } from "@dnd-kit/abstract/modifiers";
import { PointerActivationConstraints } from "@dnd-kit/dom";
import { DragDropProvider, PointerSensor, useDraggable, useDroppable } from "@dnd-kit/react";
import { useState } from "react";
import type { DragEndEvent } from "@dnd-kit/core";

type ItemDetail = {
  width: number;
  start: number; // <- here
};

type Item = {
  id: string;
  type: "text" | "image" | "video" | "audio";
  detail: ItemDetail;
};

type DataMap = Record<string, Item>;

export default function Seekbar() {
  const [data, setData] = useState<DataMap>({
    a1b2c3d: {
      id: "a1b2c3d",
      type: "image",
      detail: {
        width: 180,
        start: 45,
      },
    },
    x9y8z7k: {
      id: "x9y8z7k",
      type: "audio",
      detail: {
        width: 250,
        start: 120,
      },
    },
  });

  console.log(data)

  const { ref } = useDroppable({ id: 'droppable' });

  const handleDragEnd = (e) => {
    const id = e.operation.source?.id;
    if (!id) return;
    const { x } = e.operation.transform;

    setData((prev) => {
      const currentItem = prev[id];
      if (!currentItem) return prev;

      return {
        ...prev,
        [id]: {
          ...currentItem,
          detail: {
            ...currentItem.detail,
            // Add the movement (x) to the existing starting point
            start: currentItem.detail.start + x,
          },
        },
      };
    });
  };
  return (
    <DragDropProvider
      modifiers={[
        SnapModifier.configure({
          size: {
            x: 2,
            y: 40,
          },
        }),
      ]}
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
          {Object.entries(data).map((ele) => {
            return (
              <div key={ele[0]} ref={ref} className="w-full bg-transparent rounded h-[2.5rem] relative !py-[2px]">
                <div className="w-full bg-gray-200 rounded h-full">
                  <Draggable
                    id={ele[0]}
                    left={ele[1].detail.start}
                  >
                    <div
                      className="h-full bg-blue-200 rounded border border-blue-900"
                      style={{ width: ele[1].detail.width }}
                    ></div>
                  </Draggable>
                </div>
              </div>
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



