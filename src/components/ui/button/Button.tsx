import { classNames } from "../../utils";
import styles from "./Button.module.css"

interface ButtonProps {
   name:string;
   className?:string;
   onClick?: () => void;    
}

export default function Button({name,className,onClick}:ButtonProps) {
    return <button className={classNames(styles.button,className)} onClick={onClick}>
          {name}
    </button>
}