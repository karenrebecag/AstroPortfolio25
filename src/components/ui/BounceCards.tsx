import { motion } from "motion/react"
import { cn } from "../../lib/utils"

interface Position {
  x: number
  y: number
  rotate: number
}

interface BounceCardsProps {
  /**
   * Additional CSS classes for the container
   */
  className?: string
  /**
   * Array of image URLs to display
   */
  images?: string[]
  /**
   * Width of the container in pixels
   */
  containerWidth?: number
  /**
   * Height of the container in pixels
   */
  containerHeight?: number
  /**
   * Delay before animation starts (in seconds)
   */
  animationDelay?: number
  /**
   * Delay between each card animation (in seconds)
   */
  animationStagger?: number
  /**
   * Array of positions for each card (optional, uses auto-layout if not provided)
   */
  positions?: Position[]
  /**
   * Use automatic grid layout instead of manual positions
   */
  useAutoLayout?: boolean
}

/**
 * A component that displays a group of cards with a bouncing animation effect.
 * Uses Motion Dev for smooth animations and supports custom positioning and timing.
 */
export function BounceCards({
  className = "",
  images = [],
  containerWidth = 400,
  containerHeight = 400,
  animationDelay = 0.5,
  animationStagger = 0.06,
  useAutoLayout = true,
  positions = [
    { x: -35, y: 0, rotate: 10 },
    { x: -12, y: 0, rotate: 5 },
    { x: 0, y: 0, rotate: -3 },
    { x: 12, y: 0, rotate: -10 },
    { x: 35, y: 0, rotate: 2 }
  ]
}: BounceCardsProps) {
  return (
    <div
      className={cn("relative w-full h-full", className)}
      style={{
        minHeight: '140px',
        aspectRatio: '2.5/1'
      }}
    >
      {images.map((src, idx) => {
        const position = positions[idx] || { x: 0, y: 0, rotate: 0 };

        return (
          <motion.div
            key={idx}
            className={cn(
              "absolute aspect-square rounded-[20px] overflow-hidden",
              "border-4 border-white dark:border-white/90",
              "shadow-xl dark:shadow-black/30"
            )}
            style={{
              left: '50%',
              top: '50%',
              width: '25%',  // Relative to container
              marginLeft: '-12.5%', // half of width to center
              marginTop: '-12.5%'   // half of height to center
            }}
            initial={{
              scale: 0,
              x: position.x,
              y: position.y,
              rotate: position.rotate
            }}
            animate={{
              scale: 1,
              x: position.x,
              y: position.y,
              rotate: position.rotate
            }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 25,
              delay: animationDelay + (idx * animationStagger),
            }}
            whileHover={{
              scale: 1.1,
              transition: { duration: 0.2 }
            }}
          >
            <img
              className="w-full h-full object-contain"
              src={src}
              alt={`card-${idx}`}
              loading="lazy"
            />
          </motion.div>
        );
      })}
    </div>
  )
}