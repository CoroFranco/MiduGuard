"use client"

import { useRef, useLayoutEffect } from "react"

interface GameBackgroundProps {
  className?: string
}

export function GameBackground({ className = "" }: GameBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const animationRef = useRef<number | null>(null)
  const lastFrameTimeRef = useRef<number>(0)

  useLayoutEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    const gridSize = 80
    const lineWidth = 0.5
    const primaryColor = "rgba(147, 51, 234, 0.2)"
    const secondaryColor = "rgba(147, 51, 234, 0.1)"
    const scanLineColor = "rgba(147, 51, 234, 0.5)"

    const drawHexGrid = (time: number) => {
      const elapsed = time - lastFrameTimeRef.current
      const frameDelay = 300 // 1 frame per second (slow blinking)
      if (elapsed < frameDelay) {
        animationRef.current = requestAnimationFrame(drawHexGrid)
        return
      }
      lastFrameTimeRef.current = time

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, canvas.height)
        ctx.strokeStyle = secondaryColor
        ctx.lineWidth = lineWidth
        ctx.stroke()
      }

      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(canvas.width, y)
        ctx.strokeStyle = secondaryColor
        ctx.lineWidth = lineWidth
        ctx.stroke()
      }

      const intersections: { x: number; y: number }[] = []
      for (let x = 0; x < canvas.width; x += gridSize) {
        for (let y = 0; y < canvas.height; y += gridSize) {
          if (Math.random() < 0.015) {
            intersections.push({ x, y })
          }
        }
      }

      intersections.forEach(({ x, y }) => {
        drawHexagon(ctx, x, y, gridSize * 0.8, primaryColor)
      })

      // Very faint scanline
      const scanLineY = (canvas.height + 200) * ((Math.sin(time * 2) + 1))

      ctx.beginPath()
      ctx.moveTo(0, scanLineY)
      ctx.lineTo(canvas.width, scanLineY)
      ctx.strokeStyle = scanLineColor
      ctx.lineWidth = 0.3
      ctx.stroke()

      drawDigitalNoise(ctx, canvas.width, canvas.height)

      animationRef.current = requestAnimationFrame(drawHexGrid)
    }

    animationRef.current = requestAnimationFrame(drawHexGrid)

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className={`fixed top-0 left-0 w-full h-full -z-10 ${className}`}
    />
  )
}

function drawHexagon(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  color: string
): void {
  ctx.beginPath()
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i
    const pointX = x + size * Math.cos(angle)
    const pointY = y + size * Math.sin(angle)
    if (i === 0) {
      ctx.moveTo(pointX, pointY)
    } else {
      ctx.lineTo(pointX, pointY)
    }
  }
  ctx.closePath()
  ctx.strokeStyle = color
  ctx.lineWidth = 1.5
  ctx.stroke()
}

function drawDigitalNoise(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
): void {
  if (Math.random() < 0.05) {
    const glitchCount = Math.floor(Math.random() * 3) + 1
    for (let i = 0; i < glitchCount; i++) {
      const x = Math.random() * width
      const y = Math.random() * height
      const glitchWidth = Math.random() * 100 + 50
      const glitchHeight = Math.random() * 5 + 2

      ctx.fillStyle = `rgba(147, 51, 234, ${Math.random() * 0.5})`
      ctx.fillRect(x, y, glitchWidth, glitchHeight)
    }
  }
}
