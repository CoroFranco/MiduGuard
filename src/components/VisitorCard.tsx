"use client"

import { useState, useRef, useLayoutEffect } from "react"
import Image from "next/image"
import { RotateCw, ZoomIn, ZoomOut } from "lucide-react"
import gsap from "gsap"
import { LoadingScreen } from "@/components/LoadingScreen"

interface Visitor {
  id: string
  nombre: string
  edad: string
  pais_origen: string
  profesion: string
  fecha_ingreso: string
  foto_url: string
}

interface VisitorCardProps {
  visitor?: Visitor
}

export function VisitorCard({ visitor }: VisitorCardProps) {
  const [isFlipped, setIsFlipped] = useState(false)
  const [zoomLevel, setZoomLevel] = useState(0.8)
  const [currentTab, setCurrentTab] = useState<"person" | "documents">("person")
  const [currentVisitor, setCurrentVisitor] = useState<Visitor | undefined>(visitor)
  const [previousVisitor, setPreviousVisitor] = useState<Visitor | null>(null)

  const cardRef = useRef<HTMLDivElement>(null)
  const currentImageRef = useRef<HTMLDivElement>(null)
  const previousImageRef = useRef<HTMLDivElement>(null)
  const documentRef = useRef<HTMLDivElement>(null)

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.1, 1.5))
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.1, 0.8))

  // Handle visitor prop changes with animation
  useLayoutEffect(() => {
    if (!visitor || !currentVisitor) {
      setCurrentVisitor(visitor);
      return;
    }
    
    if (visitor.id !== currentVisitor.id) {
      setPreviousVisitor(currentVisitor)

      if (currentImageRef.current) {
        gsap.fromTo(currentImageRef.current, {x:0, opacity:1}, {
          x: 300,
          opacity: 0,
          duration: 2,
          ease: "power3.out",
          onComplete: () => {
        setCurrentVisitor(visitor)
        gsap.fromTo(
        currentImageRef.current,
        { x: -300, opacity: 0 },
        {
          delay:0.2,
          x: 0,
          opacity: 1,
          duration: 3,
          ease: "expo.out",
        },
      )
          },
        })
      } else {
        setCurrentVisitor(visitor)
      }
    }
  }, [visitor, currentVisitor])
  

  // Animate document flip
  useLayoutEffect(() => {
    if (documentRef.current) {
      if (isFlipped) {
        gsap.to(documentRef.current, {
          rotationY: 180,
          duration: 0.8,
          ease: "power2.inOut",
        })
      } else {
        gsap.to(documentRef.current, {
          rotationY: 0,
          duration: 0.8,
          ease: "power2.inOut",
        })
      }
    }
  }, [isFlipped])

  // Tab switching animation
  const switchTab = (tab: "person" | "documents") => {
    if (tab !== currentTab) {
      // Fade out current content
      gsap.to(`.tab-content-${currentTab}`, {
        opacity: 0,
        y: 20,
        duration: 0.3,
        onComplete: () => {
          setCurrentTab(tab)
          // Fade in new content
          gsap.fromTo(`.tab-content-${tab}`, { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.4 })
        },
      })
    }
  }

  // Render loading state if no visitor data is available
  if (!currentVisitor) {
    return (
      <LoadingScreen />
    )
  }

  if(!visitor) return

  return (
    <div
      ref={cardRef}
      className="relative w-full mt-2 bg-gray-900 rounded-xl border-2 border-gray-700 shadow-2xl overflow-hidden flex flex-col h-[500px]"
    >
      {/* Booth Header */}
      <div className="bg-gray-800 p-2 border-b-2 border-gray-700 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-rose-500"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
          <span className="text-xs font-mono text-gray-300 ml-2">PUERTO DE INMIGRACIÓN #04</span>
        </div>
        <div className="text-xs text-gray-300">DÍA 1</div>
      </div>

      {/* Tabs */}
      <div className="flex text-xs border-b-2 border-gray-700 shrink-0">
        <button
          onClick={() => switchTab("person")}
          className={`flex-1 hover:cursor-pointer py-1.5 text-center font-medium ${
            currentTab === "person"
              ? "bg-gray-700 text-white border-b-2 border-background"
              : "text-gray-300 hover:bg-gray-800"
          }`}
        >
          VISITANTE
        </button>
        <button
          onClick={() => switchTab("documents")}
          className={`flex-1 hover:cursor-pointer py-1.5 text-center font-medium ${
            currentTab === "documents"
              ? "bg-gray-700 text-white border-b-2 border-background"
              : "text-gray-300 hover:bg-gray-800"
          }`}
        >
          DOCUMENTOS
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden relative">
        {/* Person Inspection Tab */}
        {currentTab === "person" && (
          <div className="absolute inset-0 bg-black tab-content-person">
            {/* Window Background */}
            <div className="absolute inset-0 z-0">
              <Image src="/window.png" alt="window background" fill className="object-cover opacity-70" />
            </div>

            {/* Person Image */}
            <div className="absolute inset-0 flex items-center justify-center z-10">
              {/* Current visitor image */}
              <div
                ref={currentImageRef}
                className="relative px-4"
                style={{ transform: `scale(${zoomLevel})` }}
              >
                <Image
                  src={currentVisitor.foto_url}
                  alt={currentVisitor.nombre}
                  width={300}
                  height={375}
                  className="object-contain max-h-[180px] xs:max-h-[220px] sm:max-h-[250px]"
                />
              </div>

              {/* Previous visitor image (for transition) */}
              {previousVisitor && (
                <div ref={previousImageRef} className="absolute opacity-0" style={{ pointerEvents: "none" }}>
                  <Image
                    src={previousVisitor.foto_url}
                    alt={previousVisitor.nombre}
                    width={300}
                    height={375}
                    className="object-contain max-h-[180px] xs:max-h-[220px] sm:max-h-[250px]"
                  />
                </div>
              )}
            </div>

            {/* Zoom Controls */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-3 z-20">
              <button
                onClick={handleZoomOut}
                className="p-2 rounded-full bg-gray-800/90 hover:bg-gray-700/90 text-white shadow-md"
                disabled={zoomLevel <= 0.8}
              >
                <ZoomOut className="h-4 w-4" />
              </button>
              <button
                onClick={handleZoomIn}
                className="p-2 rounded-full bg-gray-800/90 hover:bg-gray-700/90 text-white shadow-md"
                disabled={zoomLevel >= 1.5}
              >
                <ZoomIn className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Documents Inspection Tab */}
        {currentTab === "documents" && (
          <div className="absolute inset-0 bg-gray-800 overflow-y-auto p-2 tab-content-documents">
            <div className="relative min-h-[250px] h-full">
              {/* Document with GSAP-enhanced flip animation */}
              <div
                ref={documentRef}
                className="relative w-full h-full"
                style={{
                  transformStyle: "preserve-3d",
                }}
              >
                {/* Front of document */}
                <div
                  className="absolute inset-0 backface-hidden bg-gray-900 border-4 border-background rounded-xl p-3 shadow-lg"
                  style={{ backfaceVisibility: "hidden" }}
                >
                  <div className="flex justify-between items-center border-b-2 border-background pb-2 mb-3">
                    <h2 className="text-base font-bold text-backborder-background">PERMISO DE INGRESO</h2>
                    <div className="text-right">
                      <p className="text-xs font-mono text-backborder-background">No. {currentVisitor?.id}</p>
                      <p className="text-xs text-backborder-background">
                        Fecha de ingreso: {currentVisitor?.fecha_ingreso}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex flex-col items-center">
                      <div className="relative h-32 w-24 mx-auto sm:mx-0 overflow-hidden border-2 border-background bg-gray-800 shadow-sm">
                        <Image
                          src={currentVisitor?.foto_url || "/placeholder.svg"}
                          alt={currentVisitor?.nombre || "Visitante"}
                          width={96}
                          height={128}
                          className="object-cover h-full w-full"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-backborder-backgroundt-white text-center py-0.5 text-xs">
                          FOTO OFICIAL
                        </div>
                      </div>
                      <div className="mt-2 w-full text-center">
                        <div className="border-2 border-background px-2 py-1 bg-gray-800 shadow-inner">
                          <p className="text-xs font-bold text-backborder-background uppercase">
                            {currentVisitor?.nombre}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-3">
                      <div>
                        <p className="text-xs text-backborder-background font-medium uppercase">Nacionalidad</p>
                        <p className="text-xs font-bold text-gray-200 border-b border-background1">
                          {currentVisitor?.pais_origen}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-backborder-background font-medium uppercase">Edad</p>
                        <p className="text-xs font-bold text-gray-200 border-b border-background1">
                          {currentVisitor?.edad}
                        </p>
                      </div>

                      <div className="col-span-1 sm:col-span-2">
                        <p className="text-xs text-backborder-background font-medium uppercase">Profesión</p>
                        <p className="text-xs font-bold text-gray-200 border-b border-background1">
                          {currentVisitor?.profesion}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Back of document */}
                <div
                  className="absolute inset-0 backface-hidden bg-gray-900 border-4 border-background rounded-xl p-3 shadow-lg"
                  style={{
                    backfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                  }}
                >
                  <div className="flex justify-between items-center border-b-2 border-background pb-2 mb-3">
                    <h2 className="text-base font-bold text-backborder-background">INFORMACIÓN ADICIONAL</h2>
                    <div className="text-right">
                      <p className="text-xs font-mono text-backborder-background">No. {currentVisitor?.id}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="mt-3 p-2 border-2 border-dashed border-background rounded-lg bg-gray-800 shadow-inner">
                      <div className="flex items-start">
                        <div>
                          <p className="text-xs text-backborder-background uppercase">
                            Fecha de ingreso: {currentVisitor?.fecha_ingreso}
                          </p>
                          <p className="text-xs text-backborder-background uppercase mt-2">
                            Nota: Verifique que la foto coincida con el portador.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Controls - Fixed at bottom */}
      <div className="border-t-2 border-gray-700 p-2 bg-gray-800 flex justify-between items-center shrink-0">
        {currentTab === "documents" && (
          <button
            className="flex items-center gap-2 px-3 py-1.5 bg-backborder-backgrounder:bg-backborder-background text-white rounded-lg shadow-md transition-colors"
            onClick={() => setIsFlipped(!isFlipped)}
          >
            <RotateCw className="h-4 w-4" />
            <span className="text-xs font-medium">Girar Documento</span>
          </button>
        )}
      </div>
    </div>
  )
}
