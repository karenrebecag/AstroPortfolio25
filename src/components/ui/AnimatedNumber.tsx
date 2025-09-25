import React, { useEffect, useRef, useState } from 'react';
import NumberFlow from '@number-flow/react';

interface AnimatedNumberProps {
  value: string | number;
  suffix?: string;
  prefix?: string;
  className?: string;
  duration?: number;
  format?: {
    notation?: 'standard' | 'scientific' | 'engineering' | 'compact';
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
  };
}

export function AnimatedNumber({
  value,
  suffix = '',
  prefix = '',
  className = '',
  duration = 1000,
  format = {}
}: AnimatedNumberProps) {
  const [hasAnimated, setHasAnimated] = useState(false);
  const [displayValue, setDisplayValue] = useState(0);
  const elementRef = useRef<HTMLSpanElement>(null);

  // Extract numeric value from string if needed
  const getNumericValue = (val: string | number): number => {
    if (typeof val === 'number') return val;

    // Handle percentage values like "98+"
    if (val.includes('+')) {
      return parseFloat(val.replace('+', ''));
    }

    // Handle percentage values like "99.98%"
    if (val.includes('%')) {
      return parseFloat(val.replace('%', ''));
    }

    // Handle currency values like "$0.29"
    if (val.includes('$')) {
      return parseFloat(val.replace('$', ''));
    }

    // Handle values with commas like "500+"
    const cleanValue = val.toString().replace(/[^\d.-]/g, '');
    return parseFloat(cleanValue) || 0;
  };

  const numericValue = getNumericValue(value);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);
            setDisplayValue(numericValue);
          }
        });
      },
      {
        threshold: 0.3,
        rootMargin: '0px 0px -100px 0px'
      }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated, numericValue]);

  const formatValue = (val: number): string => {
    if (format.notation === 'compact' && val >= 1000) {
      return new Intl.NumberFormat('en-US', {
        notation: 'compact',
        maximumFractionDigits: format.maximumFractionDigits || 1
      }).format(val);
    }

    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: format.minimumFractionDigits || 0,
      maximumFractionDigits: format.maximumFractionDigits || 2
    }).format(val);
  };

  return (
    <span ref={elementRef} className={className}>
      {prefix}
      <NumberFlow
        value={displayValue}
        format={formatValue}
        trend={hasAnimated ? 1 : 0}
        animated={hasAnimated}
        continuous
        transformTiming={{
          duration: duration,
          easing: 'ease-out'
        }}
      />
      {suffix}
    </span>
  );
}