import styles from './App.module.css'
import Assets from './components/sections/assets/Assets'
import Card from './components/ui/card/Card'
import Seekbar from './components/custom/Seekbar';




export default function App() {

  return <div className={styles.layout}>
    <div className={styles.container}>
      <div className={styles['top-bar']}>
        <Card>
          <div></div>
        </Card>
      </div>
      <div className={styles['side-bar']}>
        <Card>
          <div></div>
        </Card>
      </div>
      <div className={styles['media-menu']}>
        <Assets />
      </div>
      <div className={styles['editor']}>
        <Card>
          <div>
             <Seekbar/>
          </div>
        </Card>
      </div>
      <div className={styles['end-bar']}>
        <Card>
          <div></div>
        </Card>
      </div>
    </div>
  </div>
}