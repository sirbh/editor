import { classNames } from "../../utils";
import styles from "./Button.module.css"

interface ButtonProps {
   name:string;
   className?:string;
}

export default function Button({name,className}:ButtonProps) {
    return <button className={classNames(styles.button,className)}>
          {name}
    </button>
}