import NumberFlow from '@number-flow/react';
import { useEffect, useState } from 'react';

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

  useEffect(() => {
    // Start animation after delay
    const timer = setTimeout(() => {
      setHasStarted(true);
      setDisplayValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return (
    <NumberFlow
      value={displayValue}
      className={className}
      style={style}
      animated={hasStarted}
      format={{ useGrouping: false }}
      transformTiming={{ duration: 1000, easing: 'ease-out' }}
      spinTiming={{ duration: 1000, easing: 'ease-out' }}
    />
  );
};