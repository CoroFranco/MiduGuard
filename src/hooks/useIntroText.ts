import { useEffect, useRef, useState } from "react"
import gsap from "gsap"
import { TextPlugin } from "gsap/TextPlugin"
import { useSoundStore } from "@/store/soundStore"
import { useUser } from "@clerk/nextjs"


if (typeof window !== "undefined") {
  gsap.registerPlugin(TextPlugin)
}

export function useIntroText(introTexts: string[]) {
  const { isSoundOn } = useSoundStore()
  const textRef = useRef(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const {isLoaded} = useUser()

  const [introStep, setIntroStep] = useState(0)
  const [introCompleted, setIntroCompleted] = useState(false)

  // Inicializar audio solo una vez
  useEffect(() => {
    if (typeof window === "undefined") return

    if (!audioRef.current) {
      audioRef.current = new Audio("/textType.mp3")
      audioRef.current.volume = 0.3
    }
  }, [isSoundOn])

  // Control de animación del texto
  useEffect(() => {
    if(!isLoaded) return
    if (introStep < introTexts.length) {
      const tl = gsap.timeline({
        onComplete: () => {
          if (intervalRef.current) {
            clearInterval(intervalRef.current)
          }
          if (audioRef.current) {
            audioRef.current.pause()
            audioRef.current.currentTime = 0
          }
          setTimeout(() => {
            setIntroStep((prev) => prev + 1)
          }, 2000)
        },
      })

      tl.set(textRef.current, { text: "" })
      tl.to(textRef.current, {
        duration: 3,
        text: introTexts[introStep],
        ease: "none",
      })

      return () => {
        tl.kill()
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
        }
        if (audioRef.current) {
          audioRef.current.pause()
          audioRef.current.currentTime = 0
        }
      }
    } else if (introStep === introTexts.length && !introCompleted) {
      setIntroCompleted(true)
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
      }
      localStorage.setItem("seenIntro", "true")
    }
  }, [introStep, introTexts, introCompleted, isLoaded])

  useEffect(() => {
    if (!audioRef.current || introCompleted || !isSoundOn) return
  
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
  
    if (!document.hidden && introStep < introTexts.length) {
      intervalRef.current = setInterval(() => {
        if (!document.hidden && audioRef.current) {
          audioRef.current.currentTime = 0
          audioRef.current.play().catch(() => {})
        }
      }, 180)
    }
  
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
      }
    }
  }, [isSoundOn, introStep, introCompleted, introTexts.length])

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && audioRef.current) {
        audioRef.current.pause()
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [])

  return { textRef, introCompleted }
}
