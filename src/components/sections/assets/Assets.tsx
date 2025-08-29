import Card from "../../ui/card/Card";
import Button from "../../ui/button/Button";
import styles from "./Assets.module.css";
import { useRef, useState, type ChangeEvent } from "react";

export default function Assets() {
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...newFiles]);
      e.target.value = "";
    }
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

      <div style={{overflow: "hidden"}}>
        <ul style={{ marginTop: "15px" }}>
          {files.map((file, index) => (
            <li key={`${file.name}-${index}`}>{file.name}</li>
          ))}
        </ul>
      </div>
    </Card>
  );
}
