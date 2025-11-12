import Card from "../../ui/card/Card";
import Button from "../../ui/button/Button";
import styles from "./Assets.module.css";
import { useRef, type ChangeEvent } from "react";
import { useDispatch, useSelector } from 'react-redux'
import { addAsset } from '../../../store/assets/index'
import type { RootState, } from "@/store/store";
import Draggable from "../draggable/Draggable";
export default function Assets() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const dispatch = useDispatch()
  const assets = useSelector((state: RootState) => state.assets.assets)

  console.log(assets)

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map(file => ({
        name: file.name,
        size: file.size,
        type: file.type,
        url: URL.createObjectURL(file), // temporary preview
      }));

      dispatch(addAsset(newFiles));
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

      <div style={{ overflow: "hidden" }}>
        <ul style={{ marginTop: "15px" }}>
          {assets.map((file) => {
            // const fileURL = URL.createObjectURL(file);

            return (
              <Draggable id={file.id} key={file.id}>
                <li  style={{ marginBottom: "15px" }}>
                  {file.type.startsWith("image/") ? (
                    <img
                      src={file.url}
                      alt={file.name}
                      style={{ width: "150px", borderRadius: "8px" }}
                    />
                  ) : file.type.startsWith("video/") ? (
                    <video
                      src={file.url}
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
              </Draggable>
            );
          })}
        </ul>
      </div>
    </Card>
  );
}
