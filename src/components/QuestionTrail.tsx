import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";

interface QuestionParticle {
  id: number;
  x: number;
  y: number;
  initialX: number;
  initialY: number;
}

interface QuestionTrailProps {
  mouseX: number;
  mouseY: number;
  isActive: boolean;
}

export default function QuestionTrail({
  mouseX,
  mouseY,
  isActive,
}: QuestionTrailProps) {
  const controls = useAnimation();
  const particles: QuestionParticle[] = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    x: mouseX,
    y: mouseY,
    initialX: mouseX,
    initialY: mouseY,
  }));

  useEffect(() => {
    if (isActive) {
      particles.forEach((particle, index) => {
        const baseDelay = index * 0.2;
        const randomOffset = Math.random() * 50 - 25;

        const animate = async () => {
          await controls.start((i) => {
            if (i === particle.id) {
              // Create a meandering path with multiple points
              const path = Array.from({ length: 4 }, (_, step) => ({
                x:
                  particle.initialX +
                  (Math.random() - 0.5) * (150 + step * 50) +
                  randomOffset,
                y: particle.initialY - (step + 1) * 50 - Math.random() * 30,
                opacity: step === 3 ? 0 : 1,
                scale: 1 + Math.random() * 0.5,
                rotate: (Math.random() - 0.5) * 180,
              }));

              return {
                x: path.map((p) => p.x),
                y: path.map((p) => p.y),
                opacity: [0, 1, 1, 1, 0],
                scale: path.map((p) => p.scale),
                rotate: path.map((p) => p.rotate),
                transition: {
                  duration: 3,
                  delay: baseDelay,
                  ease: "easeInOut",
                  times: [0, 0.2, 0.4, 0.8, 1],
                  repeat: Infinity,
                  repeatDelay: Math.random() * 0.5,
                },
              };
            }
            return {};
          });
        };

        animate();
      });
    } else {
      controls.stop();
    }

    return () => {
      controls.stop();
    };
  }, [isActive, mouseX, mouseY]);

  if (!isActive) return null;

  return (
    <div className="fixed pointer-events-none" style={{ left: 0, top: 0 }}>
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          custom={particle.id}
          animate={controls}
          initial={{ x: particle.x, y: particle.y, opacity: 0, scale: 0 }}
          className="absolute text-[#8DB187] font-pantasia text-xl"
          style={{ x: particle.x, y: particle.y }}
        >
          ?
        </motion.div>
      ))}
    </div>
  );
}
