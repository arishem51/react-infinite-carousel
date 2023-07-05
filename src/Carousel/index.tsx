import {
  useCallback,
  useEffect,
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
const TRANSITION_TIME = 300;
const BREATHE_TIME = 50;
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
  const originIndex = items.length;
  const [currentIndex, setCurrentIndex] = useState(originIndex);
  const [shouldTranslate, setShouldTranslate] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [hasReset, setHasReset] = useState(false);
  const scrollRefContainer = useRef<HTMLDivElement>(null);

  const translateScrollContainer = useCallback(
    (translate: number, options?: { hasTransition?: boolean }) => {
      const scrollEl = scrollRefContainer.current as HTMLDivElement;
      if (options?.hasTransition) {
        scrollEl.style.transition = TRANSITION_TRANSLATE;
      } else {
        scrollEl.style.transition = "";
      }
      scrollEl.style.translate = convertToPixels(convertToNegative(translate));
    },
    []
  );

  useLayoutEffect(() => {
    const scrollEl = scrollRefContainer.current as HTMLDivElement;
    const { clientWidth } = scrollEl;
    const distance = items.length * clientWidth;
    requestAnimationFrame(() => {
      translateScrollContainer(distance);
      requestIdleCallback(() => {
        setShouldTranslate(true);
      });
    });
  }, [translateScrollContainer]);

  useEffect(() => {
    if (shouldTranslate && !hasReset) {
      const scrollEl = scrollRefContainer.current as HTMLDivElement;
      const { clientWidth } = scrollEl;
      const distance = clientWidth * currentIndex;
      requestAnimationFrame(() => {
        setIsTranslating(true);
        translateScrollContainer(distance, { hasTransition: true });
        setTimeout(() => {
          setIsTranslating(false);
        }, TRANSITION_TIME + BREATHE_TIME);
      });
    } else {
      setHasReset(false);
      setShouldTranslate(false);
    }
  }, [currentIndex, hasReset, shouldTranslate, translateScrollContainer]);

  const calculateResetIndex = useCallback(
    (isResetByNextIndex: boolean) => {
      return isResetByNextIndex ? originIndex : originIndex * 2 - 1;
    },
    [originIndex]
  );

  useEffect(() => {
    const isResetByNextIndex = currentIndex === items.length * 2;
    const isResetByPrevIndex = currentIndex === items.length - 1;

    if (isResetByNextIndex || isResetByPrevIndex) {
      const { clientWidth } = scrollRefContainer.current as HTMLDivElement;
      const timeoutId = setTimeout(() => {
        const resetIndex = calculateResetIndex(isResetByNextIndex);
        const distance = resetIndex * clientWidth;
        requestAnimationFrame(() => {
          translateScrollContainer(distance);
        });
        setCurrentIndex(resetIndex);
        setHasReset(true);
      }, TRANSITION_TIME);

      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [
    calculateResetIndex,
    currentIndex,
    originIndex,
    translateScrollContainer,
  ]);

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

  const handleClick = useCallback((nextIndex: React.SetStateAction<number>) => {
    setCurrentIndex(nextIndex);
    setShouldTranslate(true);
  }, []);

  const handleNextBtnClick = () => {
    if (isTranslating) {
      return;
    }
    handleClick((prev) => prev + 1);
  };

  const handlePrevBtnClick = () => {
    if (isTranslating) {
      return;
    }
    handleClick((prev) => prev - 1);
  };

  return (
    <section className={styles.container}>
      <h1>{isTranslating ? "Translating" : "Idle"}</h1>
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
