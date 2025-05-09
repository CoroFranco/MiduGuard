"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import { Shield, Check, Loader2, X } from "lucide-react"
import gsap from "gsap"

export function LoadingScreen() {
  const [isVisible, setIsVisible] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)
  const shieldRef = useRef<HTMLDivElement>(null)

  // Aparecer inmediatamente y desaparecer después de 1 segundo
  useEffect(() => {
    // Animación de entrada instantánea
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

// Componente para cada paso de verificación
type StepStatus = "pending" | "loading" | "complete" | "error"

function StepItem({
  icon: Icon,
  text,
  status,
}: {
  icon: React.ElementType
  text: string
  status: StepStatus
}) {
  return (
    <div className="flex items-center">
      <div
        style={{
          backgroundColor:
            status === "pending" ? "var(--blackLight)" : status === "error" ? "#ef4444" : "var(--purple)",
          opacity: status === "pending" ? 0.2 : 1,
        }}
        className="w-8 h-8 rounded-full flex items-center justify-center mr-3"
      >
        {status === "loading" ? (
          <Loader2 className="h-4 w-4 text-white animate-spin" />
        ) : status === "complete" ? (
          <Check className="h-4 w-4 text-white" />
        ) : status === "error" ? (
          <X className="h-4 w-4 text-white" />
        ) : (
          <Icon className="h-4 w-4 text-white opacity-50" />
        )}
      </div>
      <div className="flex-1">
        <p
          style={{
            color: status === "pending" ? "var(--foreground)" : status === "error" ? "#ef4444" : "var(--foreground)",
            opacity: status === "pending" ? 0.4 : 1,
          }}
          className="text-sm font-medium"
        >
          {text}
        </p>
      </div>
      {status === "complete" && <Check style={{ color: "#10b981" }} className="h-4 w-4 ml-2" />}
      {status === "error" && <X style={{ color: "#ef4444" }} className="h-4 w-4 ml-2" />}
    </div>
  )
}
