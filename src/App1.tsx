import React, { useState } from "react";
import type { ChangeEvent } from "react";

const Slider: React.FC = () => {
  const [value, setValue] = useState<number>(50);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(Number(e.target.value));
  };

  return (
    <div style={{ height: "200px", alignItems: "center", display: "flex", flexDirection: "column", justifyContent: "start", marginTop: "50px", zIndex: 1, position:"relative" }}>
         <input
        type="range"
        id="volume"

        min={0}
        max={100}
        value={value}
        onChange={handleChange}
        className="slider"
        style={{position:"absolute", top:"0"}}
      />
   
      <div style={{ flex: 1, backgroundColor: "blue", width:"100%" }}>
        <div style={{ height: "10%", width: `40%`, backgroundColor: "red" }} onClick={()=>{console.log("Red")}}></div>
        <div style={{ height: "10%", width: `40%`, backgroundColor: "yellow" }} onClick={()=>{console.log("Yellow")}}></div>
        <div style={{ height: "10%", width: `40%`, backgroundColor: "green" }} onClick={()=>{console.log("Green")}}></div>
      </div>
    </div>
  );
};

export default Slider;
