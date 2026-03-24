import { memo, startTransition, useEffect, useOptimistic, useState } from "react";


const list = ["India", "Brazil", "Ireland", "Mongolia", "Croatia", "Japan", "Rwanda", "Spain", "Denmark", "Kenya"]

function myfunc(input:string) {
  return new Promise<string[]>((res,rej)=>{
      setTimeout(()=>{
         res(list.filter(v=>v.startsWith(input)))
      }, 5000)
  })
}
export default function AutoPlayer() {
  let a = 1;
 useEffect(()=>{
  console.log(a);
 },[a])



  return <>
  <p>{a}</p>
  <button onClick={()=>{
    a=a+1;
  }}>
    click
  </button>
  </>

}



function DisplayComp({value}:{value:number}) {
  return <p>
    Timer: {value}
  </p>
}

const MemoDisplatFunction  = memo(DisplayComp) 
