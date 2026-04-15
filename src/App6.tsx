import React, { useState } from "react";
import { CheckCircle2, Video, Layout } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// --- TEMPLATE DATA ---
const TEMPLATE_DATA = [
  {
    meta: {
      templateId: "news_1",
      name: "News Headline",
      aspectRatio: "9:16",
      baseWidth: 1080,
      baseHeight: 1920,
      duration: 30,
    },
    styles: {
      headline: {
        fontSize: 0.05,
        fontWeight: "bold",
        color: "#fff",
        background: "#000000cc",
        padding: 0.015,
      },
    },
    scenes: [
      {
        id: "scene_1",
        start: 0,
        end: 5,
        elements: [
          {
            id: "video",
            type: "video",
            source: "{{clips[0]}}",
            position: { x: 0, y: 0 },
            size: { width: 1, height: 1 },
          },
          {
            id: "headline",
            type: "text",
            content: "{{headline}}",
            position: { x: 0.5, y: 0.82 },
            anchor: "center",
            maxWidth: 0.9,
            styleRef: "headline",
          },
        ],
      },
    ],
  },
  {
    meta: {
      templateId: "subtitle_1",
      name: "Subtitle Style",
      aspectRatio: "9:16",
      baseWidth: 1080,
      baseHeight: 1920,
      duration: 20,
    },
    styles: {
      subtitle: {
        fontSize: 0.035,
        color: "#fff",
        background: "#000000aa",
        padding: 0.01,
      },
    },
    scenes: [
      {
        id: "scene_1",
        start: 0,
        end: 5,
        elements: [
          {
            id: "video",
            type: "video",
            position: { x: 0, y: 0 },
            size: { width: 1, height: 1 },
          },
          {
            id: "subtitle",
            type: "text",
            content: "{{subtitle}}",
            position: { x: 0.5, y: 0.9 },
            anchor: "center",
            maxWidth: 0.8,
            styleRef: "subtitle",
          },
        ],
      },
    ],
  },
];

// --- COMPONENT ---
// --- SCALE HELPERS ---
const getStyle = (element) => {
  const pos = element.position || { x: 0, y: 0 };
  const size = element.size || { width: 0, height: 0 };

  return {
    position: "absolute",
    left: `${pos.x * 100}%`,
    top: `${pos.y * 100}%`,
    width: `${size.width * 100}%`,
    height: `${size.height * 100}%`,
    transform: element.anchor === "center" ? "translate(-50%, -50%)" : "none",
  };
};

// --- PREVIEW RENDERER ---
function TemplatePreview({ template }) {
  return (
    <div className="relative w-full aspect-[9/16] bg-black rounded-md overflow-hidden">
      {template.scenes[0].elements.map((el) => {
        if (el.type === "video") {
          return (
            <div
              key={el.id}
              style={getStyle(el)}
              className="bg-gray-800 border border-gray-600 flex items-center justify-center text-gray-300 text-xs"
            >
              🎬 Video Placeholder
            </div>
          );
        }

        if (el.type === "text") {
          const style = template.styles?.[el.styleRef] || {};

          return (
            <div
              key={el.id}
              style={getStyle(el)}
              className="text-center px-2"
            >
              <div
                className="inline-block"
                style={{
                  fontSize: `${style.fontSize * 100}vw`,
                  fontWeight: style.fontWeight || "normal",
                  color: style.color || "white",
                  background: style.background || "transparent",
                  padding: `${(style.padding || 0) * 100}%`,
                  borderRadius: "6px",
                }}
              >
                {el.content.replace("{{headline}}", "Breaking News Title")}
              </div>
            </div>
          );
        }

        return null;
      })}
    </div>
  );
}

// --- MAIN COMPONENT ---
export default function TemplateSelector() {
  const [selected, setSelected] = useState(TEMPLATE_DATA[0]);

  return (
    <div className="w-full max-w-5xl mx-auto p-6 space-y-6">
      
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Layout className="w-5 h-5" />
          Template Picker
        </h2>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {TEMPLATE_DATA.map((t) => {
          const isSelected = selected.meta.templateId === t.meta.templateId;

          return (
            <Card
              key={t.meta.templateId}
              onClick={() => setSelected(t)}
              className={cn(
                "cursor-pointer transition border-2",
                isSelected ? "border-green-500" : "border-transparent"
              )}
            >
              <CardContent className="p-3 space-y-3">

                {/* REAL PREVIEW */}
                <TemplatePreview template={t} />

                {/* TITLE */}
                <div className="flex items-center justify-between">
                  <span className="font-medium">{t.meta.name}</span>
                  {isSelected && (
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                  )}
                </div>

              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* SELECTED INFO */}
      <div className="p-4 rounded-md bg-muted">
        Selected: <b>{selected.meta.name}</b>
      </div>
    </div>
  );
}
