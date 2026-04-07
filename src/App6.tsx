import React, { useState } from 'react';
import { CheckCircle2, Video, Layout } from 'lucide-react';
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
      duration: 30
    },
    styles: {
      headline: { fontSize: 0.05, fontWeight: "bold", color: "#fff", background: "#000000cc", padding: 0.015 }
    },
    scenes: [
      {
        id: "scene_1",
        start: 0,
        end: 5,
        elements: [
          { id: "video", type: "video", source: "{{clips[0]}}", position: { x: 0, y: 0 }, size: { width: 1, height: 1 } },
          { id: "overlay", type: "shape", position: { x: 0, y: 0.7 }, size: { width: 1, height: 0.3 }, style: { background: "#000000aa" } },
          { id: "headline", type: "text", content: "{{headline}}", position: { x: 0.5, y: 0.82 }, anchor: "center", maxWidth: 0.9, styleRef: "headline" }
        ]
      }
    ]
  },
  {
    meta: {
      templateId: "subtitle_1",
      name: "Subtitle Style",
      aspectRatio: "9:16",
      baseWidth: 1080,
      baseHeight: 1920
    },
    styles: {
      subtitle: { fontSize: 0.035, color: "#fff", background: "#000000aa", padding: 0.01 }
    },
    scenes: [
      {
        id: "scene_1",
        start: 0,
        end: 5,
        elements: [
          { id: "video", type: "video", position: { x: 0, y: 0 }, size: { width: 1, height: 1 } },
          { id: "subtitle", type: "text", content: "{{subtitle}}", position: { x: 0.5, y: 0.9 }, anchor: "center", maxWidth: 0.8, styleRef: "subtitle" }
        ]
      }
    ]
  }
];

// --- COMPONENT ---
export default function TemplateSelector() {
  const [selectedTemplate, setSelectedTemplate] = useState(TEMPLATE_DATA[0]);

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-8 bg-background">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight">Choose Template</h2>
        <p className="text-muted-foreground text-sm">Select a visual style for your video project.</p>
      </div>

      {/* Horizontal Scroller */}
      <div className="flex w-full gap-5 overflow-x-auto pb-6 scrollbar-thin scrollbar-thumb-muted-foreground/20 hover:scrollbar-thumb-muted-foreground/40 snap-x snap-mandatory">
        {TEMPLATE_DATA.map((template) => {
          const isSelected = selectedTemplate.meta.templateId === template.meta.templateId;
          
          return (
            <div key={template.meta.templateId} className="snap-start shrink-0">
              <Card 
                className={cn(
                  "relative w-56 cursor-pointer overflow-hidden transition-all duration-300",
                  "hover:shadow-lg hover:-translate-y-1",
                  isSelected ? "ring-2 ring-primary border-primary shadow-md" : "border-border shadow-sm"
                )}
                onClick={() => setSelectedTemplate(template)}
              >
                <CardContent className="p-0">
                  {/* Mock Visual Preview */}
                  <div className="aspect-[9/16] relative bg-slate-950 flex flex-col items-center justify-center overflow-hidden">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
                    
                    <Video className="w-10 h-10 text-slate-700 relative z-10" />

                    {/* Template-specific logic rendering */}
                    {template.meta.templateId.includes('news') ? (
                      <div className="absolute bottom-0 w-full p-4 space-y-2 bg-gradient-to-t from-black/80 to-transparent">
                        <div className="h-3 w-3/4 bg-blue-500/50 rounded" />
                        <div className="h-2 w-full bg-white/30 rounded" />
                      </div>
                    ) : (
                      <div className="absolute bottom-8 w-full flex justify-center">
                        <div className="px-3 py-1 bg-black/60 rounded text-[8px] text-white/70 border border-white/10 uppercase tracking-widest">
                          Captions Here
                        </div>
                      </div>
                    )}

                    {/* Selection Indicator */}
                    {isSelected && (
                      <div className="absolute top-3 right-3 z-20">
                        <CheckCircle2 className="w-6 h-6 text-primary fill-white" />
                      </div>
                    )}
                  </div>

                  {/* Template Info */}
                  <div className="p-4 bg-card">
                    <h4 className="font-semibold text-sm truncate">{template.meta.name}</h4>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="text-[10px] uppercase font-bold">
                        {template.meta.aspectRatio}
                      </Badge>
                      <Badge variant="secondary" className="text-[10px] font-medium">
                        {template.meta.templateId.split('_')[0]}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          );
        })}
      </div>

      {/* Detail Preview Section */}
      {selectedTemplate && (
        <div className="rounded-xl border bg-muted/30 p-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="flex items-center gap-3 mb-4">
            <Layout className="w-5 h-5 text-primary" />
            <h3 className="font-bold">Template Config: {selectedTemplate.meta.templateId}</h3>
          </div>
          <pre className="text-[12px] leading-relaxed font-mono bg-slate-950 text-slate-300 p-4 rounded-lg overflow-auto max-h-60 border border-white/10">
            {JSON.stringify(selectedTemplate, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}