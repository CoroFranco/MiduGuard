"use client"

import { BadgeInfo, Stamp, Clock, Star, AlertCircle, Shield, Target, Users, Database, Search } from "lucide-react";
import { useState } from "react";
import { useParams } from "next/navigation";

export default function WelcomeModal() {
  const params = useParams() as { day?: string };
  const currentDay = params?.day ? parseInt(params.day, 10) : 1;
  const [currentStep, setCurrentStep] = useState(0);
  
  const dayContent = {
    1: {
      title: "Día 1: Tu primera jornada",
      steps: [
        {
          title: "¡Bienvenido a Midulandia!",
          content: (
            <div className="space-y-4">
              <p className="text-lg font-medium">
                ¡Has sido contratado como oficial de inmigración! Tu misión es verificar los datos de los MiduLovers antes de permitirles la entrada.
              </p>
              <div className="flex items-center justify-center">
                <div className="relative">
                  <div className="absolute -top-1 -right-1">
                    <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                  </div>
                  <div className="h-20 w-20 rounded-full bg-purple-600 flex items-center justify-center">
                    <span className="text-4xl">👮</span>
                  </div>
                </div>
              </div>
              <p className="italic text-center text-gray-400">
                La seguridad de Midulandia está en tus manos
              </p>
            </div>
          ),
        },
        {
          title: "Día 1: Tu primera jornada",
          content: (
            <div className="space-y-4">
              <div className="rounded-lg border border-purple-500 bg-purple-900/20 p-3">
                <p>Hoy es tu primer día como oficial de inmigración en Midulandia. Deberás revisar los documentos de cada MiduLover y decidir si pueden entrar o no.</p>
              </div>
              <div className="flex justify-center">
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col items-center gap-1 rounded-lg border border-gray-700 bg-gray-800 p-2">
                    <BadgeInfo className="h-10 w-10 text-purple-500" />
                    <span className="text-xs font-medium">Tablas de información</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 rounded-lg border border-gray-700 bg-gray-800 p-2">
                    <Stamp className="h-10 w-10 text-white" />
                    <span className="text-xs font-medium">Sellos de entrada</span>
                  </div>
                </div>
              </div>
            </div>
          ),
        },
        {
          title: "Cómo jugar",
          content: (
            <div className="space-y-4">
              <ul className="list-inside space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <div className="mt-1 text-emerald-400">
                    <BadgeInfo className="h-6 w-6 text-purple-500" />
                  </div>
                  <span>Consulta las <span className="font-bold text-emerald-400">tablas de información</span> en el panel derecho para verificar los datos.</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="mt-1 text-emerald-400">
                    <Stamp className="h-6 w-6 text-white" />
                  </div>
                  <span>Encuentra los <span className="font-bold text-emerald-400">sellos</span> en la parte izquierda de cada visitante.</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="mt-1 text-amber-400">
                    <AlertCircle className="h-6 w-6" />
                  </div>
                  <span>¡Cuidado! Un error podría costar la seguridad de Midulandia.</span>
                </li>
              </ul>
              <div className="rounded-lg border border-amber-500 bg-amber-900/20 p-3 flex items-center gap-3">
                <Clock className="h-6 w-6 text-amber-400 flex-shrink-0" />
                <p className="text-sm">Tienes <span className="font-bold text-amber-400">5 minutos</span> para revisar a tantos MiduLovers como puedas. ¡El tiempo corre!</p>
              </div>
            </div>
          ),
        },
      ],
    },
    2: {
      title: "Día 2: Los invitados especiales",
      steps: [
        {
          title: "¡Una visita muy especial!",
          content: (
            <div className="space-y-4">
              <p className="text-lg font-medium">
                Hoy es un día especial en Midulandia. Llegaron invitados VIP con credenciales especiales que debes verificar con cuidado.
              </p>
              <div className="flex items-center justify-center">
                <div className="relative">
                  <div className="absolute -top-1 -right-1">
                    <Users className="h-5 w-5 text-gold-400" />
                  </div>
                  <div className="h-20 w-20 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center">
                    <span className="text-4xl">🌟</span>
                  </div>
                </div>
              </div>
              <p className="italic text-center text-gray-400">
                Invitados especiales requieren verificación especial
              </p>
            </div>
          ),
        },
        {
          title: "El desafío de hoy: Múltiples tablas",
          content: (
            <div className="space-y-4">
              <div className="rounded-lg border border-blue-500 bg-blue-900/20 p-3">
                <p className="font-medium mb-2">🎯 Tu misión:</p>
                <p>Cada invitado especial tiene su propia tabla de credenciales. Deberás cruzar información entre la tabla de MiduLovers y estas tablas especiales.</p>
              </div>
              
              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-center gap-3 rounded-lg border border-gray-700 bg-gray-800 p-3">
                  <Database className="h-8 w-8 text-blue-400" />
                  <div>
                    <span className="font-bold text-blue-400">Tabla MiduLovers:</span>
                    <p className="text-sm text-gray-300">Información básica de cada visitante</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 rounded-lg border border-gray-700 bg-gray-800 p-3">
                  <BadgeInfo className="h-8 w-8 text-purple-400" />
                  <div>
                    <span className="font-bold text-purple-400">Tablas Especiales:</span>
                    <p className="text-sm text-gray-300">Credenciales únicas para cada invitado</p>
                  </div>
                </div>
              </div>
            </div>
          ),
        },
        {
          title: "¿Cómo funciona?",
          content: (
            <div className="space-y-4">
              <div className="rounded-lg border border-amber-500 bg-amber-900/20 p-3">
                <p className="font-bold text-amber-400 mb-2">⚠️ ¡Atención!</p>
                <p className="text-sm">Algunos datos pueden ser diferentes entre las tablas. Tu trabajo es encontrar las inconsistencias.</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Search className="h-6 w-6 text-green-400 mt-1" />
                  <div>
                    <p className="font-bold text-green-400 text-sm">Ejemplo de verificación:</p>
                    <p className="text-xs text-gray-300">{`Si Gandalf dice ser "Mago" en su documento, verifica en su tabla especial que su "titulo" coincida.`}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Shield className="h-6 w-6 text-blue-400 mt-1" />
                  <div>
                    <p className="font-bold text-blue-400 text-sm">Usa JOIN para ser eficiente:</p>
                    <p className="text-xs text-gray-300">Combina información de ambas tablas en una sola consulta para verificar rápidamente.</p>
                  </div>
                </div>
              </div>
            </div>
          ),
        },
        {
          title: "Consejos para el éxito",
          content: (
            <div className="space-y-4">
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-3">
                  <div className="mt-1">
                    <Database className="h-5 w-5 text-blue-400" />
                  </div>
                  <span>
                    <span className="font-bold text-blue-400">Documento válido:</span> Verifica que <code className="bg-gray-700 px-1 rounded">documento_valido = true</code> en la tabla del invitado.
                  </span>
                </li>
                
                <li className="flex items-start gap-3">
                  <div className="mt-1">
                    <Search className="h-5 w-5 text-green-400" />
                  </div>
                  <span>
                    <span className="font-bold text-green-400">Información cruzada:</span> Compara datos como profesión, edad, o títulos entre ambas tablas.
                  </span>
                </li>
                
                <li className="flex items-start gap-3">
                  <div className="mt-1">
                    <Target className="h-5 w-5 text-purple-400" />
                  </div>
                  <span>
                    <span className="font-bold text-purple-400">Nombres duplicados:</span> Puede haber varios con el mismo nombre. Usa otros campos para distinguirlos.
                  </span>
                </li>
              </ul>
              
              <div className="rounded-lg border border-red-500 bg-red-900/20 p-3 flex items-center gap-3">
                <Clock className="h-6 w-6 text-red-400 flex-shrink-0" />
                <p className="text-sm">
                  Tienes <span className="font-bold text-red-400">5 minutos</span> y la presión aumenta. 
                  <br />¡Usa JOIN eficientemente para no perder tiempo!
                </p>
              </div>
            </div>
          ),
        },
      ],
    },
    3: {
      title: "Día 3: Crisis en la frontera",
      steps: [
        {
          title: "¡Alerta máxima!",
          content: (
            <div className="space-y-4">
              <p className="text-lg font-medium">
                El último día ha llegado y la situación es crítica. Se han reportado infiltrados que quieren sabotear el Festival de Midulandia.
              </p>
              <div className="flex items-center justify-center">
                <div className="relative">
                  <div className="absolute -top-1 -right-1">
                    <AlertCircle className="h-5 w-5 text-red-400" />
                  </div>
                  <div className="h-20 w-20 rounded-full bg-red-600 flex items-center justify-center">
                    <span className="text-4xl">🚨</span>
                  </div>
                </div>
              </div>
              <p className="italic text-center text-gray-400">
                El destino de Midulandia está en juego
              </p>
            </div>
          ),
        },
        {
          title: "Medidas extraordinarias",
          content: (
            <div className="space-y-4">
              <div className="rounded-lg border border-red-500 bg-red-900/20 p-3">
                <p>El ministerio ha implementado un sistema de lista negra. Todos los visitantes deben ser comparados con esta lista antes de permitir su entrada.</p>
              </div>
              <div className="flex justify-center">
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col items-center gap-1 rounded-lg border border-gray-700 bg-gray-800 p-2">
                    <Target className="h-10 w-10 text-red-500" />
                    <span className="text-xs font-medium">Lista de sospechosos</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 rounded-lg border border-gray-700 bg-gray-800 p-2">
                    <Shield className="h-10 w-10 text-red-500" />
                    <span className="text-xs font-medium">Códigos de seguridad</span>
                  </div>
                </div>
              </div>
            </div>
          ),
        },
        {
          title: "Instrucciones finales",
          content: (
            <div className="space-y-4">
              <ul className="list-inside space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <div className="mt-1 text-red-400">
                    <Target className="h-6 w-6" />
                  </div>
                  <span>Compara cada visitante con la <span className="font-bold text-red-400">lista de sospechosos</span> antes de sellar su entrada.</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="mt-1 text-red-400">
                    <Shield className="h-6 w-6" />
                  </div>
                  <span>Verifica los <span className="font-bold text-red-400">códigos de seguridad</span> en todos los documentos presentados.</span>
                </li>
              </ul>
              <div className="rounded-lg border border-red-500 bg-red-900/20 p-3 flex items-center gap-3">
                <Clock className="h-6 w-6 text-red-400 flex-shrink-0" />
                <p className="text-sm">Solo tienes <span className="font-bold text-red-400">3 minutos</span> y cada error tendrá graves consecuencias. ¡La presión está al máximo!</p>
              </div>
            </div>
          ),
        },
      ],
    },
  };

  const currentDayContent = dayContent[currentDay] || dayContent[1];
  const steps = currentDayContent.steps;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1">
        <h2 className="text-xl font-bold text-center mb-4">{steps[currentStep].title}</h2>
        {steps[currentStep].content}
      </div>
      
      <div className="mt-6">
        <div className="flex justify-center mb-4">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full mx-1 ${
                index === currentStep ? "bg-purple-500" : "bg-gray-600"
              }`}
            />
          ))}
        </div>
        
        <div className="flex justify-between">
          <button
            onClick={handlePrev}
            disabled={currentStep === 0}
            className={`cursor-pointer px-3 py-1 rounded text-sm ${
              currentStep === 0
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-gray-700"
            }`}
          >
            Anterior
          </button>
          
          {currentStep < steps.length - 1 && (
            <button
              onClick={handleNext}
              className="cursor-pointer px-3 py-1 rounded bg-purple-600 hover:bg-purple-700 text-sm"
            >
              Siguiente
            </button>
          ) }
        </div>
      </div>
    </div>
  );
}
