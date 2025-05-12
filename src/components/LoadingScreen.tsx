"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import { Shield, Loader2} from "lucide-react"
import gsap from "gsap"

export function LoadingScreen() {
  const [isVisible, setIsVisible] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)
  const shieldRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (containerRef.current) {
      gsap.set(containerRef.current, { opacity: 1 })
    }

    if (shieldRef.current) {
      gsap.fromTo(
        shieldRef.current,
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.2, ease: "power2.out" },
      )
    }

      if (containerRef.current) {
        gsap.to(containerRef.current, {
          opacity: 0,
          duration: 0.2,
          onComplete: () => setIsVisible(false),
        })
      }

  }, [])

  if (!isVisible) return null

  return (
    <div
      ref={containerRef}
      style={{
        background: "var(--background)",
        color: "var(--foreground)",
      }}
      className="fixed inset-0 flex items-center justify-center z-50"
    >
      <div ref={shieldRef} className="relative">
        <div className="relative">
          <Shield style={{ color: "var(--purple)" }} className="h-16 w-16" />
          <div className="absolute inset-0 flex items-center justify-center" style={{ color: "white" }}>
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </div>
      </div>
    </div>
  )
}

