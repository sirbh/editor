import Seekbar from "@/components/custom/Seekbar";
import type { RootState } from "@/store/store";
import { useDroppable } from "@dnd-kit/core";
import { useSelector } from "react-redux";
import { Rnd } from "react-rnd";
import { useRef, useState } from "react";
export default function Droppable() {
  const { isOver, setNodeRef } = useDroppable({
    id: "droppable",
  });
  const [time, setTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const lastFrameTime = useRef<number>(null);
  const duration = 1000;
  console.log(console.log(time))
  const updateTime = (time: number) => {
    if (!lastFrameTime.current) {
      console.log("I ran");
      lastFrameTime.current = time
    }

    const elaspedTime = time - lastFrameTime.current;
    lastFrameTime.current = time;

    setTime(prev => {
      const time = prev + elaspedTime;
      return time < duration ? time : duration;
    })

    if (time < duration) {
      requestAnimationFrame(updateTime);
    } else {
      setIsPlaying(false);
    }
  }


  const assets = useSelector((state: RootState) => state.assets.selectedAssests)

  return (
    <div
      ref={setNodeRef}
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <div
        style={{
          backgroundColor: "lightgray",
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: 'relative'

        }}
      >


        {assets.map((file) => {

          return (


            <Rnd
              bounds='parent'
              cancel="true"

              default={{
                x: 0,
                y: 0,
                width: 320,
                height: 200,
              }}
            >


              {file.type.startsWith("image/") ? (
                <img
                  src={file.url}
                  alt={file.name}
                  style={{ width: "100%", borderRadius: "8px", height: '100%', pointerEvents: 'none' }}
                  onDrag={(e) => {
                    e.preventDefault()
                  }}
                />
              ) : file.type.startsWith("video/") ? (
                <video
                  src={file.url}
                  width={"100%"}
                  height={"100%"}
                  style={{ borderRadius: "8px", objectFit: "cover" }}
                  controls={false}
                />
              ) : (
                <span>{file.name}</span>
              )}


            </Rnd>


          );
        })}
      </div>
      <div>
        <button onClick={() => {
          setIsPlaying(prev => !prev)
          requestAnimationFrame(updateTime)
        }}>{isPlaying ? 'pause' : 'play'}</button>
        <input>
        </input>
      </div>
      <Seekbar />
    </div>
  );
}
