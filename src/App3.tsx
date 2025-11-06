import { useState, useEffect } from "react";

export default function AutoPlayer() {

  const [time, setTime] = useState(0);
  const duration:number = 120; //in seconds
  const frameInterval:number = 16.6
  const [playing, setPlaying] = useState(false);

  useEffect(() => {

    let interval:NodeJS.Timeout;
    if (playing) {
      interval = setInterval(() => {
        setTime((t) => (t < (duration*1000) ? t + frameInterval : t));
      }, frameInterval); // advance 1 sec per second
    }
    return () => clearInterval(interval);
  }, [playing]);

  return (
    <div className="p-6 space-y-4">
      <input
        type="range"
        min="0"
        max={duration*1000}
        value={time}
        onChange={(e) => setTime(parseFloat(e.target.value))}
      />

      <div className="flex gap-2">
        <button
          onClick={() => setPlaying(!playing)}
        >
          {playing ? "Pause" : "Play"}
        </button>
        <span>{time}s / {duration}s</span>
      </div>

    </div>
  );
}
