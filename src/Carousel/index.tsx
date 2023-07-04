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
const SOME_ID = "some-id";
const CSS_VARIABLE_BG_COLOR = "--bg-color";
const PIXEL = "px";

const convertToPixels = (num: number) => `${num}${PIXEL}`;
const convertToNegative = (num: number) => num * -1;
const createStyleInline = (index: number) => {
  return {
    [CSS_VARIABLE_BG_COLOR]: `var(--bl-color${index})`,
  } as React.CSSProperties;
};

const Carousel = () => {
  const [currentIndex, setCurrentIndex] = useState(Math.floor(items.length));
  const [shouldTranslate, setShouldTranslate] = useState(false);
  const scrollRefContainer = useRef<HTMLDivElement>(null);

  const translateScrollContainer = useCallback(
    (translate: number, options?: { hasTransition?: boolean }) => {
      const scrollEl = scrollRefContainer.current as HTMLDivElement;
      if (options?.hasTransition) {
        scrollEl.style.transition = TRANSITION_TRANSLATE;
      }
      scrollEl.style.translate = convertToPixels(convertToNegative(translate));
    },
    []
  );

  useLayoutEffect(() => {
    // The carousel should be the middle item
    const scrollEl = scrollRefContainer.current as HTMLDivElement;
    const { clientWidth } = scrollEl;
    const distance = items.length * clientWidth;
    requestAnimationFrame(() => translateScrollContainer(distance));
  }, [translateScrollContainer]);

  useEffect(() => {
    if (shouldTranslate) {
      const scrollEl = scrollRefContainer.current as HTMLDivElement;
      const { clientWidth } = scrollEl;
      const distance = clientWidth * currentIndex;

      requestAnimationFrame(() => {
        translateScrollContainer(distance, { hasTransition: true });
      });
    }
  }, [currentIndex, shouldTranslate, translateScrollContainer]);

  const renderItem = useCallback(() => {
    return items.map((item) => {
      const styleInline = createStyleInline(item.name);
      const className = `${styles.item} center`;
      const key = SOME_ID + item.name;

      return (
        <div className={className} key={key} style={styleInline}>
          {item.name}
        </div>
      );
    });
  }, []);

  const handleNextBtnClick = () => {
    setShouldTranslate(true);
    setCurrentIndex((prev) => prev + 1);
  };

  const handlePrevBtnClick = () => {
    setShouldTranslate(true);
    setCurrentIndex((prev) => prev - 1);
  };

  return (
    <section className={styles.container}>
      <div className={styles.scrollContainer} ref={scrollRefContainer}>
        {renderItem()}
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
