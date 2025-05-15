"use client"

import { useState, useEffect, ReactNode } from "react"
import { X, AlertCircle, CheckCircle, Info, AlertTriangle } from "lucide-react"

type MessageType = "info" | "warning" | "error" | "success"

interface GameModalProps {
  isOpen: boolean
  onClose?: () => void
  title: string
  message?: string
  content?: ReactNode
  type?: MessageType
  autoClose?: number
}

export function GameModal({ 
  isOpen, 
  onClose, 
  title, 
  message, 
  content, 
  type = "info", 
  autoClose 
}: GameModalProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true)
    } else {
      const timer = setTimeout(() => {
        setIsVisible(false)
      }, 300) 
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  useEffect(() => {
    if (isOpen && autoClose) {
      const timer = setTimeout(() => {
        onClose()
      }, autoClose)
      return () => clearTimeout(timer)
    }
  }, [isOpen, autoClose, onClose])

  if (!isOpen && !isVisible) return null

  const getTypeStyles = () => {
    switch (type) {
      case "warning":
        return {
          icon: <AlertTriangle className="h-6 w-6 text-amber-400" />,
          borderColor: "border-amber-500",
          bgColor: "bg-amber-900/20",
        }
      case "error":
        return {
          icon: <AlertCircle className="h-6 w-6 text-rose-400" />,
          borderColor: "border-rose-500",
          bgColor: "bg-rose-900/20",
        }
      case "success":
        return {
          icon: <CheckCircle className="h-6 w-6 text-emerald-400" />,
          borderColor: "border-emerald-500",
          bgColor: "bg-emerald-900/20",
        }
      case "info":
      default:
        return {
          icon: <Info className="h-6 w-6 text-purple-400" />,
          borderColor: "border-purple-500",
          bgColor: "bg-purple-900/20",
        }
    }
  }

  const { icon, borderColor, bgColor } = getTypeStyles()

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose}></div>

      {/* Modal */}
      <div
        className={`relative w-full max-w-md transform rounded-xl border-2 ${borderColor} bg-gray-900 shadow-2xl transition-all duration-300 ${
          isOpen ? "scale-100" : "scale-95"
        }`}
      >
        {/* Header */}
        <div className={`flex items-center justify-between rounded-t-lg ${bgColor} p-4`}>
          <div className="flex items-center gap-3">
            {icon}
            <h3 className="text-lg font-bold text-white">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 text-gray-200">
          {/* Muestra el componente React si existe, de lo contrario muestra el mensaje de texto */}
          {content ? content : <p>{message}</p>}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 border-t border-gray-700 p-4">
          <button
            onClick={onClose}
            className="rounded-lg bg-gray-700 px-4 py-2 text-sm font-medium text-white hover:bg-gray-600 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}
