// import { useState } from "react";
// import type { ChangeEvent } from "react";

import type { RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";
import { Rnd } from "react-rnd";
import { Slider } from "../ui/slider";
import { updateSelectedAssetRange } from "@/store/assets";



export default function Seekbar({time,setTime}:{
  time:number,
  setTime:(time:number)=>void
}) {
  // const [value, setValue] = useState<number>(50);
  const duration_sec = 120
  const duration_px = 750
  const slot = (duration_px * 16.6) / (120 * 1000)


  // const [time, setTime] = useState(0);
  // const [playing, setPlaying] = useState(false);
  const assets = useSelector((state: RootState) => state.assets.selectedAssests);
  console.log(assets)
  const dispatch = useDispatch();

  // useEffect(() => {
  //   let interval: NodeJS.Timeout;
  //   if (playing) {
  //     interval = setInterval(() => {
  //       setTime((t) => (t < duration_sec * 1000 ? t + 16.6 : t));
  //     }, 16.6); // advance 1 sec per second
  //   }
  //   return () => clearInterval(interval);
  // }, [playing]);


  return (

      <>

      <Slider value={[time]} onValueChange={(e) => setTime(e[0])} className="h-5 w-[750px] " step={slot} min={0} max={duration_sec*1000} />

        <div style={{ width: `${duration_px}px`, height: "240px", alignItems: "center", display: "flex", flexDirection: "column", justifyContent: "start", zIndex: 1, position: "relative", backgroundColor: "blue" }}>

          {
            assets.map(ele => {
              console.log(ele.end,ele.start)
              return <div style={{ width: '100%', height:'40px', position:'relative' }}>
                <Rnd
                  // onDrag={(e, data) => {
                  //   console.log(data.x)
                  // }}

                  onDragStop={(e, data) => {
                    const duration = ele.end-ele.start
                    const start = (data.x)*(120000/750)
                    const end = (start + duration);
                    dispatch(updateSelectedAssetRange({
                      id:ele.select_id,
                      start,
                      end
                    }))
                  }}
                  default={{
                    x: 0,
                    y: 0,
                    width: (ele.end - ele.start) * (750 / 120000),
                    height: 40,
                  }}
                  enableResizing={false}
                  bounds={"parent"}
                  dragAxis="x"
                  dragGrid={[slot, 5]}
                >
                  <div style={{ backgroundColor: "brown", height: '100%', width: '100%' }}>

                  </div>
                </Rnd>
              </div>
            })

          }
          {/* <div style={{ width: '100%' }}>
          <Rnd
            onDrag={(e, data)=>{
                console.log(data.x)
            }}
            default={{
              x: 0,
              y: 0,
              width: 320,
              height: 40,
            }}
            enableResizing={false}
            bounds={"parent"}
            dragAxis="x"
            dragGrid={[slot,5]}
          >
            <div style={{ backgroundColor:"brown", height:'100%', width:'100%'}}>

            </div>
          </Rnd>
        </div>  */}

        </div>
      </>

  );
};



// function Draggable({ children, id, cordinates }: { children: React.ReactNode, id?: string, cordinates: { x: number, y: number } }) {
//   const { attributes, listeners, setNodeRef } = useDraggable({
//     id: id || 'draggable',
//   });

  // const x = transform? transform.x : 0;
  // const y = transform?transform.y:0;

//   const { x, y } = cordinates



//   return (
//     <div ref={setNodeRef}  {...listeners} {...attributes} style={{
//       transform: `translate3d(${x}px, ${y}px, 0)`, width: "fit-content"
//     }}>
//       {children}
//     </div>
//   );
// }


// function Droppable({ children }: { children: React.ReactNode }) {
//   const { setNodeRef } = useDroppable({
//     id: 'droppable',
//   });



//   return (
//     <div ref={setNodeRef} style={{ width: "100%" }}>
//       {children}
//     </div>
//   );
// }
