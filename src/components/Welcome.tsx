"use client"

import { BadgeInfo, Stamp, Clock, Star, AlertCircle } from "lucide-react";
import { useState } from "react";

export default function WelcomeModal() {
  const [currentStep, setCurrentStep] = useState(0);
  
  const steps = [
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
          <p className="italic text-gray-400">
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
                <BadgeInfo className="h-10 w-10 text-purple" />
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
                <BadgeInfo className="text-purple h-6 w-6" />
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
  ];

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
        {/* Progress dots */}
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
        
        {/* Navigation buttons */}
        <div className="flex justify-between">
          <button
            onClick={handlePrev}
            disabled={currentStep === 0}
            className={` cursor-pointer px-3 py-1 rounded text-sm ${
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
          )}
        </div>
      </div>
    </div>
  );
}
