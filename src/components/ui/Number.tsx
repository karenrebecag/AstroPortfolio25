import NumberFlow from '@number-flow/react';
import { useCallback, useEffect, useRef, useState } from 'react';

interface NumberProps {
  value: number;
  className?: string;
  style?: React.CSSProperties;
  delay?: number;
}

export const Number = ({
  value,
  className = "",
  style,
  delay = 500
}: NumberProps) => {
  const [displayValue, setDisplayValue] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const triggerAnimation = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      setHasStarted(true);
      setDisplayValue(value);
    }, delay);
  }, [value, delay]);

  useEffect(() => {
    const target = containerRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            observer.disconnect();
            setHasStarted(false);
            setDisplayValue(0);
            triggerAnimation();
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [triggerAnimation]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return (
    <div ref={containerRef}>
      <NumberFlow
        value={displayValue}
        className={className}
        style={style}
        animated={hasStarted}
        format={{ useGrouping: false }}
        transformTiming={{ duration: 1000, easing: 'ease-out' }}
        spinTiming={{ duration: 1000, easing: 'ease-out' }}
      />
    </div>
  );
};
