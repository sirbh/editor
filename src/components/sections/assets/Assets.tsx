import Card from "../../ui/card/Card";
import Button from "../../ui/button/Button";
import styles from "./Assets.module.css";
import { useRef, useState, type ChangeEvent } from "react";

export default function Assets() {
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      console.log("Selected files:", e.target.files);
      const newFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...newFiles]);
      e.target.value = "";
    }
  };

   const handleDragStart = (e: React.DragEvent<HTMLImageElement>, src: string) => {
    e.dataTransfer.setData("imageSrc", src);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card className={styles.container}>
      <div className={styles["container-head"]}>
        <h4 className={styles.header}>Your assets</h4>

        <input
          ref={fileInputRef}
          type="file"
          id="upload-input"
          accept="image/*,video/*"
          multiple
          style={{ display: "none" }}
          onChange={handleChange}
        />

        <Button name="Upload Assets" className={styles.btn} onClick={handleClick} />
      </div>

      <div style={{ overflow: "hidden" }}>
        <ul style={{ marginTop: "15px" }}>
          {files.map((file, index) => {
            const fileURL = URL.createObjectURL(file);

            return (
              <li key={`${file.name}-${index}`} style={{ marginBottom: "15px" }}>
                {file.type.startsWith("image/") ? (
                  <img
                    src={fileURL}
                    alt={file.name}
                    style={{ width: "150px", borderRadius: "8px" }}
                    draggable={true}
                    onDragStart={(e) => handleDragStart(e, fileURL)}
                  />
                ) : file.type.startsWith("video/") ? (
                  <video
                    src={fileURL}
                    width={150}
                    height={100}
                    style={{ borderRadius: "8px", objectFit: "cover" }}
                    muted
                    controls={false}
                  />
                ) : (
                  <span>{file.name}</span>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </Card>
  );
}
