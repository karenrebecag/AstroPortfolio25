import { MotionValue, motion, useSpring, useTransform } from "framer-motion";
import { useEffect, useState, type CSSProperties } from "react";

interface NumberProps {
  mv: MotionValue<number>;
  number: number;
  height: number;
}

function Number({ mv, number, height }: NumberProps) {
  let y = useTransform(mv, (latest) => {
    let placeValue = latest % 10;
    let offset = (10 + number - placeValue) % 10;
    let memo = offset * height;
    if (offset > 5) {
      memo -= 10 * height;
    }
    return memo;
  });

  const style: CSSProperties = {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  return <motion.span style={{ ...style, y }}>{number}</motion.span>;
}

interface DigitProps {
  place: number;
  value: number;
  height: number;
  digitStyle?: CSSProperties;
}

function Digit({ place, value, height, digitStyle }: DigitProps) {
  let valueRoundedToPlace = Math.floor(value / place);
  let animatedValue = useSpring(valueRoundedToPlace);

  useEffect(() => {
    animatedValue.set(valueRoundedToPlace);
  }, [animatedValue, valueRoundedToPlace]);

  const defaultStyle: CSSProperties = {
    height,
    position: "relative",
    width: "1ch",
    fontVariantNumeric: "tabular-nums",
  };

  return (
    <div style={{ ...defaultStyle, ...digitStyle }}>
      {Array.from({ length: 10 }, (_, i) => (
        <Number key={i} mv={animatedValue} number={i} height={height} />
      ))}
    </div>
  );
}

interface CounterDisplayProps {
  value: number;
  fontSize?: number;
  padding?: number;
  places?: number[];
  gap?: number;
  borderRadius?: number;
  horizontalPadding?: number;
  textColor?: string;
  fontWeight?: CSSProperties["fontWeight"];
  containerStyle?: CSSProperties;
  counterStyle?: CSSProperties;
  digitStyle?: CSSProperties;
  gradientHeight?: number;
  gradientFrom?: string;
  gradientTo?: string;
  topGradientStyle?: CSSProperties;
  bottomGradientStyle?: CSSProperties;
}

const CounterDisplay = ({
  value,
  fontSize = 100,
  padding = 0,
  places = [100, 10, 1],
  gap = 8,
  borderRadius = 4,
  horizontalPadding = 8,
  textColor = "white",
  fontWeight = "bold",
  containerStyle,
  counterStyle,
  digitStyle,
  gradientHeight = 16,
  gradientFrom = "black",
  gradientTo = "transparent",
  topGradientStyle,
  bottomGradientStyle,
}: CounterDisplayProps) => {
  const height = fontSize + padding;

  const defaultContainerStyle: CSSProperties = {
    position: "relative",
    display: "inline-block",
  };

  const defaultCounterStyle: CSSProperties = {
    fontSize,
    display: "flex",
    gap: gap,
    overflow: "hidden",
    borderRadius: borderRadius,
    paddingLeft: horizontalPadding,
    paddingRight: horizontalPadding,
    lineHeight: 1,
    color: textColor,
    fontWeight: fontWeight,
    backgroundColor: "transparent",
  };

  return (
    <div style={{ ...defaultContainerStyle, ...containerStyle }}>
      <div style={{ ...defaultCounterStyle, ...counterStyle }}>
        {places.map((place) => (
          <Digit
            key={place}
            place={place}
            value={value}
            height={height}
            digitStyle={digitStyle}
          />
        ))}
      </div>
    </div>
  );
};

interface AnimatedCounterProps {
  targetValue: number;
  suffix?: string;
  className?: string;
}

export const AnimatedCounter = ({ targetValue, suffix = "", className = "" }: AnimatedCounterProps) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCount(targetValue);
    }, 500); // Start animation after 500ms

    return () => clearTimeout(timer);
  }, [targetValue]);

  // For values with "k" suffix, show the base number (e.g., 1.2k shows as 1.2)
  const displayValue = suffix === "k" ? targetValue / 1000 : targetValue;
  const actualCount = suffix === "k" ? count / 1000 : count;

  // Determine places based on display value
  const getPlaces = (value: number) => {
    if (suffix === "k") {
      // For k values, show one decimal place
      return [1, 0.1];
    }
    if (value >= 1000) return [1000, 100, 10, 1];
    if (value >= 100) return [100, 10, 1];
    if (value >= 10) return [10, 1];
    return [1];
  };

  return (
    <div className={`flex items-center ${className}`}>
      <CounterDisplay
        value={actualCount}
        fontSize={48}
        textColor="#080808"
        fontWeight="normal"
        places={getPlaces(displayValue)}
        gap={2}
        borderRadius={0}
        horizontalPadding={0}
        containerStyle={{ fontFamily: 'var(--font-display)' }}
      />
      {suffix && <span className="text-display text-[#080808] ml-1">{suffix}</span>}
    </div>
  );
};
