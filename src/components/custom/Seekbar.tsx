import { useState } from "react";
import type { ChangeEvent } from "react";

export default function Seekbar(){
  const [value, setValue] = useState<number>(50);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(Number(e.target.value));
  };

  return (
    <div style={{ height: "200px", alignItems: "center", display: "flex", flexDirection: "column", justifyContent: "start", zIndex: 1, position:"relative" }}>

   
      <div style={{ flex: 1, backgroundColor: "blue", width:"100%" }}>
      </div>
    </div>
  );
};


