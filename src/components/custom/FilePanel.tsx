"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Plus,
  Video,
  Music,
  FileText,
  MoreHorizontal,
  ChevronDown,
} from "lucide-react";
import Card from "../ui/card/Card";
import { CardTitle } from "../ui/card";

type FileItem = {
  id: string;
  name: string;
  type: "video" | "audio" | "file";
  duration?: string;
};

export default function MediaPanel() {
  const files: FileItem[] = [
    { id: "1", name: "vlog_final_v1.mp4", type: "video", duration: "0:45" },
    { id: "2", name: "background_track.mp3", type: "audio", duration: "3:12" },
    { id: "3", name: "script_notes.pdf", type: "file" },
    { id: "4", name: "b-roll_city.mov", type: "video", duration: "0:12" },
    { id: "5", name: "interview_clip.mp4", type: "video", duration: "1:20" },
    { id: "6", name: "voiceover.wav", type: "audio", duration: "2:05" },
    { id: "7", name: "extra_clip.mov", type: "video", duration: "0:30" },
    { id: "8", name: "music2.mp3", type: "audio", duration: "4:10" },
  ];

  return (
    <Card className="!p-4 h-full !flex flex-col overflow-hidden">
      {/* HEADER */}
      <CardTitle>Your media</CardTitle>

      {/* IMPORT BUTTON */}
      <Button className="w-full !mt-4 !mb-4">
        <Plus className="h-5 w-5 stroke-[3]" />
        Import media
        <ChevronDown className="h-4 w-4 ml-auto opacity-50" />
      </Button>

      {/* SCROLL AREA (FIXED) */}
       <ScrollArea className="flex-1 min-h-0 !pr-4 border-r border-gray-800">
        <div className="grid gap-3 p-2 [grid-template-columns:repeat(auto-fill,minmax(140px,1fr))]">
          {files.map((file) => (
            <div
              key={file.id}
              className="group relative flex flex-col w-full bg-zinc-900 rounded-lg overflow-hidden border border-zinc-800 hover:border-purple-500 hover:scale-[1.02] transition-all cursor-grab active:cursor-grabbing"
            >
              {/* PREVIEW */}
              <div className="aspect-video w-full bg-zinc-950 flex items-center justify-center relative">
                {file.type === "video" && (
                  <Video className="h-6 w-6 text-zinc-600" />
                )}
                {file.type === "audio" && (
                  <Music className="h-6 w-6 text-zinc-600" />
                )}
                {file.type === "file" && (
                  <FileText className="h-6 w-6 text-zinc-600" />
                )}

                {file.duration && (
                  <span className="absolute bottom-1 right-1 bg-black/70 text-[10px] px-1 rounded font-mono">
                    {file.duration}
                  </span>
                )}

                {/* HOVER */}
                <div className="absolute inset-0 bg-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Plus className="h-8 w-8 text-white drop-shadow-md" />
                </div>
              </div>

              {/* META */}
              <div className="p-2 flex items-center justify-between gap-1">
                <span className="text-[11px] font-medium truncate text-zinc-300">
                  {file.name}
                </span>

                <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-zinc-800 rounded">
                  <MoreHorizontal className="h-3 w-3 text-zinc-400" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
      
    </Card>
  );
}