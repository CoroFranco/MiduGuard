"use client"

import { useState, useRef, useLayoutEffect, useEffect } from "react"
import Image from "next/image"
import { RotateCw, ZoomIn, ZoomOut, Award, Check, X, Stamp } from "lucide-react"
import gsap from "gsap"
import { LoadingScreen } from "@/components/LoadingScreen"
import { SpeechBubble } from "@/components/SpeechBubble"
import { Visitor } from "@/types/visitorType"
import Clerk from "@/components/Clerk"


interface VisitorCardProps {
  visitor?: Visitor
  onApprove?: (id: string) => void | Promise<boolean> | boolean
  onReject?: (id: string) => void | Promise<boolean> | boolean
}

export function VisitorCard({ visitor, onApprove, onReject }: VisitorCardProps) {
  const [isFlipped, setIsFlipped] = useState(false)
  const [zoomLevel, setZoomLevel] = useState(0.8)
  const [currentTab, setCurrentTab] = useState<"person" | "documents" | "skills">("person")
  const [currentVisitor, setCurrentVisitor] = useState<Visitor | undefined>(visitor)
  const [previousVisitor, setPreviousVisitor] = useState<Visitor | null | undefined>(null)
  const [stampEffect, setStampEffect] = useState<"approved" | "rejected" | null>(null)
  const [showStampOptions, setShowStampOptions] = useState(false)
  const [isProcessingStamp, setIsProcessingStamp] = useState(false)
  
  const approveStampRef = useRef<HTMLButtonElement>(null)
  const rejectStampRef = useRef<HTMLButtonElement>(null)
  const stampOptionsRef = useRef<HTMLDivElement>(null)
  const stampButtonRef = useRef<HTMLButtonElement>(null)

  const cardRef = useRef<HTMLDivElement>(null)
  const currentImageRef = useRef<HTMLDivElement>(null)
  const previousImageRef = useRef<HTMLDivElement>(null)
  const documentRef = useRef<HTMLDivElement>(null)

  const handleApproveClick = async () => {
  if (!currentVisitor || isProcessingStamp) return
  
  if (onApprove) {
    const willBeProcessed = await onApprove(currentVisitor.id);
    if (willBeProcessed === false) {
      return;
    }
  }
  
  setIsProcessingStamp(true)
  setStampEffect("approved")
  
  if (approveStampRef.current) {
    if (stampOptionsRef.current) {
      gsap.to(
        stampOptionsRef.current,
        { 
          width: 0, 
          opacity: 0,
          x: -50,
          duration: 0.3,
          ease: "power2.in",
          onComplete: () => {
            setShowStampOptions(false)
            
            gsap.fromTo(
              approveStampRef.current,
              { rotation: -45, scale: 1.2 },
              { 
                rotation: 0, 
                scale: 1,
                duration: 0.5,
                ease: "elastic.out(1, 0.3)",
                onComplete: () => {
                  // No llamamos a onApprove de nuevo aquí, ya lo hicimos arriba
                  setTimeout(() => {
                    setStampEffect(null)
                    setIsProcessingStamp(false)
                  }, 1500)
                }
              }
            )
          }
        }
      )
    }
  }
}

const handleRejectClick = async () => {
  if (!currentVisitor || isProcessingStamp) return

  if (onReject) {
    const willBeProcessed = await onReject(currentVisitor.id);
    if (willBeProcessed === false) {
      return;
    }
  }
  
  setIsProcessingStamp(true)
  setStampEffect("rejected")
  
  if (rejectStampRef.current) {
    if (stampOptionsRef.current) {
      gsap.to(
        stampOptionsRef.current,
        { 
          width: 0, 
          opacity: 0,
          x: -50,
          duration: 0.3,
          ease: "power2.in",
          onComplete: () => {
            setShowStampOptions(false)           
            gsap.fromTo(
              rejectStampRef.current,
              { rotation: 45, scale: 1.2 },
              { 
                rotation: 0, 
                scale: 1,
                duration: 0.5,
                ease: "elastic.out(1, 0.3)",
                onComplete: () => {
                  setTimeout(() => {
                    setStampEffect(null)
                    setIsProcessingStamp(false)
                  }, 1500)
                }
              }
            )
          }
        }
      )
    }
  }
}

  const toggleStampOptions = () => {
    if (isProcessingStamp) return
    
    if (stampOptionsRef.current) {
      if (!showStampOptions) {
        // Animate stamp button on press
        if (stampButtonRef.current) {
          gsap.to(stampButtonRef.current, {
            scale: 0.9,
            duration: 0.1,
            ease: "power1.in",
            onComplete: () => {
              gsap.to(stampButtonRef.current, {
                scale: 1,
                duration: 0.2,
                ease: "power1.out"
              })
            }
          })
        }
        
        // Show animation - horizontal slide from left to right with bounce effect
        setShowStampOptions(true)
        gsap.fromTo(
          stampOptionsRef.current,
          { 
            width: 0, 
            opacity: 0,
            x: -50
          },
          { 
            width: 'auto', 
            opacity: 1,
            x: 0,
            duration: 0.6,
            ease: "back.out(1.2)"
          }
        )
      } else {
        gsap.to(
          stampOptionsRef.current,
          { 
            width: 0, 
            opacity: 0,
            x: -50,
            duration: 0.4,
            ease: "power2.in",
            onComplete: () => setShowStampOptions(false)
          }
        )
      }
    }
  }
  
  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.1, 1.5))
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.1, 0.8))
  
  useEffect(() => {
    if (visitor?.id !== currentVisitor?.id) {
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
                delay: 0.2,
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
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showStampOptions && 
        !isProcessingStamp &&
        stampOptionsRef.current && 
        !stampOptionsRef.current.contains(event.target as Node) &&
        event.target instanceof Element &&
        !event.target.closest('.stamp-button')
      ) {
        if (stampOptionsRef.current) {
          gsap.to(
            stampOptionsRef.current,
            { 
              width: 0, 
              opacity: 0,
              x: -50,
              duration: 0.4,
              ease: "power2.in",
              onComplete: () => setShowStampOptions(false)
            }
          )
        }
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showStampOptions, isProcessingStamp])

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

  const switchTab = (tab: "person" | "documents" | "skills") => {
    if (tab !== currentTab) {
      gsap.to(`.tab-content-${currentTab}`, {
        opacity: 0,
        duration: 0.3,
        ease: "circle.in",
        onComplete: () => {
          setCurrentTab(tab)
          gsap.fromTo(`.tab-content-${tab}`, { opacity: 0 }, { opacity: 1, duration: 0.4 })
        },
      })
    }
  }

  if (!currentVisitor) {
    return (
      <LoadingScreen />
    )
  }

  if(!visitor) return

  // Parse skills into array
  const skillsArray = currentVisitor.skills ? currentVisitor.skills.split(',').map(skill => skill.trim()) : []

  return (
    <div
      ref={cardRef}
      className="relative w-full mt-2 bg-gray-900 rounded-xl border-2 border-gray-700 shadow-2xl overflow-hidden flex flex-col h-full"
    >
      <div className="bg-gray-800 p-2 border-b-2 border-gray-700 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-rose-500"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
          <span className="text-xs font-mono text-gray-300 ml-2">PUERTO DE INMIGRACIÓN #04</span>
        </div>
        <div className="text-xs text-gray-300">DÍA 1</div>
      </div>

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
        <button
          onClick={() => switchTab("skills")}
          className={`flex-1 hover:cursor-pointer py-1.5 text-center font-medium ${
            currentTab === "skills"
              ? "bg-gray-700 text-white border-b-2 border-background"
              : "text-gray-300 hover:bg-gray-800"
          }`}
        >
          HABILIDADES
        </button>
      </div>

       

      <div className="flex-1 overflow-hidden relative">
        {stampEffect && (
          <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none">
            <div className={`transform rotate-[-25deg] opacity-90 ${
              stampEffect === "approved" 
                ? "text-emerald-600" 
                : "text-rose-600"
            }`}>
              <div className={`border-[12px] ${
                stampEffect === "approved" 
                  ? "border-emerald-600" 
                  : "border-rose-600"
              } rounded-md flex items-center justify-center`} style={{ width: "300px", height: "150px" }}>
                <div className={`absolute inset-0 ${
                  stampEffect === "approved" 
                    ? "bg-emerald-600" 
                    : "bg-rose-600"
                } opacity-10`}></div>
                <div className="relative">
                  <div className="absolute -inset-2 border-4 border-dashed rounded-md opacity-60 rotate-2"></div>
                  <span className="text-4xl flex font-black tracking-wider" style={{ textShadow: "0 2px 4px rgba(0,0,0,0.3)" }}>
                    <Clerk />
                    {stampEffect === "approved" ? "lerk" : "lerk"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="absolute z-30 h-full">
        <button 
          ref={stampButtonRef}
          onClick={toggleStampOptions}
          disabled={isProcessingStamp}
          className={`cursor-pointer relative flex h-full flex-col gap-2 place-items-center justify-center bg-gray-700 border-2 border-gray-800 rounded-md p-3 shadow-lg ${isProcessingStamp ? 'opacity-75 cursor-not-allowed' : 'hover:bg-gray-600'} transition-all`}
          style={{ boxShadow: "inset 0px -4px 0px rgba(0,0,0,0.3)" }}
        >
          <Stamp className={isProcessingStamp ? "opacity-50" : ""} />
        </button>
        
        <div 
          ref={stampOptionsRef}
          className={`absolute left-full top-1/2 -translate-y-1/2 overflow-hidden w-0 opacity-0`}
          style={{ height: "132px" }}
        >
          <div className="bg-gray-800 border-2 border-gray-900 rounded-md p-3 shadow-xl h-full flex items-center">
            <div className="flex items-center gap-4 h-full">
              <button
                ref={approveStampRef}
                onClick={handleApproveClick}
                disabled={isProcessingStamp}
                className={`stamp-option cursor-pointer h-full flex flex-col items-center justify-center transform hover:scale-105 transition-all px-2 ${isProcessingStamp ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className="mb-1 text-emerald-300 text-xs font-bold">Authorized</div>
                <div className="h-20 w-20 flex items-center justify-center relative">
                  <div className="absolute inset-0 bg-emerald-900 rounded-sm rotate-3 opacity-30"></div>
                  <div className="bg-gray-900 p-0.5 rounded-sm border-2 border-emerald-800" style={{ boxShadow: "inset 0px -3px 0px rgba(0,0,0,0.5)" }}>
                    <div className="w-14 h-14 rounded-sm border-2 border-emerald-600 bg-emerald-700 flex items-center justify-center p-1" 
                         style={{ boxShadow: "inset 0px -2px 8px rgba(0,0,0,0.4)" }}>
                      <div className="border-4 border-emerald-500 rounded-sm w-full h-full flex items-center justify-center">
                        <Check className="h-8 w-8 text-emerald-200" strokeWidth={4} />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-1 flex items-center">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 mr-1"></div>
                  <div className="w-14 h-1 bg-emerald-700"></div>
                </div>
              </button>
              
              <div className="h-[90%] w-px bg-gray-700"></div>
              
              <button
                ref={rejectStampRef}
                onClick={handleRejectClick}
                disabled={isProcessingStamp}
                className={`stamp-option cursor-pointer h-full flex flex-col items-center justify-center transform hover:scale-105 transition-all px-2 ${isProcessingStamp ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className="mb-1 text-rose-300 text-xs font-bold">Unauthorized</div>
                <div className="h-20 w-20 flex items-center justify-center relative">
                  <div className="absolute inset-0 bg-rose-900 rounded-sm -rotate-3 opacity-30"></div>
                  <div className="bg-gray-900 p-0.5 rounded-sm border-2 border-rose-800" style={{ boxShadow: "inset 0px -3px 0px rgba(0,0,0,0.5)" }}>
                    <div className="w-14 h-14 rounded-sm border-2 border-rose-600 bg-rose-700 flex items-center justify-center p-1" 
                         style={{ boxShadow: "inset 0px -2px 8px rgba(0,0,0,0.4)" }}>
                      <div className="border-4 border-rose-500 rounded-sm w-full h-full flex items-center justify-center">
                        <X className="h-8 w-8 text-rose-200" strokeWidth={4} />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-1 flex items-center">
                  <div className="w-2 h-2 rounded-full bg-rose-400 mr-1"></div>
                  <div className="w-14 h-1 bg-rose-700"></div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

        {currentTab === "person" && (
          <div className="absolute inset-0 bg-black tab-content-person">
            <div className="relative right-[5%] -top-4">
            <SpeechBubble phrase={currentVisitor.frase} />
            </div>
            <div className="absolute inset-0 z-0">
              <Image src="/window.png" alt="window background" fill className="object-cover opacity-70" />
            </div>

            <div className="absolute inset-0 flex items-center justify-center z-10">
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

        {currentTab === "skills" && (
          <div className="absolute pl-20 inset-0 bg-gray-800 overflow-y-auto p-4 tab-content-skills">
            <div className="bg-gray-900 rounded-lg border-2 border-gray-700 p-4 shadow-lg">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center">
                <Award className="h-5 w-5 mr-2 text-amber-400" />
                Habilidades y Competencias
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="col-span-1 sm:col-span-2 mb-2">
                  <p className="text-sm text-gray-300">Habilidades de {currentVisitor.nombre}:</p>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {skillsArray.length > 0 ? skillsArray.map((skill, index) => (
                    <span 
                      key={index} 
                      className="bg-gray-700 text-white px-3 py-1 rounded-full text-xs font-medium shadow-sm"
                    >
                      {skill}
                    </span>
                  )) : (
                    <span className="text-gray-400 text-sm">No se han registrado habilidades</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {currentTab === "documents" && (
          <div className="absolute pl-20 inset-0 bg-gray-800 overflow-y-auto p-2 tab-content-documents">
            <div className="relative min-h-[250px] h-full">
              <div
                ref={documentRef}
                className="relative w-full h-full"
                style={{
                  transformStyle: "preserve-3d",
                }}
              >
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
                          <p className="text-xs font-bold text-backborder-background">
                            {currentVisitor?.nombre}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-3">
                      <div>
                        <p className="text-xs text-backborder-background font-medium">Nacionalidad</p>
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

                      <div>
                        <p className="text-xs text-backborder-background font-medium uppercase">Fecha Nacimiento</p>
                        <p className="text-xs font-bold text-gray-200 border-b border-background1">
                          {currentVisitor?.fecha_nacimiento}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-backborder-background font-medium uppercase">Tipo Documento</p>
                        <p className="text-xs font-bold text-gray-200 border-b border-background1">
                          {currentVisitor?.tipo_documento}
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-3">
                      <div>
                        <p className="text-xs text-backborder-background font-medium uppercase">Documento ID</p>
                        <p className="text-xs font-bold text-gray-200 border-b border-background1">
                          {currentVisitor?.documento_id}
                        </p>
                      </div>
                    </div>

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
