"use client"

import { Volume2, VolumeX } from "lucide-react"
import { useSoundStore } from "@/store/soundStore"

export function SoundToggle() {
  const { isSoundOn, toggleSound } = useSoundStore()

  return (
    <button
      onClick={toggleSound}
      className="hover:text-purple cursor-pointer flex items-center space-x-2 py-1 px-3 bg-paper-dark border border-document-gray text-document-gray rounded-sm hover:bg-opacity-20 transition-all duration-200"
      aria-label={isSoundOn ? "Desactivar sonido" : "Activar sonido"}
    >
      {isSoundOn ? (
        <>
          <Volume2 className="h-6 w-6 text-green-500" />
          <span className="text-md">Sonido activado</span>
        </>
      ) : (
        <>
          <VolumeX className="h-6 w-6 text-red-500" />
          <span className="text-md ">Sonido desactivado</span>
        </>
      )}
    </button>
  )
}
