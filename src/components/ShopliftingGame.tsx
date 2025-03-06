"use client";

import type React from "react";
import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, X, Star } from "lucide-react";

const items = ["🎵", "🎸", "🥁", "🎹", "🎷", "🎺", "🎻"];
const SPECIAL_ITEM = "⭐";
const INITIAL_SPEED = 2;
const SPEED_INCREMENT = 0.2;

interface ShopliftingGameProps {
  onClose: () => void;
}

export const ShopliftingGame: React.FC<ShopliftingGameProps> = ({
  onClose,
}) => {
  const [cart, setCart] = useState<string[]>([]);
  const [fallingItems, setFallingItems] = useState<
    Array<{ id: number; item: string; x: number; y: number; speed: number }>
  >([]);
  const [cartPosition, setCartPosition] = useState(50);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [highScore, setHighScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [combo, setCombo] = useState(0);
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const speedRef = useRef(INITIAL_SPEED);
  const audioContextRef = useRef<AudioContext | null>(null);
  const activeNodesRef = useRef<
    Array<{ oscillator: OscillatorNode; gain: GainNode }>
  >([]);

  // Initialize audio context
  useEffect(() => {
    audioContextRef.current = new (window.AudioContext ||
      (window as any).webkitAudioContext)();

    return () => {
      // Clean up all active sound nodes
      activeNodesRef.current.forEach(({ oscillator, gain }) => {
        try {
          oscillator.stop();
        } catch (e) {
          // Ignore error if oscillator wasn't started
        }
        oscillator.disconnect();
        gain.disconnect();
      });
      activeNodesRef.current = [];

      // Close audio context
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Sound effect functions
  const playSound = (type: "catch" | "miss" | "levelUp" | "gameOver") => {
    if (!audioContextRef.current) return;

    const ctx = audioContextRef.current;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    // Add nodes to active nodes list
    activeNodesRef.current.push({ oscillator, gain: gainNode });

    // Clean up these nodes after they're done
    const cleanupNodes = () => {
      oscillator.disconnect();
      gainNode.disconnect();
      activeNodesRef.current = activeNodesRef.current.filter(
        (nodes) => nodes.oscillator !== oscillator
      );
    };

    switch (type) {
      case "catch":
        oscillator.type = "sine";
        oscillator.frequency.setValueAtTime(440 + combo * 50, ctx.currentTime);
        gainNode.gain.setValueAtTime(0.2, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
        oscillator.start();
        oscillator.stop(ctx.currentTime + 0.1);
        setTimeout(cleanupNodes, 200);
        break;

      case "miss":
        oscillator.type = "sawtooth";
        oscillator.frequency.setValueAtTime(200, ctx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(
          50,
          ctx.currentTime + 0.2
        );
        gainNode.gain.setValueAtTime(0.2, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
        oscillator.start();
        oscillator.stop(ctx.currentTime + 0.2);
        setTimeout(cleanupNodes, 300);
        break;

      case "levelUp":
        const notes = [440, 550, 660, 880];
        notes.forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          activeNodesRef.current.push({ oscillator: osc, gain });

          osc.type = "triangle";
          osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.1);
          gain.gain.setValueAtTime(0.2, ctx.currentTime + i * 0.1);
          gain.gain.exponentialRampToValueAtTime(
            0.01,
            ctx.currentTime + i * 0.1 + 0.1
          );
          osc.start(ctx.currentTime + i * 0.1);
          osc.stop(ctx.currentTime + i * 0.1 + 0.1);

          setTimeout(() => {
            osc.disconnect();
            gain.disconnect();
            activeNodesRef.current = activeNodesRef.current.filter(
              (nodes) => nodes.oscillator !== osc
            );
          }, (i + 1) * 200);
        });
        break;

      case "gameOver":
        const startFreq = 440;
        for (let i = 0; i < 10; i++) {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          activeNodesRef.current.push({ oscillator: osc, gain });

          osc.type = "square";
          osc.frequency.setValueAtTime(
            startFreq - i * 30,
            ctx.currentTime + i * 0.1
          );
          gain.gain.setValueAtTime(0.2, ctx.currentTime + i * 0.1);
          gain.gain.exponentialRampToValueAtTime(
            0.01,
            ctx.currentTime + i * 0.1 + 0.1
          );
          osc.start(ctx.currentTime + i * 0.1);
          osc.stop(ctx.currentTime + i * 0.1 + 0.1);

          setTimeout(() => {
            osc.disconnect();
            gain.disconnect();
            activeNodesRef.current = activeNodesRef.current.filter(
              (nodes) => nodes.oscillator !== osc
            );
          }, (i + 1) * 200);
        }
        break;
    }
  };

  // Load high score from localStorage
  useEffect(() => {
    const savedHighScore = localStorage.getItem("shoplifting-high-score");
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore));
    }
  }, []);

  const spawnItem = useCallback(() => {
    const isSpecial = Math.random() < 0.1; // 10% chance for special item
    const newItem = isSpecial
      ? SPECIAL_ITEM
      : items[Math.floor(Math.random() * items.length)];
    const newX = Math.random() * 100;
    setFallingItems((prev) => [
      ...prev,
      {
        id: Date.now(),
        item: newItem,
        x: newX,
        y: 0,
        speed: speedRef.current * (isSpecial ? 1.5 : 1), // Special items fall faster
      },
    ]);
  }, []);

  useEffect(() => {
    if (!gameOver) {
      const interval = setInterval(spawnItem, 1500 / Math.sqrt(level));
      return () => clearInterval(interval);
    }
  }, [gameOver, spawnItem, level]);

  useEffect(() => {
    const moveInterval = setInterval(() => {
      setFallingItems((prev) =>
        prev
          .map((item) => ({
            ...item,
            y: item.y + item.speed,
          }))
          .filter((item) => item.y < 100)
      );
    }, 50);

    return () => clearInterval(moveInterval);
  }, []);

  // Level up system with sound
  useEffect(() => {
    if (score > 0 && score % 10 === 0) {
      setLevel((prev) => prev + 1);
      speedRef.current += SPEED_INCREMENT;
      playSound("levelUp");
    }
  }, [score]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (gameAreaRef.current) {
      const rect = gameAreaRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      setCartPosition((x / rect.width) * 100);
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (gameAreaRef.current) {
      const rect = gameAreaRef.current.getBoundingClientRect();
      const x = e.touches[0].clientX - rect.left;
      setCartPosition((x / rect.width) * 100);
    }
  };

  const checkCollision = useCallback(() => {
    let itemCaught = false;
    setFallingItems((prev) =>
      prev.filter((item) => {
        const itemBottom = item.y + 10;
        const itemLeft = item.x;
        const itemRight = item.x + 10;
        const cartLeft = cartPosition - 10;
        const cartRight = cartPosition + 10;

        if (itemBottom >= 90 && itemLeft < cartRight && itemRight > cartLeft) {
          setCart((prevCart) => [...prevCart, item.item]);
          setScore((prevScore) => {
            const points = item.item === SPECIAL_ITEM ? 3 : 1;
            return prevScore + points;
          });
          setCombo((prev) => prev + 1);
          playSound("catch");
          itemCaught = true;
          return false;
        }
        // If item passed the bottom without being caught
        if (itemBottom >= 100) {
          setCombo(0);
          playSound("miss");
        }
        return true;
      })
    );
    if (!itemCaught) {
      setCombo(0);
    }
  }, [cartPosition]);

  useEffect(() => {
    const collisionInterval = setInterval(checkCollision, 100);
    return () => clearInterval(collisionInterval);
  }, [checkCollision]);

  useEffect(() => {
    if (cart.length >= 10) {
      setGameOver(true);
      playSound("gameOver");
      if (score > highScore) {
        setHighScore(score);
        localStorage.setItem("shoplifting-high-score", score.toString());
      }
    }
  }, [cart, score, highScore]);

  const resetGame = () => {
    setCart([]);
    setFallingItems([]);
    setScore(0);
    setGameOver(false);
    setLevel(1);
    setCombo(0);
    speedRef.current = INITIAL_SPEED;
  };

  return (
    <div className="relative w-[90vw] h-[70vh] md:w-[500px] md:h-[600px] bg-black/80 backdrop-blur-md rounded-lg p-4 border border-white/10">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
        aria-label="Close game"
      >
        <X size={24} />
      </button>

      <h3 className="text-white text-center mb-2 text-xl md:text-2xl">
        Catch the music!
      </h3>

      <div className="flex justify-between items-center mb-4">
        <div className="flex flex-col text-white/60">
          <span>Score: {score}</span>
          <span className="text-sm">High Score: {highScore}</span>
        </div>
        <div className="flex flex-col items-end text-white/60">
          <span>Level: {level}</span>
          <span>Cart: {cart.length}/10</span>
        </div>
      </div>

      <div
        ref={gameAreaRef}
        className="relative h-[calc(100%-160px)] bg-gray-900/50 rounded-lg overflow-hidden"
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
      >
        {fallingItems.map((item) => (
          <motion.div
            key={item.id}
            className={`absolute text-4xl ${
              item.item === SPECIAL_ITEM ? "text-yellow-400 animate-pulse" : ""
            }`}
            style={{ left: `${item.x}%`, top: `${item.y}%` }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
          >
            {item.item}
          </motion.div>
        ))}

        <motion.div
          key={`cart-${combo}`}
          className="absolute bottom-0 w-20 h-20 flex items-center justify-center"
          style={{ left: `${cartPosition}%`, x: "-50%" }}
          animate={{
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 0.3 }}
        >
          <ShoppingCart size={48} className="text-white/60" />
        </motion.div>

        {combo > 1 && (
          <motion.div
            className="absolute top-4 left-1/2 transform -translate-x-1/2 text-white font-bold text-2xl"
            initial={{ y: -20, opacity: 0, scale: 0.8 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 10, opacity: 0, scale: 0.9 }}
            transition={{
              duration: 0.3,
              exit: { duration: 0.5 },
            }}
            key={`combo-${combo}`}
          >
            <motion.span
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              {combo}x Combo!
            </motion.span>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {gameOver && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/90 flex items-center justify-center rounded-lg"
          >
            <div className="text-center">
              <p className="text-white text-2xl mb-2">Cart Full!</p>
              <p className="text-white/60 mb-4">Final Score: {score}</p>
              {score > highScore && (
                <motion.p
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-yellow-400 flex items-center justify-center gap-2 mb-4"
                >
                  <Star size={24} /> New High Score! <Star size={24} />
                </motion.p>
              )}
              <button
                onClick={resetGame}
                className="bg-white/10 text-white px-6 py-3 rounded-full hover:bg-white/20 transition-colors"
              >
                Play Again
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
