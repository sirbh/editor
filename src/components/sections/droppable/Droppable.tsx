import Seekbar from "@/components/custom/Seekbar";
import type { SelectedAsset } from "@/store/assets";
import type { RootState } from "@/store/store";
import { useDroppable } from "@dnd-kit/core";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Rnd } from "react-rnd";
export default function Droppable() {
  const {  setNodeRef } = useDroppable({
    id: "droppable",
  });

  const [time, setTime] = useState(0);
  const [playing, setPlaying] = useState(false);
  const duration_sec=120;

  useEffect(() => {
      let interval: NodeJS.Timeout;
      if (playing) {
        interval = setInterval(() => {
          setTime((t) => (t < duration_sec * 1000 ? t + 16.6 : t));
        }, 16.6); // advance 1 sec per second
      }
      return () => clearInterval(interval);
    }, [playing]);



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
          // const isVisible = time >= file.start && time <= file.end;



          return (


            // <Rnd
            //   bounds='parent'
            //   cancel="true"
            //   key={file.select_id}
            //   default={{
            //     x: 0,
            //     y: 0,
            //     width: 320,
            //     height: 200,
            //   }}

            //   style={{
            //     opacity: isVisible ? 1 : 0,

            //   }}
            // >


            //   {file.type.startsWith("image/") ? (

             
                
            //     <img
            //       src={file.url}
            //       alt={file.name}
            //       style={{ width: "100%", borderRadius: "8px", height: '100%', pointerEvents: 'none' }}
            //       onDrag={(e) => {
            //         e.preventDefault()
            //       }}
            //     />
            //   ) : file.type.startsWith("video/") ? (
            //     <video
            //       src={file.url}
            //       width={"100%"}
            //       height={"100%"}
            //       style={{ borderRadius: "8px", objectFit: "cover" }}
            //       controls={false}
            //     />
            //   ) : (
            //     <span>{file.name}</span>
            //   )}


            // </Rnd>

            <AssetRenderer file={file} time={time} playing={playing}/>


          );
        })}
      </div>
      <div>
      </div>
      <>
        <p>{time}</p>
        <button onClick={() => { setPlaying(prev => !prev) }}>{playing ? "Stop" : "Play"}</button>
      </>
      <Seekbar time={time} setTime={(v)=>{setTime(v)}}/>
    </div>
  );
}

export function AssetRenderer({
  file,
  time,
  playing,
}: {
  file: SelectedAsset;
  time: number;
  playing: boolean;
}) {
  const isVisible = time >= file.start && time <= file.end;
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const lastSeek = useRef<number | null>(null);

  // 🔁 When playback toggles (play/pause)
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !file.type.startsWith("video/")) return;

    if (playing && isVisible) {
      // If video not synced within small tolerance, adjust once
      const expectedTime = (time - file.start) / 1000;
      if (!lastSeek.current || Math.abs(video.currentTime - expectedTime) > 0.1) {
        video.currentTime = expectedTime;
        lastSeek.current = expectedTime;
      }
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [playing, isVisible]);

  // 🧭 When user drags the global Seekbar
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !file.type.startsWith("video/")) return;
    const expectedTime = (time - file.start) / 1000;
    // Only seek when user scrubs (time jumps > ~100 ms)
    if (!lastSeek.current || Math.abs(expectedTime - lastSeek.current) > 0.1) {
      video.currentTime = Math.max(0, expectedTime);
      lastSeek.current = expectedTime;
    }
  }, [time, file.start]);

  return (
    <Rnd
      bounds="parent"
      default={{
        x: 0,
        y: 0,
        width: 320,
        height: 200,
      }}
      style={{
        position: "absolute",
        opacity: isVisible ? 1 : 0,
        pointerEvents: isVisible ? "auto" : "none",
        transition: "opacity 0.3s ease",
      }}
    >
      {file.type.startsWith("image/") ? (
        <img
          src={file.url}
          alt={file.name}
          style={{
            width: "100%",
            height: "100%",
            borderRadius: "8px",
            objectFit: "cover",
          }}
        />
      ) : file.type.startsWith("video/") ? (
        <video
          ref={videoRef}
          src={file.url}
          width="100%"
          height="100%"
          muted
          preload="auto"
          playsInline
          style={{ borderRadius: "8px", objectFit: "cover" }}
        />
      ) : (
        <span>{file.name}</span>
      )}
    </Rnd>
  );
}

// function AssetRenderer({
//   file,
//   time,
//   playing,
// }: {
//   file: SelectedAsset;
//   time: number;
//   playing: boolean;
// }) {
//   const isVisible = time >= file.start && time <= file.end;
//   const videoRef = useRef<HTMLVideoElement | null>(null);

//   // Sync video time
//   useEffect(() => {
//     if (file.type.startsWith("video/") && videoRef.current) {
//       videoRef.current.currentTime = Math.max(0, (time - file.start) / 1000);
//     }
//   }, [time, file]);

//   // Handle play/pause
//   useEffect(() => {
//     if (file.type.startsWith("video/") && videoRef.current) {
//       if (playing && isVisible) {
//         videoRef.current.play().catch(() => {});
//       } else {
//         videoRef.current.pause();
//       }
//     }
//   }, [playing, isVisible, file]);

//   return (
//     <Rnd
//       bounds="parent"
//       default={{
//         x: 0,
//         y: 0,
//         width: 320,
//         height: 200,
//       }}
//       style={{
//         position: "absolute",
//         opacity: isVisible ? 1 : 0,
//         pointerEvents: isVisible ? "auto" : "none",
//         transition: "opacity 0.3s ease",
//       }}
//     >
//       {file.type.startsWith("image/") ? (
//         <img
//           src={file.url}
//           alt={file.name}
//           style={{
//             width: "100%",
//             height: "100%",
//             borderRadius: "8px",
//             pointerEvents: "none",
//             objectFit: "cover",
//           }}
//         />
//       ) : file.type.startsWith("video/") ? (
//         <video
//           ref={videoRef}
//           src={file.url}
//           width="100%"
//           height="100%"
//           style={{ borderRadius: "8px", objectFit: "cover" }}
//           controls={false}
//           muted
//         />
//       ) : (
//         <span>{file.name}</span>
//       )}
//     </Rnd>
//   );
// }
