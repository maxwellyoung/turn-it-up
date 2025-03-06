"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h1 className="text-6xl md:text-8xl font-pantasia mb-4">Oops!</h1>
        <h2 className="text-2xl md:text-4xl font-pantasia mb-8">
          Something went wrong
        </h2>
        <p className="text-gray-400 mb-8 max-w-md mx-auto">
          We're sorry, but something unexpected happened. Please try again.
        </p>
        <button
          onClick={reset}
          className="inline-block bg-white text-black px-6 py-3 rounded-full font-pantasia hover:bg-gray-200 transition-colors"
        >
          Try Again
        </button>
      </motion.div>
    </div>
  );
}
