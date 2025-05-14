"use client"

import { use, useEffect, useLayoutEffect, useRef, useState } from "react"
import { UserButton, useUser } from "@clerk/nextjs"
import gsap from "gsap"
import {  Clock, Database, BadgeInfo } from "lucide-react"
import Image from "next/image"
import { SoundToggle } from "@/components/SoundToggle"
import { useGlobalMusic } from "@/hooks/useGlobalMusic"
import { CodeEditor } from "@/components/CodeEditor"
import { VisitorCard } from "@/components/VisitorCard"
import { dark } from "@clerk/themes"
import { GameModal } from "@/components/GameModal"
import { Visitor } from "@/types/visitorType"
import { notFound } from "next/navigation"

const VALID_GAMES = ["1", "2", "3"]

function random() {
  const numeros = [...Array(10).keys()]
  const resultados: number[] = []
  while (numeros.length > 0) {
    const idx = Math.floor(Math.random() * numeros.length)
    resultados.push(numeros.splice(idx, 1)[0])
  }
  return resultados
}

export default function GamePage({ params }: { params: Promise<{ day: string }> }) {
  const { user } = useUser()
  const [gameTime, setGameTime] = useState(300)
  const [isModalOpen, setIsModalOpen] = useState({ tutorial: true, tables: false })
  const [visitorsList, setVisitorsList] = useState<Visitor[]>([])
  const [visitorIndex, setVisitorIndex] = useState(0)
  const [score, setScore] = useState(0)
  const { day } = use(params)

  const headerRef = useRef<HTMLDivElement>(null)
  const visitorAreaRef = useRef<HTMLDivElement>(null)
  const consoleAreaRef = useRef<HTMLDivElement>(null)
  const airportRef = useRef<HTMLDivElement>(null)

  if (!VALID_GAMES.includes(day)) {
    notFound()

    }


  useGlobalMusic("/game.mp3", 0.05)

  // Ejecuta SQL contra tu API interna
  const executeCode = async (sql: string) => {
    try {
      const res = await fetch("/api/db", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: sql }),
      })
      const json = await res.json()
      return json.rows || []
    } catch (err) {
      console.error("DB error:", err)
      return []
    }
  }

  // 1) Inicializar score = 0 una sola vez cuando tengamos user.id
  useEffect(() => {
    if (!user?.id) return

    const initScore = async () => {
      await executeCode(`
        INSERT INTO user_score (user_id, score)
        VALUES ('${user.id}', 1)
        ON CONFLICT (user_id) DO NOTHING;
      `)
    }
    initScore()
  }, [user?.id])

  useEffect(() => {
    const loadVisitors = async () => {
      const data = await executeCode(`SELECT * FROM data_game WHERE day = ${day}`)
      const orden = random()
      setVisitorsList(orden.map((i) => data[i]))
    }
    loadVisitors()
  }, [day])

  // 3) Manejar la decisión del jugador
  const handleDecision = async (decision: "aceptar" | "rechazar") => {
    const visitor = visitorsList[visitorIndex]
    if (!visitor || !user?.id) return

    const correct = visitor.decision_correcta.toLowerCase() === decision
    const delta = correct ? 10 : -5
    setScore((s) => s + delta)


    await executeCode(`
      UPDATE user_score
       SET score = score + ${delta}
     WHERE user_id = '${user.id}';
    `)

    setVisitorIndex((i) => i + 1)
  }

  // Animaciones GSAP
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

  // Cronómetro
  useEffect(() => {
    const tid = setInterval(() => {
      if (isModalOpen.tutorial || isModalOpen.tables) return
      setGameTime((t) => (t > 0 ? t - 1 : 0))
    }, 1000)
    return () => clearInterval(tid)
  }, [isModalOpen])

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60)
    const s = sec % 60
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`
  }

  const currentVisitor = visitorsList[visitorIndex]

  return (
    <div className="flex flex-col h-screen bg-background text-foreground overflow-hidden relative w-full">
      <GameModal
        isOpen={isModalOpen.tutorial}
        onClose={() => setIsModalOpen((p) => ({ ...p, tutorial: false }))}
        title="Tutorial"
        message="Lee bien los datos de cada visitante para tomar decisiones correctas."
      />
      <GameModal
        isOpen={isModalOpen.tables}
        onClose={() => setIsModalOpen((p) => ({ ...p, tables: false }))}
        title="Tablas"
        message="Aquí puedes consultar la estructura de datos."
      />

      <div className="absolute z-40 top-[20%] right-20 bg-white/50 rounded-2xl backdrop-blur-3xl flex justify-center items-center">
        <button
          className="w-20 h-20 flex justify-center items-end cursor-pointer"
          onClick={() => setIsModalOpen((p) => ({ ...p, tables: true }))}
        >
          <BadgeInfo className="w-14 h-14 text-purple-900 animate-bounce" />
        </button>
      </div>

      <div ref={headerRef} className="fixed z-20 w-full flex justify-between items-center p-4 opacity-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-purple" />
            <span className="font-mono text-lg">{formatTime(gameTime)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-purple" />
            <span className="font-mono text-lg">{score} pts</span>
          </div>
        </div>
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-3">
            <div className="flex flex-col text-right">
              <p className="text-sm font-medium">{user?.firstName || "Guardia"}</p>
              <p className="text-xs text-foreground/60">Oficial de MiduGuard</p>
              <p className="text-xs">{user?.username}</p>
            </div>
            <UserButton appearance={{ baseTheme: dark }} />
          </div>
          <SoundToggle />
        </div>
      </div>

      <div
        ref={airportRef}
        className="relative h-[40vh] border-b border-border overflow-hidden bg-blackLight/5 opacity-0"
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <Image src="/airport.png" alt="Airport" layout="fill" objectFit="cover" className="opacity-80" />
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div ref={visitorAreaRef} className="w-1/2 border-r border-border py-2 opacity-0">
          {currentVisitor && (
            <VisitorCard
              visitor={currentVisitor}
              onApprove={() => handleDecision("aceptar")}
              onReject={() => handleDecision("rechazar")}
            />
          )}
        </div>
        <div ref={consoleAreaRef} className="w-1/2 p-4 min-h-[300px] opacity-0">
          <CodeEditor />
        </div>
      </div>

     
    </div>
  )
}
