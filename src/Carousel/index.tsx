import styles from "./style.module.css";
import { useId } from "react";

const items = [
  {
    name: 1,
  },
  {
    name: 2,
  },
  {
    name: 3,
  },
  {
    name: 4,
  },
  {
    name: 5,
  },
];

const Carousel = () => {
  const id = useId();
  const renderItem = () => {
    return items.map((item) => {
      const styleInline = {
        "--bg-color": `var(--bl-color${item.name})`,
      } as React.CSSProperties;
      const className = `${styles.item} center`;
      const key = id + item.name;

      return (
        <div className={className} key={key} style={styleInline}>
          {item.name}
        </div>
      );
    });
  };

  return <div className={styles.container}>{renderItem()}</div>;
};

export default Carousel;
