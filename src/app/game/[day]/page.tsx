"use client"

import { use, useEffect, useRef, useState } from "react"
import { UserButton, useUser } from "@clerk/nextjs"
import gsap from "gsap"
import { Clock, Database, BadgeInfo } from "lucide-react"
import Image from "next/image"
import { SoundToggle } from "@/components/SoundToggle"
import { useGlobalMusic } from "@/hooks/useGlobalMusic"
import { CodeEditor } from "@/components/CodeEditor"
import { VisitorCard } from "@/components/VisitorCard"
import { dark } from "@clerk/themes"
import { GameModal } from "@/components/GameModal"
import { Visitor } from "@/types/visitorType"
import { notFound } from "next/navigation"
import { useRouter } from "next/navigation"
import { LoadingScreen } from "@/components/LoadingScreen"
import { DaySummary } from "@/components/DaySummary"
import WelcomeModal from "@/components/Welcome"
import Tables from "@/components/Tables"
import {driver} from "driver.js"
import "driver.js/dist/driver.css";

const VALID_GAMES = ["1", "2", "3", "4", "5"]
const INITIAL_GAME_TIME = 300

export default function GamePage({ params }: { params: Promise<{ day: string }> }) {
  const { user, isLoaded } = useUser()
  const [gameTime, setGameTime] = useState(INITIAL_GAME_TIME)
  const [isModalOpen, setIsModalOpen] = useState({ 
    tutorial: true, 
    tables: false, 
    timeUp: false,
    levelCompleted: false,
    gameCompleted: false,
    hasExecutedQuery: false,
    masContenido: false
  })
  const [visitorsList, setVisitorsList] = useState<Visitor[]>([])
  const [visitorIndex, setVisitorIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [userProgress, setUserProgress] = useState<number | null>(null)
  const [isLevelCompleted, setIsLevelCompleted] = useState(false)
  const [correctDecisions, setCorrectDecisions] = useState(0)
  const [wrongDecisions, setWrongDecisions] = useState(0)
  const [dayJustLoaded, setDayJustLoaded] = useState(true)
  const [hasExecutedQuery, setHasExecutedQuery] = useState(false)
  const router = useRouter()
  const { day } = use(params)
  const shouldRedirect = userProgress !== null && parseInt(day) !== userProgress

  const headerRef = useRef<HTMLDivElement>(null)
  const visitorAreaRef = useRef<HTMLDivElement>(null)
  const consoleAreaRef = useRef<HTMLDivElement>(null)
  const airportRef = useRef<HTMLDivElement>(null)
  const tablesButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!tablesButtonRef.current || isModalOpen.tutorial || !consoleAreaRef.current || !visitorAreaRef.current) return

    const driverObj = driver({
      showProgress: true,
      steps: [
        {
          element: tablesButtonRef.current,
          popover: {
            title: 'Mostrar tablas',
            description: 'Aquí puedes consultar las tablas que tienes disponible, cada dia podra cambiar, tambien se pausara el tiempo mientras estes aqui.',
            popoverClass: 'driverjs-theme'
          }
        },
        {
          element: consoleAreaRef.current,
          popover: {
            title: 'Consola',
            description: 'Aquí puedes escribir tu código SQL y ver a la derecha el resultado de la consulta.',
            popoverClass: 'driverjs-theme'
          }
        },
        {
          element: visitorAreaRef.current,
          popover: {
            title: 'Consola',
            description: 'Aquí puedes ver al Midulover que debes verificar. Tendrás varias secciones con datos de la persona, y a la derecha encontrarás un botón para abrir los sellos cuando estés seguro de tu decisión.',
            popoverClass: 'driverjs-theme'
          }
        }
      ]
    })

    driverObj.drive()
  }, [isModalOpen.tutorial])



  if (!VALID_GAMES.includes(day)) {
    notFound()
  }

  useGlobalMusic("/game.mp3", 0.05)
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

  const advanceToNextLevel = async () => {
    if (!user?.id || parseInt(day) >= 3) return
    const newProgress = parseInt(day) + 1
    await executeCode(`
      UPDATE user_score
      SET progress = ${newProgress}
      WHERE user_id = '${user.id}';
    `)
    
    localStorage.removeItem(`gameTime-${user.id}-day-${newProgress}`)
    localStorage.removeItem(`visitorIndex-${user.id}-day-${newProgress}`)
    localStorage.removeItem(`dayCompleted-${user.id}-day-${day}`)
    
    router.replace(`/game/${newProgress}`)
  }


  const saveGameState = () => {
    if (!user?.id || isLevelCompleted) return
    localStorage.setItem(`gameTime-${user.id}-day-${day}`, gameTime.toString())
    localStorage.setItem(`visitorIndex-${user.id}-day-${day}`, visitorIndex.toString())
  }

  const checkDayCompletion = () => {
    if (!user?.id) return false
    const completionStatus = localStorage.getItem(`dayCompleted-${user.id}-day-${day}`)
    return completionStatus === 'true'
  }

  const markDayAsCompleted = () => {
    if (!user?.id) return
    localStorage.setItem(`dayCompleted-${user.id}-day-${day}`, 'true')
  }

  useEffect(() => {
    if(!isLoaded) return
    if (!user?.id) {
      router.replace("/")
      return
    }
    const loadScore = async () => {
      const data = await executeCode(`
        SELECT score, progress, correctas, incorrectas
        FROM user_score WHERE user_id = '${user.id}'
      `)
      
      if (Array.isArray(data) && data.length > 0) {
        const progress = data[0]?.progress
        setUserProgress(progress)
        setScore(data[0].score)
        setCorrectDecisions(data[0].correctas || 0)
        setWrongDecisions(data[0].incorrectas || 0)
        
        const isDayCompleted = checkDayCompletion()
        
        if (isDayCompleted) {
          setIsLevelCompleted(true)
          setTimeout(() => {
            setIsModalOpen(prev => ({ 
              ...prev, 
              levelCompleted: parseInt(day) < 3,
              gameCompleted: parseInt(day) >= 3
            }))
          }, 500)
          setGameTime(0)
        } else {
          // Load saved timer and visitor index from localStorage
          const savedTime = localStorage.getItem(`gameTime-${user.id}-day-${day}`)
          if (savedTime !== null) {
            setGameTime(parseInt(savedTime))
          } else {
            setGameTime(INITIAL_GAME_TIME)
          }
          
          const savedVisitorIndex = localStorage.getItem(`visitorIndex-${user.id}-day-${day}`)
          if (savedVisitorIndex !== null) {
            setVisitorIndex(parseInt(savedVisitorIndex))
          }
        }
        
        if (progress !== parseInt(day)) {
          router.replace(`/game/${progress}`)
        }
      } else {
        await initScore()
        setUserProgress(1)
        if (day !== "1") {
          router.replace("/game/1")
        }
      }
      setDayJustLoaded(false)
    }

    loadScore()
  }, [user?.id, isLoaded, day, router])

  const initScore = async () => {
    await executeCode(`
      INSERT INTO user_score (user_id, score, progress, correctas, incorrectas, username)
      VALUES ('${user?.id}', 0, 1, 0, 0, '${user?.username}')
      ON CONFLICT (user_id) DO NOTHING;
    `)
  }

  useEffect(() => {
    if (userProgress !== null && parseInt(day) === userProgress) {
      const loadVisitors = async () => {
        const data = await executeCode(`SELECT * FROM data_game WHERE day = ${day}`)
        const orderKey = `visitorOrder-${user?.id}-day-${day}`
        let orden
        
        const savedOrder = localStorage.getItem(orderKey)
        if (savedOrder) {
          orden = JSON.parse(savedOrder)
        } else {
          orden = [7,0,2,3,4,5,6,1,8,9]
          localStorage.setItem(orderKey, JSON.stringify(orden))
        }
        
        setVisitorsList(orden.map((i:number) => data[i]))
      }
      loadVisitors()
    }
  }, [day, userProgress, user?.id])


  const handleDecision = async (decision: "aceptar" | "rechazar" ) => {
  const visitor = visitorsList[visitorIndex]
  if (!visitor || !user?.id) return false
  
  if (!hasExecutedQuery) {
    setIsModalOpen(prev => ({ ...prev, hasExecutedQuery: true }))
    return false
  }
  if(visitorIndex === 4){
    setIsModalOpen(prev => ({...prev, masContenido:true}))
  }
  const correct = visitor.decision_correcta.toLowerCase() === decision
  const delta = correct ? 10 : -5
  
  if (correct) {
    setCorrectDecisions(prev => prev + 1)
    await executeCode(`
      UPDATE user_score
      SET correctas = correctas + 1
      WHERE user_id = '${user.id}';
    `)
  } else {
    setWrongDecisions(prev => prev + 1)
    await executeCode(`
      UPDATE user_score
      SET incorrectas = incorrectas + 1
      WHERE user_id = '${user.id}';
    `)
  }
  
  setHasExecutedQuery(false)
  
  setScore((s) => s + delta)

  await executeCode(`
    UPDATE user_score
    SET score = score + ${delta}
    WHERE user_id = '${user.id}';
  `)

  if (visitorIndex === visitorsList.length - 1) {
    setIsLevelCompleted(true)
    markDayAsCompleted()
    
    if (parseInt(day) < 3) {
      setIsModalOpen(prev => ({ ...prev, levelCompleted: true }))
    } else {
      setIsModalOpen(prev => ({ ...prev, gameCompleted: true }))
    }
  } else {
    setVisitorIndex((i) => i + 1)
    localStorage.setItem(`visitorIndex-${user.id}-day-${day}`, (visitorIndex + 1).toString())
  }
  
  return true // Retornar true para indicar que la decisión se procesó correctamente
}

  // Animaciones GSAP
  useEffect(() => {
    if (!user || userProgress === null || !isLoaded || shouldRedirect) return
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } })
    tl.fromTo(headerRef.current, { y: -50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 })
    tl.fromTo(airportRef.current, { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 1 })
    tl.fromTo(
      [visitorAreaRef.current, consoleAreaRef.current],
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.2, duration: 0.8 },
      "-=0.5"
    )
  
    return () => {
      tl.kill()
    }
  }, [user, userProgress])

  useEffect(() => {
    if (!user?.id || userProgress === null || isLevelCompleted) return
    
    const saveInterval = setInterval(() => {
      saveGameState()
    }, 5000)
    
    return () => clearInterval(saveInterval)
  }, [user?.id, userProgress, gameTime, visitorIndex, isLevelCompleted, day])

  useEffect(() => {
    if (isLevelCompleted || dayJustLoaded) return

    const tid = setInterval(() => {
      if (isModalOpen.tutorial || isModalOpen.tables) return
      
      setGameTime((t) => {
        if (t <= 1) {
          clearInterval(tid)
          setIsModalOpen(prev => ({ ...prev, timeUp: true }))
          setIsLevelCompleted(true)
          markDayAsCompleted()
          return 0
        }
        return t - 1
      })
    }, 1000)
    
    return () => clearInterval(tid)
  }, [isModalOpen, isLevelCompleted, dayJustLoaded])

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (user?.id && !isLevelCompleted) {
        saveGameState()
      }
    }
    
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [user?.id, gameTime, visitorIndex, isLevelCompleted, day])

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60)
    const s = sec % 60
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`
  }

  const currentVisitor = visitorsList[visitorIndex]

  if (!isLoaded || !user || userProgress === null || shouldRedirect) {
    return <LoadingScreen />
  }

  const handleTimeUpContinue = () => {
    setIsModalOpen(prev => ({ ...prev, timeUp: false }))
    if (parseInt(day) < 3) {
      advanceToNextLevel()
    }
  }

  const handleLevelCompletedContinue = () => {
    setIsModalOpen(prev => ({ ...prev, levelCompleted: false }))
    if (parseInt(day) < 3) {
      advanceToNextLevel()
    }
  }

  const TimeUpContent = (
    <DaySummary
      day={parseInt(day)}
      score={score}
      correctDecisions={correctDecisions}
      wrongDecisions={wrongDecisions}
      timeLeft={0}
      onContinue={handleTimeUpContinue}
    />
  )

  const LevelCompletedContent = (
    <DaySummary
      day={parseInt(day)}
      score={score}
      correctDecisions={correctDecisions}
      wrongDecisions={wrongDecisions}
      timeLeft={gameTime}
      onContinue={handleLevelCompletedContinue}
    />
  )

  return (
    <div className="flex flex-col h-screen bg-background text-foreground overflow-hidden relative w-full">
      <GameModal
        isOpen={isModalOpen.masContenido}
        onClose={() => setIsModalOpen((p) => ({ ...p, masContenido: false }))}
        title={'Contenido'}
        message="recuerda que hay mas tablas, vas a tener que usarlas"
      />
      <GameModal
        isOpen={isModalOpen.tutorial && !isLevelCompleted}
        onClose={() => setIsModalOpen((p) => ({ ...p, tutorial: false }))}
        title={`Día ${day}`}
        content={<WelcomeModal />}
      />
      <GameModal
        isOpen={isModalOpen.tables}
        onClose={() => setIsModalOpen((p) => ({ ...p, tables: false }))}
        title="Tablas"
        content={<Tables />}
      />
      <GameModal
        isOpen={isModalOpen.timeUp || false}
        onClose={handleTimeUpContinue}
        title="¡Tiempo agotado!"
        type="success"
        content={TimeUpContent}
      />
      <GameModal
        isOpen={isModalOpen.levelCompleted || false}
        onClose={handleLevelCompletedContinue}
        title="¡Nivel completado!"
        type="success"
        content={LevelCompletedContent}
      />
      <GameModal
        isOpen={isModalOpen.gameCompleted || false}
        onClose={() => setIsModalOpen((p) => ({ ...p, gameCompleted: false }))}
        title="¡Juego completado!"
        message={`¡Felicidades! Has completado todos los días del juego con una puntuación total de ${score} puntos. Tomaste ${correctDecisions} decisiones correctas y ${wrongDecisions} incorrectas.`}
        type="success"
      />
      <GameModal
        isOpen={isModalOpen.hasExecutedQuery || false}
        onClose={() => setIsModalOpen((p) => ({ ...p, hasExecutedQuery: false }))}
        title="Error"
        message={`¿Cómo puedes decidir sin consultar la base de datos? ¿Acaso estás conspirando contra Midu?`}
        type="error"
      />

      <div className="absolute z-40 top-[20%] right-20 bg-white/50 rounded-2xl backdrop-blur-3xl flex justify-center items-center">
        <button
        ref={tablesButtonRef}
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
            <span className={`font-mono text-lg ${gameTime < 60 ? 'text-red-500' : ''}`}>{formatTime(gameTime)}</span>
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
          {currentVisitor && !isLevelCompleted && gameTime > 0 && (
            <VisitorCard
              visitor={currentVisitor}
              onApprove={() => handleDecision("aceptar")}
              onReject={() => handleDecision("rechazar")}
            />
          )}
          {(!currentVisitor || isLevelCompleted || gameTime === 0) && (
            <div className="flex items-center justify-center h-full">
              <p className="text-xl text-gray-400">
                {gameTime === 0 ? "Tiempo agotado" : "No hay más visitantes por hoy"}
              </p>
            </div>
          )}
        </div>
        <div ref={consoleAreaRef} className="w-1/2 p-4 min-h-[300px] opacity-0">
          <CodeEditor onQueryExecuted={(wasExecuted) => {
              if (wasExecuted) {
                setHasExecutedQuery(true)
              }
            }} />
        </div>
      </div>
    </div>
  )
}
