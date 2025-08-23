import type { ReactNode } from "react"
import styles from './Card.module.css'
import { classNames } from "../../utils"

interface CardProps {
    children:ReactNode,
    className?:string
}
export default function Card({children, className}:CardProps) {
    return <div className={classNames(styles.card, className)}>
       {children}
    </div>
}