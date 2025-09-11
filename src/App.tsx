import { useState } from 'react';
import styles from './App.module.css'
import Assets from './components/sections/assets/Assets'
import Card from './components/ui/card/Card'
import Seekbar from './components/custom/Seekbar';



type DroppedImage = {
  src: string;
  x: number;
  y: number;
};

export default function App() {
  const [images, setImages] = useState<DroppedImage[]>([]);
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); 

    console.log("Drop event:", e);

    const src = e.dataTransfer.getData("imageSrc");
    if (!src) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left; // mouse x inside div
    const y = e.clientY - rect.top;  // mouse y inside div

    setImages((prev) => [...prev, { src, x, y }]);
  };
  return <div className={styles.layout}>
    <div className={styles.container}>
      <div className={styles['top-bar']}>
        <Card>
          <div></div>
        </Card>
      </div>
      <div className={styles['side-bar']}>
        <Card>
          <div></div>
        </Card>
      </div>
      <div className={styles['media-menu']}>
        <Assets />
      </div>
      <div className={styles['editor']}>
        <Card>
          <div>
             <Seekbar/>
          </div>
        </Card>
      </div>
      <div className={styles['end-bar']}>
        <Card>
          <div></div>
        </Card>
      </div>
    </div>
  </div>
}