"use client"
import { useEffect, useLayoutEffect, useRef } from "react"
import Link from "next/link"
import { Shield, LogIn, UserPlus } from 'lucide-react'
import { useRouter } from "next/navigation"
import gsap from "gsap"
import { TextPlugin } from "gsap/TextPlugin"
import { useIntroText } from "@/hooks/useIntroText"
import Image from "next/image"
import {  useUser } from '@clerk/nextjs';
import { SoundToggle } from "@/components/SoundToggle"
import { useGlobalMusic } from "@/hooks/useGlobalMusic"
import { LoadingScreen } from "@/components/LoadingScreen"

if (typeof window !== "undefined") {
  gsap.registerPlugin(TextPlugin)
}

const hasSeenIntro = typeof window !== "undefined" ? localStorage.getItem("seenIntro") === "true" : false

const INTRO_TEXTS = [
  "Bienvenido a MiduGuard...",
  "Tú eres la primera línea de defensa de Midulandia.",
  "Deberás decidir quién entra y quién no.",
  "Verifica documentos. Detecta impostores. Protege la frontera.",
  "Prepárate para tu misión...",
]
const SHORT_TEXTS = [
  "Bienvenido a MiduGuard..."
]

export default function Home() {
  const {isLoaded, isSignedIn} = useUser()
  const mainContentRef = useRef(null)
  const router = useRouter()
  const imgRef = useRef(null)
  const introRef = useRef(null)

  const { textRef, introCompleted } = useIntroText(hasSeenIntro ? SHORT_TEXTS : INTRO_TEXTS )
  
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.push('/game')
    }
  }, [isLoaded, isSignedIn, router])
  
  useGlobalMusic('/intro.mp3', 0.4)

  useLayoutEffect(() => {
  if (introCompleted && mainContentRef.current) {
    gsap.fromTo(
      mainContentRef.current,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 2,
        ease: "power3.out",
      },
    )
  }
}, [introCompleted])

  useLayoutEffect(() => {
    if(!isLoaded) return
    if (introRef.current) {
      gsap.fromTo(
        introRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 2,
          ease: "power3.out",
        },
      )
    }
  }, [isLoaded])

  useLayoutEffect(() => {
    if(!isLoaded) return
    if (imgRef.current) {
      gsap.fromTo(
        imgRef.current,
        { opacity: 0, scale: 0.8 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.5,
          ease: "power3.out",
        },
      )
    }
  }, [isLoaded])

  if (!isLoaded) {
    return <LoadingScreen />
  }
  
  return (
    <div className="flex flex-col max-h-[100vh] items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8 text-foreground relative overflow-hidden" >
      <div className="absolute top-6 right-6 md:top-10 md:right-20 z-10">
        <SoundToggle />
      </div>
      {!introCompleted ? (
        <div className="max-w-md w-full space-y-8 flex flex-col items-center justify-center opacity-0" ref={introRef} >      
          <div 
            ref={imgRef} 
            className="border-2 border-purple/20 p-4 mb-6 rounded-lg shadow-purple opacity-0 transition-all duration-300 hover:shadow-lg"
          >
            <Image 
              src="/midulandia.png" 
              alt="Logo MiduGuard" 
              width={500} 
              height={200}
              className="rounded-md" 
            />
          </div>
          <div className="h-24 flex items-center justify-center p-6 border border-border rounded-lg shadow-md backdrop-blur-sm glass">
            <p className="text-2xl font-mono" ref={textRef}>
              {/* El texto viene aquí desde useIntroText */}
            </p>
            <span className="blink-cursor ml-1 text-2xl text-purple">|</span>
          </div>
        </div>
      ) : (
        <div className="max-w-md w-full space-y-10 opacity-0" ref={mainContentRef}>
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-4 rounded-full bg-purple/10 shadow-purple transition-transform duration-300 hover:scale-105">
                <Shield className="h-16 w-16 text-purple" />
              </div>
            </div>
            <h1 className="mt-6 text-4xl font-bold text-gradient">MiduGuard</h1>
            <p className="mt-3 text-xl text-purple font-mono">El guardián de Midulandia</p>
            <p className="mt-4 text-foreground/80 font-mono text-sm max-w-sm mx-auto">
              Asume el papel de guardia fronterizo y decide quién puede entrar a Midulandia, el paraíso de los
              programadores
            </p>
          </div>

          <div className="mt-8 space-y-5">
            <Link
              href="/auth/sign-in"
              className="group relative w-full flex justify-center py-4 px-5 border border-purple/30 rounded-lg text-foreground bg-blackLight/5 hover:bg-purple hover:text-white focus:outline-none transition-all duration-300 shadow-md hover:shadow-purple"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-4">
                <LogIn className="h-5 w-5 text-purple group-hover:text-white transition-colors duration-300" />
              </span>
              <span className="font-medium">Iniciar sesión</span>
            </Link>

            <Link
              href="/auth/sign-up"
              className="group relative w-full flex justify-center py-4 px-5 border border-purple rounded-lg text-foreground bg-purple/10 hover:bg-purple hover:text-white focus:outline-none transition-all duration-300 shadow-md hover:shadow-purple"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-4">
                <UserPlus className="h-5 w-5 text-purple group-hover:text-white transition-colors duration-300" />
              </span>
              <span className="font-medium">Registrarme</span>
            </Link>
          </div>

          <div className="mt-10">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-background text-foreground/70 font-mono">Características</span>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="bg-blackLight/5 p-5 rounded-lg border-l-3 border-purple shadow-md hover:shadow-purple transition-all duration-300 hover:translate-y-[-2px] group">
                <h3 className="font-medium text-purple group-hover:text-gradient transition-all duration-300">Autenticación con Clerk</h3>
                <p className="mt-2 text-sm text-foreground/70 font-mono">
                  Aprende a implementar un sistema de autenticación robusto con Clerk
                </p>
              </div>

              <div className="bg-blackLight/5 p-5 rounded-lg border-l-3 border-purple/70 shadow-md hover:shadow-purple transition-all duration-300 hover:translate-y-[-2px] group">
                <h3 className="font-medium text-purple/90 group-hover:text-gradient transition-all duration-300">SQL Interactivo</h3>
                <p className="mt-2 text-sm text-foreground/70 font-mono">
                  Practica consultas SQL para verificar la información de usuarios
                </p>
              </div>

              <div className="bg-blackLight/5 p-5 rounded-lg border-l-3 border-purple/60 shadow-md hover:shadow-purple transition-all duration-300 hover:translate-y-[-2px] group">
                <h3 className="font-medium text-purple/80 group-hover:text-gradient transition-all duration-300">Gameplay Inmersivo</h3>
                <p className="mt-2 text-sm text-foreground/70 font-mono">
                  Siente la presión de tomar decisiones mientras los Midulanders esperan
                </p>
              </div>

              <div className="bg-blackLight/5 p-5 rounded-lg border-l-3 border-purple/50 shadow-md hover:shadow-purple transition-all duration-300 hover:translate-y-[-2px] group">
                <h3 className="font-medium text-purple/70 group-hover:text-gradient transition-all duration-300">Aprende mientras juegas</h3>
                <p className="mt-2 text-sm text-foreground/70 font-mono">
                  Domina conceptos de seguridad web de manera divertida
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      
    </div>   
  )
}
