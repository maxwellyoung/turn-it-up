"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import { Play, Pause, Volume2, VolumeX, Share2 } from "lucide-react";
import { ShopliftingGame } from "./ShopliftingGame";
import AnimatedNumber from "./AnimatedNumber";
import Image from "next/image";

export default function TeaserPage() {
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [easterEggRevealed, setEasterEggRevealed] = useState(false);
  const [keySequence, setKeySequence] = useState("");
  const [showGame, setShowGame] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  const [audioError, setAudioError] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const animationFrameRef = useRef<number>();
  const controls = useAnimation();
  const [particlesData, setParticlesData] = useState(
    Array(40).fill({ scale: 1, opacity: 0.7, rotate: 0, color: "#fff" })
  );

  useEffect(() => {
    const releaseDate = new Date("2025-03-14T00:00:00");

    const timer = setInterval(() => {
      const now = new Date();
      const difference = releaseDate.getTime() - now.getTime();

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setCountdown({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const initializeAudio = async () => {
      try {
        // Create AudioContext first
        const AudioContext =
          window.AudioContext || (window as any).webkitAudioContext;
        audioContextRef.current = new AudioContext();

        // Create and configure audio element
        const audio = new Audio();
        audio.crossOrigin = "anonymous";
        audio.src =
          "https://np4w69e6wb.ufs.sh/f/L9QjVBA1Po9rVmmFHmGfg14nHvlomNUysKOfWbVBjZad8c6p";
        audio.loop = true;
        audio.preload = "auto";
        audioRef.current = audio;

        // Set up audio nodes
        analyserRef.current = audioContextRef.current.createAnalyser();
        sourceRef.current =
          audioContextRef.current.createMediaElementSource(audio);
        sourceRef.current.connect(analyserRef.current);
        analyserRef.current.connect(audioContextRef.current.destination);

        // Wait for the audio to be loaded
        await new Promise((resolve, reject) => {
          audio.addEventListener("canplaythrough", resolve, { once: true });
          audio.addEventListener(
            "error",
            (e) => {
              console.error("Audio loading error:", e);
              reject(e);
            },
            { once: true }
          );
        });

        setAudioError(null);
      } catch (error) {
        console.error("Error initializing audio:", error);
        setAudioError("Failed to load audio. Please try again later.");
      }
    };

    initializeAudio();

    const handleKeyPress = (e: KeyboardEvent) => {
      setKeySequence((prev) => (prev + e.key).slice(-4));
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  useEffect(() => {
    if (keySequence === "TURN") {
      setEasterEggRevealed(true);
      setTimeout(() => setEasterEggRevealed(false), 5000);
    }
  }, [keySequence]);

  useEffect(() => {
    const updateGradient = () => {
      document.documentElement.style.setProperty(
        "--gradient-from",
        "88, 28, 135"
      );
      document.documentElement.style.setProperty("--gradient-to", "6, 78, 59");
    };
    updateGradient();
  }, []);

  useEffect(() => {
    if (isPlaying && canvasRef.current && analyserRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      if (!ctx) return;

      function renderFrame() {
        const WIDTH = canvasRef.current!.width;
        const HEIGHT = canvasRef.current!.height;

        analyserRef.current!.fftSize = 256;
        const bufferLength = analyserRef.current!.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        if (!ctx) return;

        ctx.clearRect(0, 0, WIDTH, HEIGHT);

        analyserRef.current!.getByteFrequencyData(dataArray);

        const barWidth = (WIDTH / bufferLength) * 2.5;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          const barHeight = dataArray[i] / 2;
          ctx.fillStyle = `rgb(${barHeight + 100}, 50, 50)`;
          ctx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);
          x += barWidth + 1;
        }

        animationFrameRef.current = requestAnimationFrame(renderFrame);
      }

      renderFrame();

      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };
    }
  }, [isPlaying]);

  useEffect(() => {
    if (!isPlaying || !analyserRef.current) return;

    analyserRef.current.fftSize = 512;
    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const updateParticles = () => {
      if (!analyserRef.current) return;

      analyserRef.current.getByteFrequencyData(dataArray);

      setParticlesData((prevParticles) =>
        prevParticles.map((_, i) => {
          const bassIndex = Math.floor(dataArray.length * 0.1);
          const midIndex = Math.floor(dataArray.length * 0.5);
          const highIndex = Math.floor(dataArray.length * 0.9);

          const bass =
            dataArray.slice(0, bassIndex).reduce((a, b) => a + b, 0) /
            bassIndex;
          const mid =
            dataArray.slice(bassIndex, midIndex).reduce((a, b) => a + b, 0) /
            (midIndex - bassIndex);
          const high =
            dataArray.slice(midIndex, highIndex).reduce((a, b) => a + b, 0) /
            (highIndex - midIndex);

          const intensity = (bass + mid + high) / (255 * 3);
          const hue = (bass / 255) * 360;
          const size = 1 + (mid / 255) * 3;
          const speed = 1 + (high / 255) * 2;

          return {
            scale: size * (1 + Math.sin(Date.now() * 0.003 * speed + i) * 0.5),
            opacity: 0.4 + intensity * 0.6,
            rotate: (Date.now() * 0.1 * speed + i * 45) % 360,
            color: `hsl(${hue}, 80%, 60%)`,
          };
        })
      );

      animationFrameRef.current = requestAnimationFrame(updateParticles);
    };

    updateParticles();
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying]);

  const togglePlay = async () => {
    if (audioRef.current) {
      try {
        if (isPlaying) {
          await audioRef.current.pause();
        } else {
          // Resume or start AudioContext if it's suspended
          if (audioContextRef.current?.state === "suspended") {
            await audioContextRef.current.resume();
          }
          await audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
      } catch (error) {
        console.error("Error playing audio:", error);
        setAudioError("Failed to play audio. Please try again.");
      }
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
    controls.start({
      x: (e.clientX - window.innerWidth / 2) * 0.05,
      y: (e.clientY - window.innerHeight / 2) * 0.05,
      transition: { type: "spring", stiffness: 50, damping: 30 },
    });
  };

  const shareTeaser = async () => {
    if (isSharing) return;

    const teaserText =
      "Something big is coming. TURN IT UP. 🎵 #TurnItUp #ComingSoon";
    const teaserUrl = "https://wherehaveyoubeen.blog";

    if (navigator.share) {
      try {
        setIsSharing(true);
        await navigator.share({
          title: "TURN IT UP - Coming Soon",
          text: teaserText,
          url: teaserUrl,
        });
      } catch (error) {
        if (error instanceof Error && error.name !== "AbortError") {
          console.error("Error sharing:", error);
        }
      } finally {
        setIsSharing(false);
      }
    } else {
      window.open(
        `https://twitter.com/intent/tweet?text=${encodeURIComponent(
          teaserText
        )}&url=${encodeURIComponent(teaserUrl)}`,
        "_blank"
      );
    }
  };

  const toggleGame = () => {
    setShowGame((prev) => !prev);
  };

  return (
    <main
      className="h-screen w-screen overflow-hidden relative font-pantasia"
      onMouseMove={handleMouseMove}
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/9-njf2h6xVzLLrlwcfKphzBDQGRwMCSR.jpeg"
          alt="Background"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Content wrapper */}
      <div className="relative z-10 h-full w-full flex flex-col items-center justify-between p-4 md:p-8">
        {/* Header */}
        <div className="w-full flex justify-between items-start">
          <motion.p
            className="text-black mix-blend-difference text-xs md:text-sm lg:text-base"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
          >
            MAXWELL YOUNG × THOM HAHA
          </motion.p>
        </div>

        {/* Main content */}
        <div className="flex-1 w-full flex flex-col justify-center relative">
          <motion.h1
            className="absolute top-1/3 md:top-1/4 left-1/2 md:left-1/4 transform -translate-x-1/2 text-4xl sm:text-5xl md:text-7xl lg:text-9xl font-pantasia text-white"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            TURN
          </motion.h1>

          <motion.div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 font-pantasia"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <AnimatedNumber value={countdown.days} />d{" "}
            <AnimatedNumber value={countdown.hours} />h{" "}
            <AnimatedNumber value={countdown.minutes} />m{" "}
            <AnimatedNumber value={countdown.seconds} />s
          </motion.div>

          <motion.h1
            className="absolute bottom-1/3 md:bottom-1/4 right-1/2 md:right-1/4 transform translate-x-1/2 text-4xl sm:text-5xl md:text-7xl lg:text-9xl font-pantasia text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            IT UP
          </motion.h1>
        </div>

        {/* Audio visualizer - Move this above the controls */}
        <canvas
          ref={canvasRef}
          className="absolute bottom-0 left-0 w-full h-16 z-10 opacity-60 pointer-events-none"
        />

        {/* Controls and footer */}
        <div className="relative z-20 w-full flex flex-col md:flex-row justify-between items-center md:items-end gap-4 md:gap-0">
          <motion.div
            className="flex space-x-2 md:space-x-4 relative z-20"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <button
              onClick={togglePlay}
              className="relative z-20 bg-black/30 backdrop-blur-md text-white p-2 md:p-3 rounded-full hover:bg-black/40 transition-colors"
              disabled={!!audioError}
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </button>
            <button
              onClick={toggleMute}
              className="relative z-20 bg-black/30 backdrop-blur-md text-white p-2 md:p-3 rounded-full hover:bg-black/40 transition-colors"
              disabled={!!audioError}
            >
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
            <button
              onClick={shareTeaser}
              className="relative z-20 bg-black/30 backdrop-blur-md text-white p-2 md:p-3 rounded-full hover:bg-black/40 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSharing}
            >
              <Share2 size={20} />
            </button>
            <button
              onClick={toggleGame}
              className="relative z-20 bg-black/30 backdrop-blur-md text-white w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full hover:bg-black/40 transition-colors"
            >
              🛒
            </button>
          </motion.div>

          <motion.div
            className="text-center md:text-right text-xs md:text-sm"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <p className="text-black mix-blend-difference">© 2025</p>
            <a
              href="https://www.instagram.com/maxwell_young/"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-black mix-blend-difference hover:text-emerald-400 transition-colors"
            >
              @maxwell_young
            </a>
            <a
              href="https://www.instagram.com/thom_haha/"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-black mix-blend-difference hover:text-purple-400 transition-colors"
            >
              @thom_haha
            </a>
          </motion.div>
        </div>

        {/* Audio error message */}
        {audioError && (
          <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-full text-sm">
            {audioError}
          </div>
        )}
      </div>

      {/* Game overlay */}
      <AnimatePresence>
        {showGame && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center"
          >
            <ShopliftingGame onClose={() => setShowGame(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Particles effect */}
      <AnimatePresence>
        {isPlaying && (
          <motion.div
            className="absolute inset-0 pointer-events-none z-30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            {particlesData.map((particle, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full"
                animate={{
                  opacity: particle.opacity,
                  rotate: particle.rotate,
                  backgroundColor: particle.color,
                }}
                transition={{
                  duration: 0.1,
                  ease: "linear",
                }}
                style={{
                  x: `calc(${mousePosition.x}px + ${
                    Math.sin(i) * 200 - 100
                  }px)`,
                  y: `calc(${mousePosition.y}px + ${
                    Math.cos(i) * 200 - 100
                  }px)`,
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
