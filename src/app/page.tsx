"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Play, ExternalLink, X, ChevronDown, ChevronUp } from "lucide-react";
import QuestionTrail from "@/components/QuestionTrail";
import SpotlightOverlay from "@/components/SpotlightOverlay";

export default function Home() {
  const [enlargedPhoto, setEnlargedPhoto] = useState<number | null>(null);
  const [showLyrics, setShowLyrics] = useState(false);
  const [trailPosition, setTrailPosition] = useState({ x: 0, y: 0 });
  const [showTrail, setShowTrail] = useState(false);
  const [isTextAnimating, setIsTextAnimating] = useState(false);

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
    "/photos/1.jpeg",
    "/photos/2.jpeg",
    "/photos/3.jpeg",
    "/photos/4.jpeg",
    "/photos/5.jpeg",
    "/photos/6.jpeg",
    "/photos/7.jpeg",
  ];

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
            <div>2025.03.03</div>
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
          <button className="bg-[#8DB187] text-black px-4 py-2 md:px-3 md:py-1 flex items-center hover:bg-[#94B38D] transition-colors">
            <Play size={12} className="mr-2 md:mr-1" /> Listen Now
          </button>
          <button className="border-2 md:border border-[#8DB187] text-[#8DB187] px-4 py-2 md:px-3 md:py-1 flex items-center hover:bg-[#8DB187]/10 transition-colors">
            <ExternalLink size={12} className="mr-2 md:mr-1" /> Full Release
          </button>
        </div>

        {/* Photo Strip */}
        <div className="col-span-4 md:col-span-8 row-span-1 bg-white overflow-hidden">
          <div className="w-full h-full overflow-x-auto overflow-y-hidden scrollbar-thin scrollbar-track-white scrollbar-thumb-zinc-200 scroll-smooth">
            <div className="flex gap-2 md:gap-px p-2 md:p-0 min-w-fit">
              {images.map((src, index) => (
                <div
                  key={index}
                  className="w-[150px] md:w-[200px] relative aspect-square filter hover:brightness-125 transition-all duration-300 cursor-pointer bg-white rounded-sm md:rounded-none"
                  onClick={() => setEnlargedPhoto(index)}
                >
                  <Image
                    src={src}
                    alt={`Image ${index + 1}`}
                    fill
                    className="object-cover opacity-80 hover:opacity-100 transition-opacity rounded-sm md:rounded-none"
                  />
                </div>
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
              src="/turnitup.mp4"
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

      {/* Enlarged Photo Modal */}
      {enlargedPhoto !== null && (
        <div
          className="fixed inset-0 bg-white/90 z-50 flex items-center justify-center"
          onClick={() => setEnlargedPhoto(null)}
        >
          <button
            className="absolute top-4 right-4 text-zinc-900 hover:text-[#8DB187] p-2"
            onClick={() => setEnlargedPhoto(null)}
          >
            <X size={24} />
          </button>
          <div className="relative w-[90vw] md:w-[80vw] h-[80vh]">
            <Image
              src={images[enlargedPhoto]}
              alt={`Enlarged image ${enlargedPhoto + 1}`}
              fill
              className="object-contain"
            />
          </div>
        </div>
      )}
    </main>
  );
}
