import React, { useState } from "react";

export default function App() {
  const [selected, setSelected] = useState(null);

  return (
    <div style={{ padding: 20 }}>
      <h2>🎬 Template Gallery</h2>

      <div style={styles.grid}>
        {templates.map((tpl) => (
          <div key={tpl.meta.templateId} style={styles.card}>
            <TemplatePreview template={tpl} />

            <div style={styles.footer}>
              <h4>{tpl.meta.name}</h4>
              <button onClick={() => setSelected(tpl)}>
                Use Template
              </button>
            </div>
          </div>
        ))}
      </div>

      {selected && (
        <div style={{ marginTop: 30 }}>
          <h3>✅ Selected Template:</h3>
          <pre>{JSON.stringify(selected.meta, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

///////////////////////////////////////////////////////////
// 🔥 TEMPLATE PREVIEW
///////////////////////////////////////////////////////////

function TemplatePreview({ template }) {
  const width = 270;
  const height = 480;

  return (
    <div
      style={{
        ...styles.previewContainer,
        width,
        height
      }}
    >
      {template.scenes[0].elements.map((el) => (
        <RenderElement
          key={el.id}
          element={el}
          template={template}
          containerWidth={width}
          containerHeight={height}
        />
      ))}
    </div>
  );
}

///////////////////////////////////////////////////////////
// 🧠 ELEMENT RENDERER (WITH SCALING)
///////////////////////////////////////////////////////////

function RenderElement({
  element,
  template,
  containerWidth,
  containerHeight
}) {
  const stylesMap = template.styles || {};
  const style = element.styleRef
    ? stylesMap[element.styleRef]
    : element.style || {};

  const left = element.position.x * containerWidth;
  const top = element.position.y * containerHeight;

  const baseStyle = {
    position: "absolute",
    left,
    top,
    transform:
      element.anchor === "center"
        ? "translate(-50%, -50%)"
        : "none"
  };

  // 🎬 VIDEO PLACEHOLDER
  if (element.type === "video") {
    return (
      <div
        style={{
          ...baseStyle,
          width: element.size.width * containerWidth,
          height: element.size.height * containerHeight,
          background: "#222",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#aaa",
          fontSize: 14
        }}
      >
        Video Here
      </div>
    );
  }

  // 🟩 SHAPE
  if (element.type === "shape") {
    return (
      <div
        style={{
          ...baseStyle,
          width: element.size.width * containerWidth,
          height: element.size.height * containerHeight,
          background: style.background
        }}
      />
    );
  }

  // 🔤 TEXT
  if (element.type === "text") {
    return (
      <div
        style={{
          ...baseStyle,
          width: element.maxWidth
            ? element.maxWidth * containerWidth
            : "auto",
          color: style.color,
          background: style.background,
          fontWeight: style.fontWeight,
          fontSize: style.fontSize * containerHeight,
          padding: (style.padding || 0) * containerHeight,
          textAlign: "center",
          borderRadius: 6
        }}
      >
        {mockReplace(element.content)}
      </div>
    );
  }

  return null;
}

///////////////////////////////////////////////////////////
// 🔁 MOCK PLACEHOLDER DATA
///////////////////////////////////////////////////////////

function mockReplace(content) {
  return content
    .replace("{{headline}}", "Breaking News Headline")
    .replace("{{subtitle}}", "Subtitle goes here");
}

///////////////////////////////////////////////////////////
// 🎨 STYLES
///////////////////////////////////////////////////////////

const styles = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    gap: "20px"
  },
  card: {
    border: "1px solid #ddd",
    borderRadius: "10px",
    overflow: "hidden",
    background: "#fff",
    transition: "0.2s",
    cursor: "pointer"
  },
  previewContainer: {
    position: "relative",
    background: "#000",
    overflow: "hidden"
  },
  footer: {
    padding: "10px"
  }
};

///////////////////////////////////////////////////////////
// 📦 TEMPLATE JSON (INLINE)
///////////////////////////////////////////////////////////

const templates = [
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
      headline: {
        fontSize: 0.05,
        fontWeight: "bold",
        color: "#fff",
        background: "#000000cc",
        padding: 0.015
      }
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
            size: { width: 1, height: 1 }
          },
          {
            id: "overlay",
            type: "shape",
            position: { x: 0, y: 0.7 },
            size: { width: 1, height: 0.3 },
            style: { background: "#000000aa" }
          },
          {
            id: "headline",
            type: "text",
            content: "{{headline}}",
            position: { x: 0.5, y: 0.82 },
            anchor: "center",
            maxWidth: 0.9,
            styleRef: "headline"
          }
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
      subtitle: {
        fontSize: 0.035,
        color: "#fff",
        background: "#000000aa",
        padding: 0.01
      }
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
            size: { width: 1, height: 1 }
          },
          {
            id: "subtitle",
            type: "text",
            content: "{{subtitle}}",
            position: { x: 0.5, y: 0.9 },
            anchor: "center",
            maxWidth: 0.8,
            styleRef: "subtitle"
          }
        ]
      }
    ]
  }
];