export default function Seekbar() {
  return (
    <div
      style={{
        position: "relative",
        backgroundColor: "royalblue",
        minHeight: "200px",
      }}
    >
      <input type="range" min="0" max="100" />
{/*       
        <div
          style={{
            height: "40px",
            width: "100%",
            backgroundColor: "lightgray",
          }}
        ></div> */}

    </div>
  );
}
