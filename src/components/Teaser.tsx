"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
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
  const [isMuted, setIsMuted] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [easterEggRevealed, setEasterEggRevealed] = useState(false);
  const [keySequence, setKeySequence] = useState("");
  const [showGame, setShowGame] = useState(false);

  const [audioError, setAudioError] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const animationFrameRef = useRef<number>();
  const controls = useAnimation();

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
        <div className="flex-1 w-full flex flex-col justify-center relative px-4 md:px-8">
          <motion.h1
            className="absolute top-[30%] md:top-1/4 left-[15%] md:left-1/4 transform -translate-x-0 md:-translate-x-1/2 text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-pantasia text-white"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            TURN
          </motion.h1>

          <motion.div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-lg sm:text-xl md:text-2xl lg:text-3xl text-white font-pantasia tracking-wider"
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
            className="absolute bottom-[30%] md:bottom-1/4 right-[15%] md:right-1/4 transform translate-x-0 md:translate-x-1/2 text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-pantasia text-white"
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
        <div className="relative z-20 w-full flex flex-col md:flex-row justify-between items-end gap-6 md:gap-0 p-4 md:p-8">
          <motion.div
            className="flex space-x-3 relative z-20 w-full md:w-auto justify-end md:justify-start"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <button
              onClick={togglePlay}
              className="relative z-20 bg-black/30 backdrop-blur-md text-white w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full hover:bg-black/40 transition-colors"
              disabled={!!audioError}
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </button>
            <button
              onClick={toggleMute}
              className="relative z-20 bg-black/30 backdrop-blur-md text-white w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full hover:bg-black/40 transition-colors"
              disabled={!!audioError}
            >
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
            <button
              onClick={toggleGame}
              className="relative z-20 bg-black/30 backdrop-blur-md text-white w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full hover:bg-black/40 transition-colors"
            >
              🛒
            </button>
          </motion.div>

          <motion.div
            className="text-right text-xs md:text-sm w-full md:w-auto"
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
    </main>
  );
}
