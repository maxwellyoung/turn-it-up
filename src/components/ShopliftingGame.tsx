"use client";

import type React from "react";
import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

// Constants & hitbox settings
const CATCH_THRESHOLD = 85; // check collisions earlier
const MISS_THRESHOLD = 95; // miss if beyond this
const CART_HALF_WIDTH = 40; // wider catch area

const ITEMS = ["👟", "👕", "📱", "💻", "⌚", "💍", "📦", "🎮", "🎧", "💰"];
const SPECIAL_ITEM = "💎";
const SECURITY_ITEM = "🚨";
const POWERUP_ITEM = "⚡";
const POWERUP_DURATION = 5000; // 5 sec power-up
const INITIAL_SPEED = 1.5;
const SPEED_INCREMENT = 0.15;
const MAX_CART_ITEMS = 10;
const GAME_DURATION = 60;

interface FallingItem {
  id: number;
  item: string;
  x: number; // in %
  y: number; // in %
  speed: number;
  rotation: number;
  wiggle?: boolean; // new: erratic horizontal wiggle
  isSecurity?: boolean;
}

interface ShopliftingGameProps {
  onClose: () => void;
}

export const ShopliftingGame: React.FC<ShopliftingGameProps> = ({
  onClose,
}) => {
  const [cart, setCart] = useState<string[]>([]);
  const [fallingItems, setFallingItems] = useState<FallingItem[]>([]);
  const [cartPosition, setCartPosition] = useState(50);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [highScore, setHighScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [combo, setCombo] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [securityAlert, setSecurityAlert] = useState(0);
  const [hasSelectedCart, setHasSelectedCart] = useState(false);

  // Vlambeer juice + power-up state
  const [shake, setShake] = useState(false);
  const [freezeFrame, setFreezeFrame] = useState(false);
  const [powerUpActive, setPowerUpActive] = useState(false);
  const [scoreMultiplier, setScoreMultiplier] = useState(1);

  const speedRef = useRef(INITIAL_SPEED);
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const activeNodesRef = useRef<
    Array<{ oscillator: OscillatorNode; gain: GainNode }>
  >([]);
  const animationFrameRef = useRef<number | null>(null);
  const lastUpdateTimeRef = useRef<number>(0);
  const isShakingRef = useRef(false);

  // AUDIO INIT
  useEffect(() => {
    const initAudio = () => {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext ||
          (window as any).webkitAudioContext)();
      }
      document.removeEventListener("click", initAudio);
      document.removeEventListener("touchstart", initAudio);
    };
    document.addEventListener("click", initAudio);
    document.addEventListener("touchstart", initAudio);
    return () => {
      activeNodesRef.current.forEach(({ oscillator, gain }) => {
        try {
          oscillator.stop();
        } catch {}
        oscillator.disconnect();
        gain.disconnect();
      });
      activeNodesRef.current = [];
      if (audioContextRef.current) audioContextRef.current.close();
      document.removeEventListener("click", initAudio);
      document.removeEventListener("touchstart", initAudio);
      if (animationFrameRef.current)
        cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  // SFX
  const playSound = useCallback(
    (type: "catch" | "miss" | "levelUp" | "gameOver" | "security") => {
      if (!audioContextRef.current) return;
      const ctx = audioContextRef.current;
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      activeNodesRef.current.push({ oscillator, gain: gainNode });
      const cleanupNodes = () => {
        oscillator.disconnect();
        gainNode.disconnect();
        activeNodesRef.current = activeNodesRef.current.filter(
          (n) => n.oscillator !== oscillator
        );
      };
      switch (type) {
        case "catch":
          oscillator.type = "sine";
          oscillator.frequency.setValueAtTime(
            440 + combo * 50,
            ctx.currentTime
          );
          gainNode.gain.setValueAtTime(0.2, ctx.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(
            0.01,
            ctx.currentTime + 0.1
          );
          oscillator.start();
          oscillator.stop(ctx.currentTime + 0.1);
          setTimeout(cleanupNodes, 200);
          break;
        case "miss":
          oscillator.type = "triangle";
          oscillator.frequency.setValueAtTime(200, ctx.currentTime);
          oscillator.frequency.exponentialRampToValueAtTime(
            150,
            ctx.currentTime + 0.15
          );
          gainNode.gain.setValueAtTime(0.2, ctx.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(
            0.001,
            ctx.currentTime + 0.15
          );
          oscillator.start();
          oscillator.stop(ctx.currentTime + 0.15);
          setTimeout(cleanupNodes, 200);
          break;
        case "levelUp":
          [440, 550, 660, 880].forEach((freq, i) => {
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
                (n) => n.oscillator !== osc
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
                (n) => n.oscillator !== osc
              );
            }, (i + 1) * 200);
          }
          break;
        case "security":
          oscillator.type = "square";
          oscillator.frequency.setValueAtTime(800, ctx.currentTime);
          oscillator.frequency.exponentialRampToValueAtTime(
            400,
            ctx.currentTime + 0.3
          );
          gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(
            0.01,
            ctx.currentTime + 0.3
          );
          oscillator.start();
          oscillator.stop(ctx.currentTime + 0.3);
          setTimeout(cleanupNodes, 400);
          break;
      }
    },
    [combo]
  );

  // Load high score
  useEffect(() => {
    const savedHighScore = localStorage.getItem("shoplifting-game-high-score");
    if (savedHighScore) setHighScore(Number.parseInt(savedHighScore));
  }, []);

  // Timer
  useEffect(() => {
    if (!gameOver && !isPaused && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !gameOver) {
      setGameOver(true);
      playSound("gameOver");
      if (score > highScore) {
        setHighScore(score);
        localStorage.setItem("shoplifting-game-high-score", score.toString());
      }
    }
  }, [timeLeft, gameOver, isPaused, score, highScore, playSound]);

  // Security alert system
  useEffect(() => {
    if (securityAlert >= 100 && !gameOver) {
      setGameOver(true);
      playSound("gameOver");
      if (score > highScore) {
        setHighScore(score);
        localStorage.setItem("shoplifting-game-high-score", score.toString());
      }
    }
  }, [securityAlert, gameOver, score, highScore, playSound]);

  useEffect(() => {
    if (!gameOver && !isPaused && securityAlert > 0) {
      const timer = setTimeout(
        () => setSecurityAlert((prev) => Math.max(0, prev - 1)),
        500
      );
      return () => clearTimeout(timer);
    }
  }, [securityAlert, gameOver, isPaused]);

  // Power-up timer effect
  useEffect(() => {
    if (powerUpActive) {
      const timer = setTimeout(() => {
        setPowerUpActive(false);
        setScoreMultiplier(1);
      }, POWERUP_DURATION);
      return () => clearTimeout(timer);
    }
  }, [powerUpActive]);

  // Spawning items with new power-up & wiggle behavior
  const spawnItem = useCallback(() => {
    if (isPaused || gameOver) return;
    const securityChance = Math.min(0.05 + (level - 1) * 0.01, 0.2);
    if (Math.random() < securityChance) {
      setFallingItems((prev) => [
        ...prev,
        {
          id: Date.now(),
          item: SECURITY_ITEM,
          x: Math.random() * 100,
          y: 0,
          speed: speedRef.current * 0.8,
          rotation: Math.random() * 360,
          isSecurity: true,
        },
      ]);
      return;
    }
    const rand = Math.random();
    if (rand < 0.05) {
      // Spawn power-up item
      setFallingItems((prev) => [
        ...prev,
        {
          id: Date.now(),
          item: POWERUP_ITEM,
          x: Math.random() * 100,
          y: 0,
          speed: speedRef.current,
          rotation: Math.random() * 360,
          wiggle: Math.random() < 0.5,
        },
      ]);
      return;
    } else if (rand < 0.15) {
      // Spawn special item
      setFallingItems((prev) => [
        ...prev,
        {
          id: Date.now(),
          item: SPECIAL_ITEM,
          x: Math.random() * 100,
          y: 0,
          speed: speedRef.current * 1.5,
          rotation: Math.random() * 360,
          wiggle: Math.random() < 0.5,
        },
      ]);
      return;
    }
    // Spawn normal item
    setFallingItems((prev) => [
      ...prev,
      {
        id: Date.now(),
        item: ITEMS[Math.floor(Math.random() * ITEMS.length)],
        x: Math.random() * 100,
        y: 0,
        speed: speedRef.current,
        rotation: Math.random() * 360,
        wiggle: Math.random() < 0.5,
      },
    ]);
  }, [isPaused, gameOver, level]);

  useEffect(() => {
    if (!gameOver && !isPaused) {
      const interval = setInterval(spawnItem, 1500 / Math.sqrt(level));
      return () => clearInterval(interval);
    }
  }, [gameOver, spawnItem, level, isPaused]);

  // Animation loop with added wiggle
  const updateGameState = useCallback(
    (timestamp: number) => {
      if (!lastUpdateTimeRef.current) lastUpdateTimeRef.current = timestamp;
      const deltaTime = timestamp - lastUpdateTimeRef.current;
      if (deltaTime > 16 && !isPaused && !gameOver) {
        lastUpdateTimeRef.current = timestamp;
        setFallingItems((prev) =>
          prev.map((item) => ({
            ...item,
            y: item.y + (item.speed * deltaTime) / 50,
            rotation: item.rotation + 1.5 * (deltaTime / 16),
            x: item.wiggle ? item.x + Math.sin(timestamp / 100) * 2 : item.x,
          }))
        );
        checkCollision();
      }
      animationFrameRef.current = requestAnimationFrame(updateGameState);
    },
    [isPaused, gameOver]
  );

  useEffect(() => {
    animationFrameRef.current = requestAnimationFrame(updateGameState);
    return () => {
      if (animationFrameRef.current)
        cancelAnimationFrame(animationFrameRef.current);
    };
  }, [updateGameState]);

  // Level up
  useEffect(() => {
    if (score > 0 && score % 10 === 0) {
      setLevel((prev) => prev + 1);
      speedRef.current += SPEED_INCREMENT;
      playSound("levelUp");
      if (!isShakingRef.current) {
        isShakingRef.current = true;
        setShake(true);
        setTimeout(() => {
          setShake(false);
          isShakingRef.current = false;
        }, 500);
      }
    }
  }, [score, playSound]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "a") {
        setCartPosition((prev) => Math.max(5, prev - 5));
      } else if (e.key === "ArrowRight" || e.key === "d") {
        setCartPosition((prev) => Math.min(95, prev + 5));
      } else if (e.key === "p" || e.key === "Escape") {
        setIsPaused((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isPaused && !gameOver && gameAreaRef.current) {
      const rect = gameAreaRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      setCartPosition((x / rect.width) * 100);
    }
  };
  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isPaused && !gameOver && gameAreaRef.current) {
      const rect = gameAreaRef.current.getBoundingClientRect();
      const x = e.touches[0].clientX - rect.left;
      setCartPosition((x / rect.width) * 100);
    }
  };

  // Collision detection with improved hitbox & power-up trigger
  const checkCollision = useCallback(() => {
    if (isPaused || gameOver) return;
    setFallingItems((prev) => {
      const next: FallingItem[] = [];
      let newCombo = combo;
      for (const item of prev) {
        let keepItem = true;
        if (item.y >= CATCH_THRESHOLD) {
          const inCartRange =
            item.x >= cartPosition - CART_HALF_WIDTH &&
            item.x <= cartPosition + CART_HALF_WIDTH;
          if (inCartRange) {
            keepItem = false;
            if (item.isSecurity) {
              setSecurityAlert((prevA) => Math.min(100, prevA + 30));
              playSound("security");
            } else if (item.item === POWERUP_ITEM) {
              setPowerUpActive(true);
              setScoreMultiplier(2);
              playSound("catch");
              setFreezeFrame(true);
              setTimeout(() => setFreezeFrame(false), 50);
            } else {
              setCart((prevCart) => [...prevCart, item.item]);
              setScore(
                (prevScore) =>
                  prevScore +
                  (item.item === SPECIAL_ITEM ? 5 : 1) * scoreMultiplier
              );
              newCombo += 1;
              playSound("catch");
              setFreezeFrame(true);
              setTimeout(() => setFreezeFrame(false), 50);
            }
          } else if (item.y >= MISS_THRESHOLD && !item.isSecurity) {
            keepItem = false;
            newCombo = 0;
            playSound("miss");
            if (!isShakingRef.current) {
              isShakingRef.current = true;
              setShake(true);
              setTimeout(() => {
                setShake(false);
                isShakingRef.current = false;
              }, 300);
            }
          }
        }
        if (keepItem) next.push(item);
      }
      if (next.length !== prev.length) {
        setCombo(newCombo);
      }
      return next;
    });
  }, [cartPosition, combo, isPaused, gameOver, playSound, scoreMultiplier]);

  // Cart capacity
  useEffect(() => {
    if (cart.length >= MAX_CART_ITEMS) {
      setGameOver(true);
      playSound("gameOver");
      if (score > highScore) {
        setHighScore(score);
        localStorage.setItem("shoplifting-game-high-score", score.toString());
      }
    }
  }, [cart, score, highScore, playSound]);

  const resetGame = () => {
    setCart([]);
    setFallingItems([]);
    setScore(0);
    setGameOver(false);
    setLevel(1);
    setCombo(0);
    setIsPaused(false);
    setTimeLeft(GAME_DURATION);
    setSecurityAlert(0);
    setPowerUpActive(false);
    setScoreMultiplier(1);
    speedRef.current = INITIAL_SPEED;
    lastUpdateTimeRef.current = 0;
    setShake(false);
    setFreezeFrame(false);
  };

  const togglePause = () => setIsPaused((prev) => !prev);
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const startGame = () => {
    setHasSelectedCart(true);
  };

  return (
    <div className="relative w-[90vw] h-[70vh] md:w-[500px] md:h-[600px] bg-white rounded-lg shadow-2xl border-2 border-zinc-200 overflow-hidden font-mono">
      {!hasSelectedCart ? (
        <div className="h-full flex flex-col">
          {/* Cart Selection Header */}
          <div className="bg-zinc-100 px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-zinc-900 text-xs">🛒</span>
              <span className="text-zinc-900 text-sm tracking-tight">
                Grab a cart
              </span>
            </div>
            <button
              onClick={onClose}
              className="text-zinc-500 hover:text-zinc-900 transition-colors"
              aria-label="Close game"
            >
              <X size={16} />
            </button>
          </div>

          {/* Cart Selection Screen */}
          <div className="flex-1 flex flex-col items-center justify-center p-8 gap-8">
            <h2 className="text-zinc-900 text-lg font-bold text-center">
              Choose your cart
            </h2>
            <div className="grid grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <motion.button
                  key={i}
                  className="w-24 h-24 flex items-center justify-center bg-zinc-50 border-2 border-zinc-200 rounded-lg hover:border-[#8DB187] transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={startGame}
                >
                  <span className="text-4xl">🛒</span>
                </motion.button>
              ))}
            </div>
            <p className="text-zinc-500 text-sm text-center max-w-[250px]">
              Select any cart to start your shopping spree
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* HEADER */}
          <div className="bg-zinc-100 px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-zinc-900 text-xs">🛒</span>
              <span className="text-zinc-900 text-sm tracking-tight">
                Fill it up!
              </span>
            </div>
            <button
              onClick={onClose}
              className="text-zinc-500 hover:text-zinc-900 transition-colors"
              aria-label="Close game"
            >
              <X size={16} />
            </button>
          </div>

          {/* STATS */}
          <div className="px-4 py-2 bg-zinc-50 border-b-2 border-zinc-200">
            <div className="flex justify-between items-center text-xs text-zinc-900">
              <div>Score: {score}</div>
              <div>High: {highScore}</div>
              <div>Level: {level}</div>
              <div>
                Cart: {cart.length}/{MAX_CART_ITEMS}
              </div>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <div className="text-zinc-600 text-xs">
                ⏰ {formatTime(timeLeft)}
              </div>
              <div className="flex-1">
                <div className="text-[10px] text-zinc-600 mb-1">
                  Security Alert
                </div>
                <div className="h-1 bg-zinc-100 rounded-full">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      securityAlert < 30
                        ? "bg-[#8DB187]"
                        : securityAlert < 70
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    }`}
                    style={{ width: `${securityAlert}%` }}
                  />
                </div>
              </div>
            </div>
            {powerUpActive && (
              <div className="mt-2 text-center text-[#8DB187] text-sm font-bold animate-pulse">
                2X MULTIPLIER!
              </div>
            )}
          </div>

          {/* GAME AREA */}
          <motion.div
            ref={gameAreaRef}
            className="relative h-[calc(100%-120px)] bg-white overflow-hidden"
            onMouseMove={handleMouseMove}
            onTouchMove={handleTouchMove}
            animate={{
              x: shake ? [0, -10, 10, -10, 10, 0] : 0,
              scale: freezeFrame ? 0.9 : 1,
            }}
            transition={{ duration: freezeFrame ? 0.05 : 0.3 }}
          >
            {/* CART HIT AREA (faint) */}
            <div
              className="absolute bottom-[5%] w-[12%] h-[10%] border border-zinc-200 rounded-sm opacity-20 pointer-events-none transition-all duration-75"
              style={{
                left: `${cartPosition}%`,
                transform: "translateX(-50%)",
              }}
            />

            <AnimatePresence>
              {fallingItems.map((item) => (
                <motion.div
                  key={item.id}
                  className={`absolute text-2xl ${
                    item.isSecurity
                      ? "text-red-500"
                      : item.item === POWERUP_ITEM
                      ? "text-[#8DB187] drop-shadow-[0_0_3px_rgba(141,177,135,0.5)]"
                      : item.item === SPECIAL_ITEM
                      ? "text-blue-400 drop-shadow-[0_0_3px_rgba(96,165,250,0.5)]"
                      : "text-zinc-900"
                  }`}
                  style={{
                    left: `${item.x}%`,
                    top: `${item.y}%`,
                    rotate: item.rotation,
                    textShadow: "0 0 3px rgba(0,0,0,0.1)",
                  }}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                >
                  {item.item}
                </motion.div>
              ))}
            </AnimatePresence>

            {/* CART */}
            <motion.div
              className="absolute bottom-[5%] text-zinc-900"
              style={{
                left: `${cartPosition}%`,
                transform: "translateX(-50%)",
                fontSize: "2rem",
              }}
            >
              🛒
              {cart.length > 0 && (
                <div className="absolute -top-2 -right-2 bg-[#8DB187] text-white text-[10px] rounded-sm w-4 h-4 flex items-center justify-center">
                  {cart.length}
                </div>
              )}
            </motion.div>

            {/* COMBO */}
            {combo > 1 && (
              <motion.div
                className="absolute top-4 left-1/2 transform -translate-x-1/2 text-[#8DB187] font-bold text-sm"
                initial={{ y: -20, opacity: 0, scale: 1 }}
                animate={{ y: 0, opacity: 1, scale: [1, 1.3, 1] }}
                exit={{ y: 10, opacity: 0 }}
                key={`combo-${combo}`}
              >
                {combo}x
              </motion.div>
            )}

            {/* SECURITY ALERT OVERLAY */}
            {securityAlert > 70 && (
              <div
                className={`absolute inset-0 bg-red-500/10 pointer-events-none ${
                  securityAlert > 90 ? "animate-pulse" : ""
                }`}
              />
            )}

            {/* PAUSE */}
            <AnimatePresence>
              {isPaused && !gameOver && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-white/80 flex items-center justify-center"
                >
                  <div className="text-center text-zinc-900 text-sm">
                    <p className="mb-4">PAUSED</p>
                    <button
                      onClick={togglePause}
                      className="px-4 py-2 bg-[#8DB187] text-white hover:bg-[#94B38D] transition-colors"
                    >
                      RESUME
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* INVENTORY */}
          <div className="absolute bottom-0 left-0 right-0 bg-zinc-50 px-2 py-1 border-t-2 border-zinc-200 flex gap-1 justify-center">
            {cart.map((item, index) => (
              <motion.span
                key={`cart-item-${index}`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-sm"
              >
                {item}
              </motion.span>
            ))}
          </div>

          {/* GAME OVER */}
          <AnimatePresence>
            {gameOver && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-white/90 flex items-center justify-center"
              >
                <div className="text-center bg-white p-6 border-2 border-zinc-200 shadow-lg">
                  <p className="text-zinc-900 text-lg mb-2">
                    {securityAlert >= 100
                      ? "CAUGHT!"
                      : timeLeft <= 0
                      ? "TIME'S UP!"
                      : "CART FULL!"}
                  </p>
                  <p className="text-zinc-600 mb-4 text-sm">Score: {score}</p>
                  {score > highScore && (
                    <p className="text-[#8DB187] text-sm mb-4">
                      New High Score!
                    </p>
                  )}
                  <button
                    onClick={resetGame}
                    className="px-6 py-2 bg-[#8DB187] text-white hover:bg-[#94B38D] transition-colors text-sm"
                  >
                    TRY AGAIN
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
};

export default ShopliftingGame;
