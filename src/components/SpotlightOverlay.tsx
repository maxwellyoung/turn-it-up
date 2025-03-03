import { motion } from "framer-motion";

interface SpotlightOverlayProps {
  mouseX: number;
  mouseY: number;
  isActive: boolean;
}

export default function SpotlightOverlay({
  mouseX,
  mouseY,
  isActive,
}: SpotlightOverlayProps) {
  if (!isActive) return null;

  return (
    <motion.div
      className="fixed inset-0 pointer-events-none z-40"
      initial={{ opacity: 0 }}
      animate={{
        opacity: isActive ? 1 : 0,
      }}
      transition={{ duration: 0.3 }}
    >
      <div
        className="w-full h-full relative"
        style={{
          background: `radial-gradient(circle 100px at ${mouseX}px ${mouseY}px, 
            transparent 0%, 
            rgba(0, 0, 0, 0.7) 100%
          )`,
        }}
      />
    </motion.div>
  );
}
