import type { RootState } from "@/store/store";
import Card from "../../ui/card/Card";
import Draggable from "../draggable/Draggable";
import type { TextAsset } from "@/store/assets";
import { useSelector } from "react-redux";



export default function TextPanel() {
  const assets = useSelector((state: RootState) => state.assets.assets)
  const textAssets = assets.filter(
    (asset): asset is TextAsset =>
      asset.type === "text"
  );
  return (
    <Card className="p-4 h-full overflow-y-auto">

      <h4 className="text-lg font-semibold mb-4">
        Text
      </h4>

      <ul className="space-y-3">

        {textAssets.map((item) => (
          <Draggable id={item.id} key={item.id}>
            <li className="bg-neutral-800 text-white rounded-lg p-3 cursor-grab hover:bg-neutral-700 transition">
              
              <p
                style={{ fontSize: item.style.fontSize }}
                className="font-semibold"
              >
                {item.content}
              </p>

            </li>
          </Draggable>
        ))}

      </ul>
    </Card>
  );
}