"use client"

import { useEffect, useRef, useState } from "react"
import { UserButton, useUser } from "@clerk/nextjs"
import gsap from "gsap"
import { Terminal, AlertTriangle, Clock, Code, FileText, Database, User } from "lucide-react"
import Image from "next/image"
import { SoundToggle } from "@/components/SoundToggle"
import { useGlobalMusic } from "@/hooks/useGlobalMusic"
import { CodeEditor } from "@/components/CodeEditor"
import { VisitorCard } from "@/components/VisitorCard"
import { dark } from "@clerk/themes"


export default function GamePage() {
  const { user } = useUser()
  const [currentVisitor, setCurrentVisitor] = useState(0)
  const [gameTime, setGameTime] = useState(300) // 5 minutes in seconds
  const [score, setScore] = useState(0)
  const [consoleOutput, setConsoleOutput] = useState("")
  const [codeValue, setCodeValue] = useState("// Escribe tu consulta SQL aquí\n")
  const [decision, setDecision] = useState<"pending" | "approved" | "rejected">("pending")
  const [showFeedback, setShowFeedback] = useState(false)

  const headerRef = useRef<HTMLDivElement>(null)
  const visitorAreaRef = useRef<HTMLDivElement>(null)
  const consoleAreaRef = useRef<HTMLDivElement>(null)
  const airportRef = useRef<HTMLDivElement>(null)

  useGlobalMusic('/game.mp3', 0.05)

  // Initialize game
  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } })

    tl.fromTo(headerRef.current, { y: -50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 })

    tl.fromTo(airportRef.current, { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 1 })

    tl.fromTo(
      [visitorAreaRef.current, consoleAreaRef.current],
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.2, duration: 0.8 },
      "-=0.5",
    )

    // Game timer
    const timer = setInterval(() => {
      setGameTime((prev) => {
        if (prev <= 0) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      clearInterval(timer)
      tl.kill()
    }
  }, [])

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  
  return (
    <div className="flex flex-col h-screen bg-background text-foreground overflow-hidden">
      {/* Header with game info */}
      <div ref={headerRef} className="flex fixed z-20 w-full justify-between items-center p-4 opacity-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-purple" />
            <span className="font-mono text-lg">{formatTime(gameTime)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Database className="h-5 w-5 text-purple" />
            <span className="font-mono text-lg">{score} pts</span>
          </div>
        </div>

        <div className="flex items-center gap-5">
          <div className="flex text-right gap-5">
            <div className="flex flex-col justify-center place-items-center gap-">
            <p className="text-sm font-medium">{user?.firstName || "Guardia"}</p>
            <p className="text-xs text-foreground/60">Oficial de MiduGuard</p>
            <p>{user?.username}</p>
            </div>
            
            <UserButton 
              appearance={{
                baseTheme: dark
              }}
            />
          </div>

          <SoundToggle />
        </div>
      </div>

      {/* Airport visualization */}
      <div ref={airportRef} className="relative h-[40vh] border-b border-border overflow-hidden bg-blackLight/5 opacity-0">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-full h-full">
            <Image
              src="/airport.png"
              alt="Airport scene"
              layout="fill"
              objectFit="cover"
              className="opacity-80"
            />
          </div>
        </div>

        {/* Queue indicators */}
        <div className="absolute bottom-4 left-4 bg-blackLight/70 backdrop-blur-sm p-2 rounded-lg border border-border">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-purple" />
          </div>
        </div>
      </div>

      {/* Game interface */}
      <div className="flex flex-1 overflow-hidden">
        {/* Visitor verification area */}
        <div ref={visitorAreaRef} className="w-1/2 border-r py-2 border-border flex flex-col h-full opacity-0">
          {/* Visitor card */}
         <VisitorCard />
        </div>

        {/* Code console area */}
        <div ref={consoleAreaRef} className="w-1/2 p-4 flex flex-col h-full opacity-0">
          <div className="flex-1 flex flex-col gap-4">
            {/* Code editor */}
            <div className="flex-1 border border-border rounded-lg overflow-hidden">
              <CodeEditor value={codeValue} onChange={setCodeValue} language="sql" />
            </div>
          </div>
        </div>
      </div>

      {/* Game status bar */}
      <div className="p-2 border-t border-border bg-blackLight/10 flex justify-between items-center">
        <div className="flex items-center gap-2 text-xs">
          <AlertTriangle className="h-4 w-4 text-yellow-500" />
          <span className="text-foreground/70">
            Recuerda: La seguridad de Midulandia depende de ti. Verifica cuidadosamente cada visitante.
          </span>
        </div>

        <div className="text-xs text-foreground/60 font-mono">MiduGuard v1.0</div>
      </div>
    </div>
  )
}
