import Card from "../../ui/card/Card";
import Button from "../../ui/button/Button";
import styles from "./Assets.module.css"

export default function Assets() {

    return (
        <Card className={styles.container}>
            <div className={styles['container-head']}>
                <h4 className={styles.header}>
                    Your assets
                </h4>
                <Button name="Upload Assets" className={styles.btn} />
            </div>
        </Card>
    );
}

