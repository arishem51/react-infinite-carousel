import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import styles from "./style.module.css";

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

const TRANSITION_TRANSLATE = "translate .3s";
const convertToNegative = (num: number) => num * -1;
const convertToPixels = (num: number) => `${num}px`;

const Carousel = () => {
  const id = useId();
  const isFirstRender = useRef(true);
  const [currentIndex, setCurrentIndex] = useState(Math.floor(items.length));
  const scrollRefContainer = useRef<HTMLDivElement>(null);

  const translateScrollContainer = useCallback((translate: number) => {
    (scrollRefContainer.current as HTMLDivElement).style.translate =
      convertToPixels(convertToNegative(translate));
  }, []);

  useLayoutEffect(() => {
    if (isFirstRender.current) {
      // The carousel should be the middle item
      const scrollEl = scrollRefContainer.current as HTMLDivElement;
      const { clientWidth } = scrollEl;
      const distance = items.length * clientWidth;
      requestAnimationFrame(() => translateScrollContainer(distance));

      isFirstRender.current = false;
      requestIdleCallback(() => {
        scrollEl.style.transition = TRANSITION_TRANSLATE;
      });
    }
  }, [translateScrollContainer]);

  const renderItem = useCallback(() => {
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
  }, [id]);

  const handleNextBtnClick = () => {
    setCurrentIndex((prev) => prev + 1);
  };

  const handlePrevBtnClick = () => {
    setCurrentIndex((prev) => prev - 1);
  };

  useEffect(() => {
    if (!isFirstRender.current) {
      const scrollEl = scrollRefContainer.current as HTMLDivElement;
      const { clientWidth } = scrollEl;
      const distance = clientWidth * currentIndex;

      requestAnimationFrame(() => {
        translateScrollContainer(distance);
      });
    }
  }, [currentIndex, translateScrollContainer]);

  return (
    <section className={styles.container}>
      <div className={styles.scrollContainer} ref={scrollRefContainer}>
        {renderItem()}
        {renderItem()}
      </div>
      <div className={styles.buttonWrapper}>
        <button onClick={handlePrevBtnClick} className={styles.button}>
          Prev
        </button>
        <button onClick={handleNextBtnClick} className={styles.button}>
          Next
        </button>
      </div>
    </section>
  );
};

export default Carousel;
