"use client"

import { useEffect, useRef, useState } from "react"
import { UserButton, useUser } from "@clerk/nextjs"
import gsap from "gsap"
import { Clock, Trophy, Medal, Crown, Star, Zap, Database } from "lucide-react"
import Image from "next/image"
import { useGlobalMusic } from "@/hooks/useGlobalMusic"
import { dark } from "@clerk/themes"
import { useRouter } from "next/navigation"

interface LeaderboardEntry {
  rank: number
  username: string
  score: number
  correctas: number
  incorrectas: number
  efficiency: number
}

export default function LeaderboardPage() {
  const { user, isLoaded } = useUser()
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [userRank, setUserRank] = useState<number | null>(null)
  const [userStats, setUserStats] = useState<LeaderboardEntry | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isResetting, setIsResetting] = useState(false)
  const router = useRouter()

  const headerRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  const leaderboardRef = useRef<HTMLDivElement>(null)
  const userCardRef = useRef<HTMLDivElement>(null)
  const comingSoonRef = useRef<HTMLDivElement>(null)

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

  const resetPlayerData = async () => {
    if (!user?.id || isResetting) return

    setIsResetting(true)

    try {
      await executeCode(`
        UPDATE user_score 
        SET score = 0, progress = 1, correctas = 0, incorrectas = 0 
        WHERE user_id = '${user.id}';
      `)

      const keysToRemove = []
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (
          key &&
          (key.includes(`gameTime-${user.id}`) ||
            key.includes(`visitorIndex-${user.id}`) ||
            key.includes(`dayCompleted-${user.id}`) ||
            key.includes(`visitorOrder-${user.id}`))
        ) {
          keysToRemove.push(key)
        }
      }

      keysToRemove.forEach((key) => localStorage.removeItem(key))

      router.replace("/game/1")
    } catch (error) {
      console.error("Error resetting player data:", error)
    } finally {
      setIsResetting(false)
    }
  }

  useEffect(() => {
    if (!isLoaded || !user?.id) return

    const loadLeaderboard = async () => {
      try {
        const data = await executeCode(`
          SELECT
            username,
            score,
            correctas,
            incorrectas,
            CASE
              WHEN (correctas + incorrectas) > 0
              THEN ROUND((CAST(correctas AS REAL) / (correctas + incorrectas)) * 100, 1)
              ELSE 0
            END AS efficiency,
            RANK() OVER (ORDER BY score DESC) AS rank
          FROM user_score
          WHERE progress >= 2
          ORDER BY score DESC
          LIMIT 10;

        `)

        const leaderboardData = data.map((entry: any, index: number) => ({
          rank: index + 1,
          username: entry.username || "Anónimo",
          score: entry.score || 0,
          correctas: entry.correctas || 0,
          incorrectas: entry.incorrectas || 0,
          efficiency: entry.efficiency || 0,
        }))

        setLeaderboard(leaderboardData)

        const userRankData = await executeCode(`
          SELECT 
            username,
            score,
            correctas,
            incorrectas,
            CASE 
              WHEN (correctas + incorrectas) > 0 
              THEN ROUND((CAST(correctas AS REAL) / (correctas + incorrectas)) * 100, 1)
              ELSE 0 
            END AS efficiency,
            RANK() OVER (ORDER BY score DESC) AS rank
          FROM user_score
          WHERE user_id = '${user.id}'
            AND progress >= 2;
        `)

        if (userRankData.length > 0) {
          const userData = userRankData[0]
          setUserRank(userData.rank)
          setUserStats({
            rank: userData.rank,
            username: userData.username || user.username || "Anónimo",
            score: userData.score || 0,
            correctas: userData.correctas || 0,
            incorrectas: userData.incorrectas || 0,
            efficiency: userData.efficiency || 0,
          })
        }
      } catch (error) {
        console.error("Error loading leaderboard:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadLeaderboard()
  }, [user?.id, isLoaded, user?.username])

  useEffect(() => {
    if (!isLoaded || isLoading) return

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } })

    tl.fromTo(headerRef.current, { y: -50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 })
    tl.fromTo(titleRef.current, { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 1 }, "-=0.5")
    tl.fromTo(leaderboardRef.current, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, "-=0.3")
    tl.fromTo(userCardRef.current, { x: -50, opacity: 0 }, { x: 0, opacity: 1, duration: 0.8 }, "-=0.3")
    tl.fromTo(comingSoonRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, "-=0.2")

    return () => {
      tl.kill()
    }
  }, [isLoaded, isLoading])

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-gray-300" />
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />
      case 3:
        return <Medal className="w-6 h-6 text-gray-500" />
      default:
        return <span className="text-lg font-bold text-gray-400">#{rank}</span>
    }
  }

  const getRowBackground = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-white/10 border-white/30 shadow-[0_0_15px_rgba(255,255,255,0.1)]"
      case 2:
        return "bg-white/8 border-white/25"
      case 3:
        return "bg-white/6 border-white/20"
      default:
        return "bg-white/5 border-white/15 hover:bg-white/8 transition-all duration-300"
    }
  }

  if (!isLoaded || !user) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#121212]">
        <div className="text-xl text-gray-300 flex items-center gap-3">
          <Zap className="w-6 h-6 text-gray-400 animate-spin" />
          Cargando...
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#121212] text-gray-200 overflow-x-hidden relative">
      <div className="fixed inset-0 z-0">
        <Image src="/airport.png" alt="Airport Background" layout="fill" objectFit="cover" className="opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-[#121212]/90 to-[#121212]"></div>

        <div className="stars absolute inset-0 overflow-hidden">
          {Array.from({ length: 15 }).map((_, i) => (
            <div
              key={i}
              className="star absolute rounded-full bg-white"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                width: `${Math.random() * 2 + 1}px`,
                height: `${Math.random() * 2 + 1}px`,
                opacity: Math.random() * 0.4 + 0.1,
                animation: `twinkle ${Math.random() * 5 + 3}s infinite ${Math.random() * 5}s`,
              }}
            />
          ))}
        </div>
      </div>

      <div
        ref={headerRef}
        className="fixed z-20 w-full flex justify-between items-center p-4 opacity-0 backdrop-blur-md bg-black/30 px-20"
      >
        <div className="flex items-center gap-4">
          <button
            onClick={resetPlayerData}
            disabled={isResetting}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm rounded-lg border border-white/20 hover:bg-white/10 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isResetting ? (
              <>
                <Zap className="w-5 h-5 animate-spin" />
                <span>Reiniciando...</span>
              </>
            ) : (
              <>
                <Star className="w-5 h-5 text-gray-300" />
                <span className="font-medium">Volver a Jugar</span>
              </>
            )}
          </button>
        </div>

        <div className="flex items-center gap-5">
          <div className="flex items-center gap-3">
            <div className="flex flex-col text-right">
              <p className="text-sm font-medium text-white">{user?.firstName || "Guardia"}</p>
              <p className="text-xs text-gray-400">Oficial de MiduGuard</p>
              <p className="text-xs text-gray-500">{user?.username}</p>
              <p className="hidden">{userRank}</p>
            </div>
            <div className="ring-2 ring-white/20 rounded-full p-0.5">
              <UserButton appearance={{ baseTheme: dark }} />
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 pt-24 pb-16 px-4">
        <div ref={titleRef} className="text-center mb-12 opacity-0">
          <div className="flex items-center justify-center gap-4 mb-6">
            <Trophy className="w-14 h-14 text-gray-400 animate-pulse" />
            <h1 className="text-6xl font-extrabold text-white">LEADERBOARD</h1>
            <Trophy className="w-14 h-14 text-gray-400 animate-pulse" />
          </div>
          <p className="text-xl text-gray-400 font-medium">Los mejores oficiales de MiduGuard</p>
          <div className="w-32 h-1 bg-gradient-to-r from-transparent via-gray-500 to-transparent rounded-full mx-auto mt-4"></div>
        </div>

        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">
          <div ref={leaderboardRef} className="lg:w-2/3 opacity-0">
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 shadow-[0_0_25px_rgba(0,0,0,0.2)]">
              <h2 className="text-2xl font-bold text-center mb-8 flex items-center justify-center gap-3 text-white">
                <Star className="w-6 h-6 text-gray-400" />
                Top 10 Oficiales
                <Star className="w-6 h-6 text-gray-400" />
              </h2>

              {isLoading ? (
                <div className="text-center py-12">
                  <Zap className="w-10 h-10 animate-spin mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-400 animate-pulse">Cargando clasificaciones...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {leaderboard.map((entry, index) => (
                    <div
                      key={entry.rank}
                      className={`flex items-center gap-4 p-4 rounded-xl border ${getRowBackground(entry.rank)}`}
                      style={{
                        animation: `fadeIn 0.5s ease-out ${index * 0.1}s both`,
                      }}
                    >
                      <div className="flex items-center justify-center w-12 h-12 bg-black/20 rounded-full">
                        {getRankIcon(entry.rank)}
                      </div>

                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-lg text-white">{entry.username}</span>
                          <span className="text-2xl font-bold text-white">{entry.score} pts</span>
                        </div>
                        <div className="flex gap-4 text-sm text-gray-400 mt-1">
                          <span className="flex items-center gap-1">
                            <span>✅</span> {entry.correctas}
                          </span>
                          <span className="flex items-center gap-1">
                            <span>❌</span> {entry.incorrectas}
                          </span>
                          <span className="flex items-center gap-1">
                            <span>📊</span> {entry.efficiency}% eficiencia
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="lg:w-1/3 space-y-8">
            {userStats && (
              <div ref={userCardRef} className="opacity-0">
                <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/15 p-6 shadow-[0_0_25px_rgba(0,0,0,0.2)]">
                  <h3 className="text-xl font-bold text-center mb-5 flex items-center justify-center gap-2 text-white">
                    <Database className="w-5 h-5 text-gray-400" />
                    Tu Rendimiento
                  </h3>

                  <div className="text-center space-y-4">
                    <div className="flex items-center justify-center gap-3 bg-black/20 py-2 px-4 rounded-full w-fit mx-auto">
                      {getRankIcon(userStats.rank)}
                      <span className="text-lg font-medium text-white hidden">Posición #{userStats.rank}</span>
                    </div>

                    <div className="bg-white/5 rounded-lg p-5 border border-white/10">
                      <div className="text-4xl font-bold text-white mb-3">{userStats.score} pts</div>
                      <div className="grid grid-cols-2 gap-6 text-sm">
                        <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                          <div className="text-white font-bold text-xl">{userStats.correctas}</div>
                          <div className="text-gray-400">Correctas</div>
                        </div>
                        <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                          <div className="text-white font-bold text-xl">{userStats.incorrectas}</div>
                          <div className="text-gray-400">Incorrectas</div>
                        </div>
                      </div>
                      <div className="mt-5 pt-4 border-t border-white/10">
                        <div className="text-2xl font-bold text-white">{userStats.efficiency}%</div>
                        <div className="text-gray-400">Eficiencia</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={comingSoonRef} className="opacity-0">
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/15 p-6 shadow-[0_0_25px_rgba(0,0,0,0.2)]">
                <h3 className="text-xl font-bold text-center mb-5 flex items-center justify-center gap-2 text-white">
                  <Clock className="w-5 h-5 text-gray-400" />
                  Próximamente
                </h3>

                <div className="text-center space-y-5">
                  <div className="text-6xl mb-4 animate-bounce">🚀</div>
                  <h4 className="text-2xl font-bold text-white">DÍA 3</h4>
                  <p className="text-gray-400">
                    Nuevos desafíos están en camino. El aeropuerto de Midulandia necesita oficiales más experimentados.
                  </p>
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <p className="text-sm text-gray-300 font-medium">
                      🔒 Se desbloqueará pronto con nuevas características:
                    </p>
                    <div className="mt-3 space-y-2 text-sm text-left">
                      <p className="flex items-center gap-2 bg-white/5 p-2 rounded-md border border-white/5">
                        <span>🌟</span> Casos más complejos
                      </p>
                      <p className="flex items-center gap-2 bg-white/5 p-2 rounded-md border border-white/5">
                        <span>🎯</span> Nuevos tipos de visitantes
                      </p>
                      <p className="flex items-center gap-2 bg-white/5 p-2 rounded-md border border-white/5">
                        <span>⚡</span> Mucho más aprendizaje
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style jsx global>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.3; }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
