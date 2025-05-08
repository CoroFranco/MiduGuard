"use client"

import { useEffect, useRef } from "react"
import { useSoundStore } from "@/store/soundStore"

export function useGlobalMusic(songRoute:string, volume:number) {
  const { isSoundOn } = useSoundStore()
  const musicRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    if (!musicRef.current) {
      musicRef.current = new Audio(songRoute)
      musicRef.current.loop = true
      musicRef.current.volume = volume
    }

    if (isSoundOn) {
      musicRef.current?.play().catch(() => {})
    } else {
      musicRef.current?.pause()
    }

    return () => {
      musicRef.current?.pause()
    }
  }, [isSoundOn, songRoute, volume])
}
