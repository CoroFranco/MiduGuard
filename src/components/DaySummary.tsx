"use client"

import { Trophy, Clock, ArrowRight, ThumbsUp, ThumbsDown } from "lucide-react"

interface DaySummaryProps {
  day: number
  score: number
  correctDecisions: number
  wrongDecisions: number
  timeLeft: number
  onContinue: () => void
  isFinalDay?: boolean
}

export function DaySummary({
  day,
  score,
  correctDecisions = 0,
  wrongDecisions = 0,
  timeLeft = 0,
  onContinue,
  isFinalDay
}: DaySummaryProps) {
  const totalDecisions = correctDecisions + wrongDecisions
  const accuracy = totalDecisions > 0 ? (correctDecisions / totalDecisions) * 100 : 0
  
  const getPerformancePhrase = () => {
    if (accuracy >= 90) return "¡Excelente trabajo!"
    if (accuracy >= 75) return "¡Buen trabajo!"
    if (accuracy >= 50) return "Trabajo aceptable"
    return "Necesitas mejorar"
  }

  return (
    <div className="flex flex-col items-center text-center">
      <div className="mb-4 flex justify-center">
        <Trophy className="h-14 w-14 text-yellow-400" />
      </div>
      
      <h2 className="mb-2 text-2xl font-bold text-white">Día {day} Completado</h2>
      
      <div className="mb-4 text-gray-300">
        {getPerformancePhrase()}
      </div>
      
      <div className="my-4 grid w-full grid-cols-2 gap-3">
        <div className="rounded-lg bg-gray-800/50 p-3 text-center">
          <div className="flex items-center justify-center mb-1">
            <ThumbsUp className="mr-2 h-4 w-4 text-green-400" />
            <span className="text-xs text-gray-400">Decisiones correctas</span>
          </div>
          <p className="text-xl font-bold text-green-400">{correctDecisions}</p>
        </div>
        
        <div className="rounded-lg bg-gray-800/50 p-3 text-center">
          <div className="flex items-center justify-center mb-1">
            <ThumbsDown className="mr-2 h-4 w-4 text-rose-400" />
            <span className="text-xs text-gray-400">Decisiones incorrectas</span>
          </div>
          <p className="text-xl font-bold text-rose-400">{wrongDecisions}</p>
        </div>
      </div>
      
      <div className="mb-4 flex items-center justify-between w-full">
        <div className="flex items-center">
          <Clock className="mr-2 h-4 w-4 text-blue-400" />
          <span className="text-sm text-gray-400">Tiempo restante:</span>
        </div>
        <span className="text-sm font-medium text-blue-400">{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</span>
      </div>
      
      <div className="mb-4 rounded-lg bg-gray-800 px-6 py-3 w-full">
        <div className="text-sm text-gray-400">Puntuación total</div>
        <div className="text-3xl font-bold text-white">{score} pts</div>
      </div>
      
      <div className="mt-4 w-full">
        <button
          onClick={onContinue}
          className={!isFinalDay ? `flex w-full items-center justify-center gap-2 rounded-lg bg-purple-600 py-3 text-white transition-colors hover:bg-purple-700` : 'hidden'}
        >
          <span>{!isFinalDay ? `Continuar al Día ${day < 3 ? day + 1 : '(Final)'}` : `Leaderboard`}</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
