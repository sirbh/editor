import React, { useRef, useEffect, useCallback } from 'react';

interface CanvasVideoPlayerProps {
  src: string;
}

const CanvasVideoPlayer: React.FC<CanvasVideoPlayerProps> = ({ src }) => {
  // Explicitly typing the refs
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const requestRef = useRef<number | undefined>(undefined);

  const renderFrame = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (video && canvas) {
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        // 1. Clear the canvas (important for transparent overlays)
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 2. Draw the Video Frame
        // This takes the current frame of the hidden video and paints it
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // 3. Example Overlay Logic
        // In a real editor, you'd loop through your JSON layers here
        ctx.font = "40px Arial";
        ctx.fillStyle = "white";
        ctx.fillText("Preview Mode", 50, 80);
      }
    }

    // Continue the loop for the next animation frame
    requestRef.current = requestAnimationFrame(renderFrame);
  }, []);

  useEffect(() => {
    // Start the render loop
    requestRef.current = requestAnimationFrame(renderFrame);

    videoRef.current?.play()
    
    // Cleanup: Stop the loop when component unmounts to prevent memory leaks
    return () => {
      if (requestRef.current !== undefined) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [renderFrame]);

  const handlePlay = () => {
    videoRef.current?.play().catch(err => console.error("Playback failed", err));
  };

  const handlePause = () => {
    videoRef.current?.pause();
  };

  return (
    <div className="video-container" style={{ position: 'relative', width: '100%' }}>
      {/* Hidden Video Source: The 'Engine' */}
      <video
        ref={videoRef}
        src={src}
        style={{ display: 'none' }}
        muted
        loop
        playsInline
        crossOrigin="anonymous" // Essential if video is on a different domain (S3/Cloudinary)
      />

      {/* Visible Render Target: The 'Display' */}
      <canvas
        ref={canvasRef}
        width={1280}
        height={720}
        style={{ 
          width: '100%', 
          height: 'auto', 
          background: '#000',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
        }}
      />

      <div style={{ marginTop: '10px', display: 'flex', gap: '8px' }}>
        <button onClick={handlePlay}>Play</button>
        <button onClick={handlePause}>Pause</button>
      </div>
    </div>
  );
};

export default CanvasVideoPlayer;