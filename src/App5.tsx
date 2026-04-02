import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';

// --- GALLERY COMPONENT ---
const VideoGallery = () => {
  const [page, setPage] = useState(0);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const VIDEOS_PER_PAGE = 10;
  const DURATION_PER_CLIP = 30;
  const STREAM_URL = "http://localhost:3001/hls/master.m3u8";

  const renderClips = () => {
    const startOffset = page * VIDEOS_PER_PAGE;
    const clips = [];

    for (let i = 0; i < VIDEOS_PER_PAGE; i++) {
      const clipIndex = startOffset + i;
      const startTime = clipIndex * DURATION_PER_CLIP;
      const endTime = startTime + DURATION_PER_CLIP;
      
      // CRITICAL: We check if this specific index is the one the user clicked
      const isPlayerActive = activeIndex === clipIndex;

      clips.push(
        <div key={clipIndex} style={styles.card}>
          <p>Clip {clipIndex + 1}</p>
          
          {isPlayerActive ? (
            /* Only when this block is rendered does Hls.js start 
               requesting the .m3u8 and .m4s files.
            */
            <HlsPlayer 
              src={STREAM_URL} 
              startTime={startTime} 
              endTime={endTime} 
              autoPlay={true} 
            />
          ) : (
            /* This is a "Dead" element. It performs NO network requests.
            */
            <div 
              style={styles.poster} 
              onClick={() => setActiveIndex(clipIndex)}
            >
              <div style={styles.playIcon}>▶ Play Fragment</div>
              <span style={styles.timeTag}>{startTime}s - {endTime}s</span>
            </div>
          )}
        </div>
      );
    }
    return clips;
  };

  return (
    <div style={styles.container}>
      <div style={styles.grid}>{renderClips()}</div>
      {/* Pagination controls here */}
    </div>
  );
};


// --- PLAYER COMPONENT ---
interface HlsPlayerProps {
  src: string;
  startTime: number;
  endTime: number;
  autoPlay?: boolean;
}

const HlsPlayer: React.FC<HlsPlayerProps> = ({ src, startTime, endTime, autoPlay = false }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (Hls.isSupported()) {
      const hls = new Hls({ startPosition: startTime });
      hlsRef.current = hls;
      hls.loadSource(src);
      hls.attachMedia(video);

      const handleTimeUpdate = () => {
        if (video.currentTime >= endTime) {
          video.pause();
          video.currentTime = startTime;
        }
      };

      video.addEventListener('timeupdate', handleTimeUpdate);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        if (autoPlay) video.play().catch(() => {});
      });

      return () => {
        video.removeEventListener('timeupdate', handleTimeUpdate);
        hls.destroy();
      };
    }
  }, [src, startTime, endTime, autoPlay]);

  return (
    <video 
      ref={videoRef} 
      controls 
      style={{ width: '100%', height: '180px', backgroundColor: '#000' }} 
    />
  );
};

// --- STYLES ---
const styles: Record<string, React.CSSProperties> = {
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px'
  },
  card: {
    border: '1px solid #ddd',
    borderRadius: '8px',
    overflow: 'hidden',
    backgroundColor: '#f9f9f9'
  },
  label: { padding: '8px', margin: 0, fontWeight: 'bold' },
  placeholder: {
    width: '100%',
    height: '180px',
    backgroundColor: '#333',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    position: 'relative',
    color: 'white'
  },
  playButton: {
    padding: '10px 20px',
    border: '2px solid white',
    borderRadius: '20px'
  },
  timestamp: {
    position: 'absolute',
    bottom: '10px',
    right: '10px',
    fontSize: '12px',
    background: 'rgba(0,0,0,0.6)',
    padding: '2px 5px'
  },
  pagination: { marginTop: '30px', textAlign: 'center' }
};

export default VideoGallery;