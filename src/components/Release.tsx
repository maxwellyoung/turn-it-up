"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  ExternalLink,
  X,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import QuestionTrail from "@/components/QuestionTrail";
import SpotlightOverlay from "@/components/SpotlightOverlay";
import { ShopliftingGame } from "./ShopliftingGame";
import { event as gaEvent } from "@/lib/gtag";

export default function Release() {
  const [enlargedPhoto, setEnlargedPhoto] = useState<number | null>(null);
  const [showLyrics, setShowLyrics] = useState(false);
  const [trailPosition, setTrailPosition] = useState({ x: 0, y: 0 });
  const [showTrail, setShowTrail] = useState(false);
  const [isTextAnimating, setIsTextAnimating] = useState(false);
  const [showGame, setShowGame] = useState(false);
  const [showStreamingLinks, setShowStreamingLinks] = useState(false);

  const handleMouseEnter = (e: React.MouseEvent) => {
    const hoverPos = { x: e.clientX, y: e.clientY };
    setTrailPosition(hoverPos);
    setShowTrail(true);
    setIsTextAnimating(true);
  };

  const handleMouseLeave = () => {
    setShowTrail(false);
    setIsTextAnimating(false);
  };

  const images = [
    //    "/photos/1.jpeg",
    "/photos/2.jpeg",
    "/photos/3.jpeg",
    "/photos/4.jpeg",
    "/photos/5.jpeg",
    "/photos/6.jpeg",
    "/photos/7.jpeg",
  ];

  // Handle keyboard navigation for enlarged photos
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (enlargedPhoto === null) return;

      if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        setEnlargedPhoto((prev) =>
          prev === null ? null : prev > 0 ? prev - 1 : images.length - 1
        );
      } else if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        setEnlargedPhoto((prev) =>
          prev === null ? null : prev < images.length - 1 ? prev + 1 : 0
        );
      } else if (e.key === "Escape") {
        e.preventDefault();
        setEnlargedPhoto(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [enlargedPhoto, images.length]);

  // Navigation functions for buttons
  const navigatePhotos = (direction: "prev" | "next") => {
    if (direction === "prev") {
      setEnlargedPhoto((prev) =>
        prev === null ? null : prev > 0 ? prev - 1 : images.length - 1
      );
    } else {
      setEnlargedPhoto((prev) =>
        prev === null ? null : prev < images.length - 1 ? prev + 1 : 0
      );
    }
  };

  const handleStreamingClick = (platform: string) => {
    gaEvent({
      action: "click",
      category: "Music",
      label: `Stream on ${platform}`,
    });
  };

  const handleGameClick = () => {
    gaEvent({
      action: "click",
      category: "Game",
      label: "Open Game",
    });
  };

  return (
    <main className="h-screen w-screen bg-white text-zinc-900 font-pantasia overflow-hidden text-[10px]">
      <div className="grid grid-cols-4 md:grid-cols-12 grid-rows-[auto] md:grid-rows-6 gap-px h-full bg-zinc-100">
        {/* Header */}
        <div className="col-span-4 md:col-span-12 row-span-1 bg-white p-4 flex items-center justify-between">
          <h1>TURN IT UP</h1>
          <p>
            <a
              href="https://www.instagram.com/maxwell_young/"
              target="_blank"
              rel="noopener noreferrer"
              className="instagram-link"
            >
              MAXWELL YOUNG
            </a>
            {" × "}
            <a
              href="https://www.instagram.com/thom_haha/"
              target="_blank"
              rel="noopener noreferrer"
              className="instagram-link"
            >
              THOM HAHA
            </a>
          </p>
        </div>

        {/* Main content - Technical Specs */}
        <div className="col-span-4 md:col-span-8 row-span-auto md:row-span-1 bg-white p-4">
          <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-[10px] md:text-[10px]">
            <div className="text-zinc-500">RELEASE DATE:</div>
            <div>2025.03.14</div>
            <div className="text-zinc-500">DURATION:</div>
            <div>02:17</div>
            <div className="text-zinc-500">BPM:</div>
            <div>120</div>
            <div className="text-zinc-500">GENRE:</div>
            <div>POP</div>
            <div className="text-zinc-500">PRODUCED BY:</div>
            <div>
              <a
                href="https://www.instagram.com/thom_haha/"
                target="_blank"
                rel="noopener noreferrer"
                className="instagram-link"
              >
                THOM HAHA
              </a>
            </div>
            <div className="text-zinc-500">WRITTEN/PERFORMED BY:</div>
            <div>
              <a
                href="https://www.instagram.com/maxwell_young/"
                target="_blank"
                rel="noopener noreferrer"
                className="instagram-link"
              >
                MAXWELL YOUNG
              </a>
            </div>
            <div className="text-zinc-500">VIDEO BY:</div>
            <div>
              <a
                href="https://www.instagram.com/tomlesnak/"
                target="_blank"
                rel="noopener noreferrer"
                className="instagram-link"
              >
                TOM SHACKLETON
              </a>
            </div>
            <div className="text-zinc-500">MIXED BY:</div>
            <div>
              <a
                href="https://www.instagram.com/lontalius/"
                target="_blank"
                rel="noopener noreferrer"
                className="instagram-link"
              >
                EDDIE JOHNSTON
              </a>
            </div>
          </div>
        </div>

        {/* Listen buttons section */}
        <div className="col-span-4 md:col-start-9 md:col-span-4 row-span-1 bg-white p-4 flex items-center justify-end space-x-4">
          <div className="relative">
            <button
              onClick={() => setShowStreamingLinks(!showStreamingLinks)}
              className="bg-[#8DB187] text-black px-4 py-2 md:px-3 md:py-1 flex items-center hover:bg-[#94B38D] transition-colors"
            >
              <Play size={12} className="mr-2 md:mr-1" /> Listen Now
            </button>
            {showStreamingLinks && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-zinc-200 shadow-lg z-50">
                <a
                  href="https://open.spotify.com/album/0UIKSfLQNdEyeEiQzQ912Z?si=c4f1cad4c7df40b0"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block px-4 py-2 text-sm hover:bg-zinc-50 flex items-center"
                  onClick={() => handleStreamingClick("Spotify")}
                >
                  <Image
                    src="/spotify.svg"
                    alt="Spotify"
                    width={16}
                    height={16}
                    className="mr-2"
                  />
                  Spotify
                </a>
                <a
                  href="https://music.apple.com/nz/album/turn-it-up-single/1801225424"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block px-4 py-2 text-sm hover:bg-zinc-50 flex items-center"
                  onClick={() => handleStreamingClick("Apple Music")}
                >
                  <Image
                    src="/apple-music.svg"
                    alt="Apple Music"
                    width={16}
                    height={16}
                    className="mr-2"
                  />
                  Apple Music
                </a>
                <a
                  href="https://soundcloud.com/maxwell_young/turn-it-up"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block px-4 py-2 text-sm hover:bg-zinc-50 flex items-center"
                  onClick={() => handleStreamingClick("SoundCloud")}
                >
                  <Image
                    src="/soundcloud.svg"
                    alt="SoundCloud"
                    width={16}
                    height={16}
                    className="mr-2"
                  />
                  SoundCloud
                </a>
                <a
                  href="https://www.youtube.com/watch?v=YzKTnAIGqvg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block px-4 py-2 text-sm hover:bg-zinc-50 flex items-center"
                  onClick={() => handleStreamingClick("YouTube")}
                >
                  <Image
                    src="/youtube.svg"
                    alt="YouTube"
                    width={16}
                    height={16}
                    className="mr-2"
                  />
                  YouTube
                </a>
              </div>
            )}
          </div>
          <button
            onClick={() => {
              handleGameClick();
              setShowGame(true);
            }}
            className="border-2 md:border border-[#8DB187] text-[#8DB187] px-4 py-2 md:px-3 md:py-1 flex items-center hover:bg-[#8DB187]/10 transition-colors"
          >
            <ExternalLink size={12} className="mr-2 md:mr-1" /> Play Game
          </button>
        </div>

        {/* Photo Strip */}
        <div className="col-span-4 md:col-span-8 row-span-1 bg-white overflow-hidden">
          <div className="w-full h-full overflow-x-auto overflow-y-hidden scrollbar-thin scrollbar-track-white scrollbar-thumb-zinc-200 scroll-smooth">
            <div className="flex gap-2 md:gap-px p-2 md:p-0 min-w-fit">
              {images.map((src, index) => (
                <motion.div
                  key={index}
                  className="w-[150px] md:w-[200px] relative aspect-square filter hover:brightness-125 transition-all duration-300 cursor-pointer bg-white rounded-sm md:rounded-none"
                  onClick={() => setEnlargedPhoto(index)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Image
                    src={src}
                    alt={`Image ${index + 1}`}
                    fill
                    className="object-cover opacity-80 hover:opacity-100 transition-opacity rounded-sm md:rounded-none"
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Lyrics Section - Mobile Collapsible */}
        <div className="col-span-4 md:col-start-9 md:col-span-4 md:row-start-3 md:row-span-3 bg-white">
          <button
            onClick={() => setShowLyrics(!showLyrics)}
            className="w-full p-4 flex items-center justify-between md:hidden border-b border-zinc-100"
          >
            <span>LYRICS</span>
            {showLyrics ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          <div className={`${showLyrics ? "block" : "hidden md:block"} p-4`}>
            <div className="h-[calc(100%-2rem)] overflow-auto pt-2">
              <div className="font-pantasia flex flex-col gap-4">
                <div>we were staying up</div>
                <div>im not there enough</div>
                <div>had a bad dream</div>
                <div>all a sudden felt a rush</div>
                <div>you look back at me</div>
                <div>im no more deceased</div>
                <div>had a bad dream</div>
                <div>all a sudden felt it crush crush crush crush</div>
                <div>yea we shoplifting</div>
                <div>grab a cart and fill it up</div>
                <div>like im weightlifting</div>
                <div>way i put my head above</div>
                <div>all the girls with me wanna fuckin it turn up</div>
                <div>all the girls with me wanna fuckin it turn up</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main media area */}
        <div className="col-span-4 md:col-span-8 row-span-auto md:row-span-2 bg-white overflow-hidden">
          <div className="w-full h-full">
            <video
              className="w-full h-full object-cover bg-white"
              controls
              autoPlay
              loop
              src="https://np4w69e6wb.ufs.sh/f/L9QjVBA1Po9ryfI80TZrmwE9h1XzAjoZvJciTdqp7exIfH62"
              style={{ colorScheme: "light" }}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="col-span-4 md:col-span-12 row-span-1 bg-white p-4 flex flex-col md:flex-row items-center justify-between gap-2 md:gap-0">
          <div className="text-center md:text-left">
            © 2025{" "}
            <a
              href="https://www.instagram.com/maxwell_young/"
              target="_blank"
              rel="noopener noreferrer"
              className="instagram-link"
            >
              MAXWELL YOUNG
            </a>
            {" & "}
            <a
              href="https://www.instagram.com/thom_haha/"
              target="_blank"
              rel="noopener noreferrer"
              className="instagram-link"
            >
              THOM HAHA
            </a>
          </div>
          <motion.div
            className="cursor-pointer relative z-50"
            animate={
              isTextAnimating
                ? {
                    color: "#8DB187",
                    textShadow: "0 0 10px rgba(141,177,135,0.3)",
                  }
                : {
                    color: "#000",
                    textShadow: "0 0 0 rgba(141,177,135,0)",
                  }
            }
            transition={{
              duration: 0.3,
              ease: "easeOut",
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onMouseMove={handleMouseEnter}
          >
            WHERE HAVE YOU BEEN
          </motion.div>
        </div>

        <QuestionTrail
          mouseX={trailPosition.x}
          mouseY={trailPosition.y}
          isActive={showTrail}
        />
        <SpotlightOverlay
          mouseX={trailPosition.x}
          mouseY={trailPosition.y}
          isActive={showTrail}
        />
      </div>

      {/* Game overlay */}
      {showGame && (
        <div className="fixed inset-0 bg-white/90 z-50 flex items-center justify-center">
          <button
            className="absolute top-4 right-4 text-zinc-900 hover:text-[#8DB187] p-2"
            onClick={() => setShowGame(false)}
          >
            <X size={24} />
          </button>
          <ShopliftingGame onClose={() => setShowGame(false)} />
        </div>
      )}

      {/* Enlarged Photo Modal */}
      <AnimatePresence>
        {enlargedPhoto !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white/90 z-50 flex items-center justify-center"
            onClick={() => setEnlargedPhoto(null)}
          >
            <button
              className="absolute top-4 right-4 text-zinc-900 hover:text-[#8DB187] p-2"
              onClick={() => setEnlargedPhoto(null)}
            >
              <X size={24} />
            </button>

            {/* Navigation Buttons */}
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-900 hover:text-[#8DB187] p-2"
              onClick={(e) => {
                e.stopPropagation();
                navigatePhotos("prev");
              }}
            >
              <ChevronLeft size={24} />
            </button>
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-900 hover:text-[#8DB187] p-2"
              onClick={(e) => {
                e.stopPropagation();
                navigatePhotos("next");
              }}
            >
              <ChevronRight size={24} />
            </button>

            <motion.div
              className="relative w-[90vw] md:w-[80vw] h-[80vh]"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={images[enlargedPhoto]}
                alt={`Enlarged image ${enlargedPhoto + 1}`}
                fill
                className="object-contain"
              />
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-zinc-500 text-sm">
                {enlargedPhoto + 1} / {images.length}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
