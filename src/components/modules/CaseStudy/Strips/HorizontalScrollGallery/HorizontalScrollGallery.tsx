import * as React from "react";
import { motion, useTransform, useScroll } from "motion/react";

interface HorizontalScrollCarouselProps {
  images: string[];
}

const HorizontalScrollCarousel: React.FC<HorizontalScrollCarouselProps> = ({ images }) => {
  const targetRef = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start end", "end start"]
  });

  const x = useTransform(scrollYProgress, [0, 1], ["5%", "-95%"]);

  return (
    <section
      ref={targetRef}
      className="relative w-full h-[300vh]"
    >
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <motion.div
          style={{ x }}
          className="flex gap-4"
        >
          {images.map((src, index) => (
            <Card
              src={src}
              key={index}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

const Card: React.FC<{ src: string }> = ({ src }) => {
  return (
    <div className="group relative h-[450px] overflow-hidden rounded-lg">
      <img
        src={src}
        style={{ 
          height: '100%', 
          width: 'auto',
          objectFit: 'contain',
          maxWidth: 'none'
        }}
        alt="carousel image"
      />
    </div>
  );
};

export { HorizontalScrollCarousel as HorizontalScrollGallery };
