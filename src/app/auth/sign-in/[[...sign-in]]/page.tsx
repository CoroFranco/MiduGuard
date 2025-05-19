"use client"

import { useLayoutEffect, useRef } from "react"
import { SignIn } from "@clerk/nextjs"
import gsap from "gsap"
import { ArrowLeft, ShieldCheck, Lock, AlertCircle } from "lucide-react"
import Link from "next/link"
import { SoundToggle } from "@/components/SoundToggle"
import { dark } from "@clerk/themes"
import { useGlobalMusic } from "@/hooks/useGlobalMusic"
import { GameBackground } from "@/components/Background"

export default function SignInPage() {
  const pageRef = useRef<HTMLDivElement>(null)
  const backLinkRef = useRef<HTMLAnchorElement>(null)
  const iconRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const formContainerRef = useRef<HTMLDivElement>(null)
  const decorationRef = useRef<HTMLDivElement>(null)
  const infoBoxRef = useRef<HTMLDivElement>(null)
  const watermarkRef = useRef<HTMLDivElement>(null)

  useGlobalMusic('/log.mp3', 0.05)
  useLayoutEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } })

    tl.fromTo(
      backLinkRef.current,
      { x: -20, opacity: 0 },
      { x: 0, opacity: 0.6, duration: 1 },
      "-=1.0"
    )

    tl.fromTo(
      iconRef.current,
      { y: -20, opacity: 0, scale: 0.8 },
      { y: 0, opacity: 1, scale: 1, duration: 1.2, ease: "back.out(1.5)" },
      "-=0.5"
    )

    tl.fromTo(
      [titleRef.current, subtitleRef.current],
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.15, duration: 1.3 },
      "-=0.5"
    )

    tl.fromTo(
      formContainerRef.current,
      { y: 30, opacity: 0, scale: 0.97 },
      { y: 0, opacity: 1, scale: 1, duration: 1.4 },
      "-=0.4"
    )

    tl.fromTo(
      decorationRef.current,
      { scale: 0, opacity: 0, rotation: -45 },
      { scale: 1, opacity: 1, rotation: 0, duration: 1, ease: "back.out(2.5)" },
      "-=0.6"
    )

    tl.fromTo(
      infoBoxRef.current,
      { y: 15, opacity: 0 },
      { y: 0, opacity: 1, duration: 1 },
      "-=0.4"
    )

    tl.fromTo(
      watermarkRef.current,
      { opacity: 0 },
      { opacity: 0.4, duration: 1 },
      "-=0.2"
    )

    return () => {
      tl.kill()
    }
  }, [])

  return (
    <div
      ref={pageRef}
      className="flex min-h-screen place-items-center justify-center p-6 relative font-sans bg-background text-foreground"
    >
      <GameBackground className="z-10" />
      <div className="absolute top-6 left-6 flex items-center space-x-4 z-10">
        <Link
          href="/"
          ref={backLinkRef}
          className="flex items-center text-foreground opacity-60 hover:text-purple transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="ml-1 text-sm font-medium">Volver</span>
        </Link>
      </div>
      <div className="absolute top-10 right-20 z-20">
      <SoundToggle />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <div ref={iconRef} className="flex justify-center mb-4">
            <ShieldCheck className="h-14 w-14 text-purple" />
          </div>
          <h1 ref={titleRef} className="text-3xl font-bold mb-2">Iniciar sesión</h1>
          <p ref={subtitleRef} className="opacity-60">Accede a tu cuenta para continuar</p>
        </div>
        

        <div
          ref={formContainerRef}
          className="relative flex flex-col place-items-center justify-center p-8 bg-background border border-border rounded-xl shadow-xl backdrop-blur-md"
          
        >
          <SignIn
            appearance={{
              baseTheme: dark
            }}
            routing="path"
            path="/auth/sign-in"
            signUpUrl="/auth/sign-up"
            forceRedirectUrl="/game"
          />
          <div ref={decorationRef} className="absolute -top-4 -right-4">
            <div className="bg-purple p-3 rounded-full shadow-lg">
              <Lock className="h-5 w-5 text-white" />
            </div>
          </div>

          
          <div className="mt-4 p-3 border border-dashed border-document-gray rounded-sm">
            <div className="flex items-start">
              <AlertCircle className="h-4 w-4 text-document-gray mr-2 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-document-gray font-mono">
                Todos los visitantes deben ser verificados. La falsificación de documentos está penada con la expulsión
                permanente de Midulandia.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-4 right-4 opacity-30">
        <p className="text-xs font-mono text-document-gray">MIDUGUARD · CONTROL FRONTERIZO</p>
      </div>
    </div>
  )
}
