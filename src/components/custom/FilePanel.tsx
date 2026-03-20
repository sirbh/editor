"use client";

import { useRef, useEffect, type ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Plus,
  MoreHorizontal,
  ChevronDown,
  Video,
  Image as ImageIcon,
} from "lucide-react";
import Card from "../ui/card/Card";
import { CardTitle } from "../ui/card";

import { useDispatch, useSelector } from "react-redux";
import { addMediaAsset, type MediaAsset } from "@/store/assets";
import type { RootState } from "@/store/store";
import Draggable from "../sections/draggable/Draggable";

export default function MediaPanel() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const dispatch = useDispatch();
  const assets = useSelector((state: RootState) => state.assets.assets);

  // Filter for display
  const mediaAssets = assets.filter(
    (asset): asset is MediaAsset =>
      asset.type === "image" || asset.type === "video"
  );

  // Production Tip: Cleanup Object URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      mediaAssets.forEach((asset) => {
        if (asset.url.startsWith("blob:")) {
          URL.revokeObjectURL(asset.url);
        }
      });
    };
  }, [mediaAssets]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const newFiles = Array.from(e.target.files)
      .map((file) => {
        let mediaType: "image" | "video" | null = null;
        if (file.type.startsWith("image")) mediaType = "image";
        if (file.type.startsWith("video")) mediaType = "video";

        if (!mediaType) return null;

        return {
          name: file.name,
          size: file.size,
          type: mediaType,
          // Create a local preview URL
          url: URL.createObjectURL(file),
        };
      })
      .filter((item): item is NonNullable<typeof item> => item !== null);

    dispatch(addMediaAsset(newFiles as Omit<MediaAsset, "id">[]));
    
    // Reset input so the same file can be uploaded again if deleted
    e.target.value = "";
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card className="!p-4 h-full !flex flex-col overflow-hidden bg-zinc-950 border-zinc-800">
      <CardTitle>Your media</CardTitle>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        multiple
        onChange={handleChange}
        className="hidden"
      />

      <Button 
        variant="secondary"
        className="w-full !mt-4 !mb-4 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border-none" 
        onClick={handleClick}
      >
        <Plus className="h-5 w-5 stroke-[3] mr-2" />
        Import media
        <ChevronDown className="h-4 w-4 ml-auto opacity-50" />
      </Button>

      <ScrollArea className="flex-1 min-h-0 !pr-4">
        <div className="grid gap-3 p-1 [grid-template-columns:repeat(auto-fill,minmax(150px,1fr))]">
          
          {mediaAssets.map((file) => (
            <Draggable id={file.id} key={file.id}>
            <div
              key={file.id}
              className="group relative flex flex-col w-full bg-zinc-900 rounded-sm overflow-hidden border border-zinc-800 hover:border-purple-500/50 transition-all cursor-grab active:cursor-grabbing"
            >
              {/* THUMBNAIL CONTAINER - Fixed 16:9 Aspect Ratio */}
              <div className="aspect-video w-full bg-black flex items-center justify-center relative overflow-hidden">
                {file.type === "video" ? (
                  <video 
                    src={`${file.url}#t=0.1`} 
                    className="w-full h-full object-contain pointer-events-none"
                    muted
                    preload="metadata"
                  />
                ) : (
                  <img 
                    src={file.url} 
                    alt={file.name}
                    className="w-full h-full object-contain pointer-events-none"
                  />
                )}

                {/* TYPE BADGE */}
                <div className="absolute top-2 left-2 bg-black/40 backdrop-blur-md p-1 rounded-md border border-white/10">
                  {file.type === "video" ? (
                    <Video className="h-3 w-3 text-white/90" />
                  ) : (
                    <ImageIcon className="h-3 w-3 text-white/90" />
                  )}
                </div>

                {/* HOVER OVERLAY */}
                <div className="absolute inset-0 bg-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="bg-purple-600 p-2 rounded-full shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                    <Plus className="h-5 w-5 text-white" />
                  </div>
                </div>
              </div>

              {/* META INFO */}
              <div className="!pxs-2 flex items-center justify-between gap-2 bg-zinc-900">
                <span className="text-[11px] font-medium truncate text-zinc-400">
                  {file.name}
                </span>

                <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-zinc-800 rounded-md transition-opacity">
                  <MoreHorizontal className="h-3.5 w-3.5 text-zinc-500" />
                </button>
              </div>
            </div>
            </Draggable>
          ))}

        </div>
      </ScrollArea>
    </Card>
  );
}