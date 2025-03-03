"use client"

import { useEffect, useRef } from "react"

export default function VideoGlitch() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const setCanvasDimensions = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    setCanvasDimensions()
    window.addEventListener("resize", setCanvasDimensions)

    // Create noise pattern
    const createNoise = () => {
      const imageData = ctx.createImageData(canvas.width, canvas.height)
      const data = imageData.data

      for (let i = 0; i < data.length; i += 4) {
        const value = Math.random() * 255

        data[i] = value * 0.2 // R
        data[i + 1] = value * 0.8 // G (green tint)
        data[i + 2] = value * 0.2 // B
        data[i + 3] = 15 // Alpha (mostly transparent)
      }

      return imageData
    }

    // Create horizontal scan lines
    const createScanLines = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.2)"

      for (let i = 0; i < canvas.height; i += 2) {
        ctx.fillRect(0, i, canvas.width, 1)
      }
    }

    // Create VHS tracking effect
    const createTrackingEffect = (time: number) => {
      const height = Math.sin(time / 1000) * 10 + 10
      const y = (Math.sin(time / 500) * canvas.height) / 3 + canvas.height / 2

      ctx.fillStyle = "rgba(30, 255, 30, 0.1)"
      ctx.fillRect(0, y, canvas.width, height)
    }

    // Create glitch effect
    const createGlitch = (time: number) => {
      if (Math.random() > 0.96) {
        const x = Math.random() * canvas.width
        const y = Math.random() * canvas.height
        const width = Math.random() * 100 + 100
        const height = Math.random() * 5 + 2

        ctx.fillStyle = "rgba(30, 255, 30, 0.5)"
        ctx.fillRect(x, y, width, height)
      }

      if (Math.random() > 0.98) {
        ctx.fillStyle = "rgba(30, 255, 30, 0.9)"
        ctx.fillRect(0, Math.random() * canvas.height, canvas.width, 1)
      }
    }

    // Animation loop
    let animationId: number
    const animate = (time: number) => {
      // Clear canvas
      ctx.fillStyle = "rgba(0, 0, 0, 0.1)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw noise
      if (Math.random() > 0.5) {
        ctx.putImageData(createNoise(), 0, 0)
      }

      // Draw scan lines
      createScanLines()

      // Draw tracking effect
      createTrackingEffect(time)

      // Draw glitch effect
      createGlitch(time)

      // Continue animation
      animationId = requestAnimationFrame(animate)
    }

    // Start animation
    animationId = requestAnimationFrame(animate)

    // Cleanup
    return () => {
      window.removeEventListener("resize", setCanvasDimensions)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 z-0 bg-black opacity-80" />
}

