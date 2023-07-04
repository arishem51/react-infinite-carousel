import styles from "./App.module.css";
import Carousel from "./Carousel";

function App() {
  return (
    <div className={`${styles.container} center`}>
      <Carousel />
    </div>
  );
}

export default App;
