"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h1 className="text-6xl md:text-8xl font-pantasia mb-4">404</h1>
        <h2 className="text-2xl md:text-4xl font-pantasia mb-8">
          Page Not Found
        </h2>
        <p className="text-gray-400 mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-block bg-white text-black px-6 py-3 rounded-full font-pantasia hover:bg-gray-200 transition-colors"
        >
          Return Home
        </Link>
      </motion.div>
    </div>
  );
}
