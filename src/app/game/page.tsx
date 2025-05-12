"use client"

import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { UserButton, useUser } from "@clerk/nextjs"
import gsap from "gsap"
import {  AlertTriangle, Clock, Database, User, BadgeInfo } from "lucide-react"
import Image from "next/image"
import { SoundToggle } from "@/components/SoundToggle"
import { useGlobalMusic } from "@/hooks/useGlobalMusic"
import { CodeEditor } from "@/components/CodeEditor"
import { VisitorCard } from "@/components/VisitorCard"
import { dark } from "@clerk/themes"
import { GameModal } from "@/components/GameModal"


function random() {
  const numeros = [...Array(10).keys()];
  const resultados = [];

  while (numeros.length > 0) {
    const indiceAleatorio = Math.floor(Math.random() * numeros.length);
    const numero = numeros.splice(indiceAleatorio, 1)[0];  // Saca el número aleatorio
    resultados.push(numero);
  }

  return resultados;
}

export default function GamePage() {
  const { user } = useUser()
  const [gameTime, setGameTime] = useState(300) // 5 minutes in seconds
  const [isModalOpen, setIsModalOpen] = useState({tutorial:true, tables: false})
  const [currentVisitor, setCurrentVisitor] = useState(null) 


  const headerRef = useRef<HTMLDivElement>(null)
  const visitorAreaRef = useRef<HTMLDivElement>(null)
  const consoleAreaRef = useRef<HTMLDivElement>(null)
  const airportRef = useRef<HTMLDivElement>(null)

  useGlobalMusic('/game.mp3', 0.05)

  const executeCode = async (): void => {
    try {
      const res = await fetch('/api/db', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content: 'SELECT * FROM midulovers' })
      })

      const data = await res.json()
      if (data?.rows?.[0]) {
        setCurrentVisitor(data?.rows)
      } else {

      }
    } catch (error) {
      console.error('error' + error)
    }
  }

  useEffect(() => {
    executeCode()
  }, [])

  // Initialize game
  useLayoutEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } })

    tl.fromTo(headerRef.current, { y: -50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 })

    tl.fromTo(airportRef.current, { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 1 })

    tl.fromTo(
      [visitorAreaRef.current, consoleAreaRef.current],
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.2, duration: 0.8 },
      "-=0.5",
    )
    return () => {
      tl.kill()
    }
  }, [])

  useEffect(() => {
const timer = setInterval(() => {
      if(isModalOpen.tables || isModalOpen.tutorial) return
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
    }
  }, [isModalOpen])

  // Format time as MM:SS
  const formatTime = (seconds: number) => {

    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  
  return (
    <div className="flex flex-col h-screen bg-background text-foreground overflow-hidden relative w-full">
      {/* Header with game info */}
      <GameModal isOpen={isModalOpen.tutorial} onClose={() => setIsModalOpen(prev => ({...prev, tutorial: false}))} title='titulo' message='mensaje' />
        <GameModal isOpen={isModalOpen.tables} onClose={() => setIsModalOpen(prev => ({...prev, tables: false}))} title='Tablas' message='mensaje' />
      <div className="absolute z-40 top-[20%] right-20 bg-white/50 rounded-2xl backdrop:backdrop-blur-3xl flex justify-center place-items-center " >
          <button className="flex justify-center place-items-end w-20 h-20 cursor-pointer" onClick={() => setIsModalOpen(prev => ({...prev, tables: true}))}>
            <BadgeInfo className="w-14 h-14 text-purple-900 animate-bounce"/>
          </button>
        </div>
      <div ref={headerRef} className="flex fixed z-20 w-full justify-between items-center p-4 opacity-0">

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-purple" />
            <span className="font-mono text-lg">{formatTime(gameTime)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Database className="h-5 w-5 text-purple" />
            <span className="font-mono text-lg">0 pts</span>
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
          {currentVisitor && 
         <VisitorCard  visitor={currentVisitor[1]}/>
          }
        </div>

        {/* Code console area */}
        <div ref={consoleAreaRef} className="w-1/2 p-4 flex flex-col h-full opacity-0">
          <div className="flex-1 flex flex-col gap-4">
            {/* Code editor */}
            <div className="flex-1 border border-border rounded-lg overflow-hidden">
              <CodeEditor />
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
