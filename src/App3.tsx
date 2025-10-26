import { useRef, useState } from "react";

export default function App() {
  const [time, setTime] = useState(0);
  const lastFrameTime = useRef<number | null>(null);

  const updateFrame = (newtime: number) => {
    if (!lastFrameTime.current) lastFrameTime.current = newtime;

    const elapsedTime = newtime - lastFrameTime.current;
    lastFrameTime.current = newtime;
    console.log(elapsedTime)

    setTime(prev => {
      const newTime = prev + elapsedTime;

      // Schedule next frame only if we haven't reached 1000ms
      if (newTime < 1000) {
        requestAnimationFrame(updateFrame);
      }

      return newTime < 1000 ? newTime : 1000; // cap at 1000ms
    });
  };

  return (
    <div>
      Hello World
      <div>Time: {Math.floor(time)} ms</div>
      <button
        onClick={() => {
          lastFrameTime.current = null; // reset for new animation
          setTime(0); // start from 0
          requestAnimationFrame(updateFrame);
        }}
      >
        Press
      </button>
    </div>
  );
}
