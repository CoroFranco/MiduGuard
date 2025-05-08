"use client"

import { useState } from "react"
import Image from "next/image"
import { RotateCw, ZoomIn, ZoomOut } from "lucide-react"

interface Visitor {
  id: string
  name: string
  avatar: string
  origin: string
  destination: string
  reason: string
  skills: string[]
  validDocuments: boolean
  expirationDate?: string
  issuedDate?: string
  documentErrors?: string[]
  photoMismatch?: boolean
}

const visitor1: Visitor = {
  id: "ID-9473-28B",
  name: "Coro Mendez",
  avatar: "/midu3.png",
  origin: "República de Colombia",
  destination: "Distrito Federal de Midulandia",
  reason: "Visita técnica - Desarrollo de software",
  skills: ["Programación", "Seguridad informática", "Inglés avanzado"],
  validDocuments: false,
  issuedDate: "2023-11-15",
  expirationDate: "2024-11-14",
  documentErrors: ["EXPIRED_VISA", "PHOTO_MISMATCH"],
  photoMismatch: true
}

export function VisitorCard() {
  const [isFlipped, setIsFlipped] = useState(false)
  const [zoomLevel, setZoomLevel] = useState(0.8)
  const [currentTab, setCurrentTab] = useState<'person' | 'documents'>('person')

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.1, 1.5))
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.1, 0.8))

  // Check if document is expired (hidden logic)
  const isExpired = new Date(visitor1.expirationDate || '') < new Date()

  return (
    <div className="relative mx-4 mt-2 bg-gray-900 rounded-xl border-2 border-gray-700 shadow-2xl overflow-hidden flex flex-col" style={{ height: '600px' }}>
      {/* Booth Header */}
      <div className="bg-gray-800 p-3 border-b-2 border-gray-700 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span className="text-sm font-mono text-gray-300 ml-2">PUERTO DE INMIGRACIÓN #04</span>
        </div>
        <div className="text-sm text-gray-400">DÍA 1</div>
      </div>

      {/* Tabs */}
      <div className="flex text-sm border-b-2 border-gray-700 shrink-0">
        <button
          onClick={() => setCurrentTab('person')}
          className={`flex-1 hover:cursor-pointer py-2 text-center font-medium ${currentTab === 'person' ? 'bg-gray-700 text-white border-b-2 border-blue-400' : 'text-gray-400 hover:bg-gray-800'}`}
        >
          VISITANTE
        </button>
        <button
          onClick={() => setCurrentTab('documents')}
          className={`flex-1 hover:cursor-pointer py-2 text-center font-medium ${currentTab === 'documents' ? 'bg-gray-700 text-white border-b-2 border-blue-400' : 'text-gray-400 hover:bg-gray-800'}`}
        >
          DOCUMENTOS
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden relative">
        {/* Person Inspection Tab */}
        {currentTab === 'person' && (
          <div className="absolute inset-0 bg-black">
            {/* Window Background */}
            <div className="absolute inset-0 z-0">
              <Image
                src="/window.png"
                alt="window background"
                fill
                className="object-cover opacity-70"
              />
            </div>
            
            {/* Person Image */}
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <div 
                className="relative transition-transform duration-200"
                style={{ transform: `scale(${zoomLevel})` }}
              >
                <Image
                  src={visitor1.avatar}
                  alt={visitor1.name}
                  width={400}
                  height={500}
                  className="object-contain max-h-[450px]"
                />
              </div>
            </div>
            
            {/* Zoom Controls */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-3 z-20">
              <button 
                onClick={handleZoomOut}
                className="p-2 rounded-full bg-gray-800/90 hover:bg-gray-700/90 text-white shadow-md"
                disabled={zoomLevel <= 0.8}
              >
                <ZoomOut className="h-5 w-5" />
              </button>
              <button 
                onClick={handleZoomIn}
                className="p-2 rounded-full bg-gray-800/90 hover:bg-gray-700/90 text-white shadow-md"
                disabled={zoomLevel >= 1.5}
              >
                <ZoomIn className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}

        {/* Documents Inspection Tab */}
        {currentTab === 'documents' && (
          <div className="absolute inset-0 bg-gray-800 overflow-y-auto p-4">
            <div className="relative h-full min-h-[300px]">
              {/* Document with improved flip animation */}
              <div 
                className={`relative w-full h-full transition-all duration-500 ${isFlipped ? 'flip-card-back' : 'flip-card-front'}`}
                style={{
                  transformStyle: 'preserve-3d',
                  transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
                }}
              >
                {/* Front of document */}
                <div 
                  className="absolute inset-0 backface-hidden bg-yellow-50 border-4 border-yellow-700 rounded-xl p-5 shadow-lg"
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  <div className="flex justify-between items-center border-b-2 border-yellow-700 pb-3 mb-4">
                    <h2 className="text-xl font-bold text-yellow-900">PERMISO DE INGRESO</h2>
                    <div className="text-right">
                      <p className="text-xs font-mono text-yellow-800">No. {visitor1.id}</p>
                      <p className={`text-xs ${isExpired ? 'text-red-600' : 'text-yellow-800'}`}>
                        Válido hasta: {visitor1.expirationDate}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-5">
                    <div className="flex flex-col items-center">
                      <div className="relative h-44 w-36 overflow-hidden border-2 border-yellow-700 bg-yellow-100 shadow-sm">
                        <Image
                          src={visitor1.avatar}
                          alt={visitor1.name}
                          width={144}
                          height={176}
                          className="object-cover h-full w-full"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-yellow-700 text-white text-center py-1 text-xs">
                          FOTO OFICIAL
                        </div>
                      </div>
                      <div className="mt-3 w-full text-center">
                        <div className="border-2 border-yellow-700 px-3 py-1 bg-white shadow-inner">
                          <p className="text-sm font-bold text-yellow-900 uppercase">{visitor1.name}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex-1 grid grid-cols-2 gap-y-3 gap-x-4">
                      <div>
                        <p className="text-xs text-yellow-800 font-medium uppercase">Nacionalidad</p>
                        <p className="text-sm font-bold border-b border-yellow-300 pb-1">{visitor1.origin}</p>
                      </div>
                      
                      <div>
                        <p className="text-xs text-yellow-800 font-medium uppercase">Destino</p>
                        <p className="text-sm font-bold border-b border-yellow-300 pb-1">{visitor1.destination}</p>
                      </div>
                      
                      <div className="col-span-2">
                        <p className="text-xs text-yellow-800 font-medium uppercase">Propósito</p>
                        <p className="text-sm font-bold border-b border-yellow-300 pb-1">{visitor1.reason}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Back of document */}
                <div 
                  className="absolute inset-0 backface-hidden bg-yellow-50 border-4 border-yellow-700 rounded-xl p-5 shadow-lg"
                  style={{ 
                    backfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)'
                  }}
                >
                  <div className="flex justify-between items-center border-b-2 border-yellow-700 pb-3 mb-4">
                    <h2 className="text-xl font-bold text-yellow-900">INFORMACIÓN ADICIONAL</h2>
                    <div className="text-right">
                      <p className="text-xs font-mono text-yellow-800">No. {visitor1.id}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <p className="text-xs text-yellow-800 font-medium uppercase">Habilidades certificadas</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {visitor1.skills.map(skill => (
                          <span
                            key={skill}
                            className="inline-block px-3 py-1 text-xs font-bold rounded bg-yellow-200 text-yellow-900 border border-yellow-400 shadow-sm"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {visitor1.documentErrors?.includes("EXPIRED_VISA") && (
                      <div className="mt-3">
                        <p className="text-xs text-yellow-800 font-medium uppercase">Visa adjunta</p>
                        <p className="text-sm font-bold border-b border-yellow-300 pb-1">
                          Tipo: Técnico Especializado
                        </p>
                        <p className={`text-xs ${isExpired ? 'text-red-600' : 'text-yellow-800'}`}>
                          Expira: {visitor1.expirationDate}
                        </p>
                      </div>
                    )}

                    <div className="mt-5 p-3 border-2 border-dashed border-yellow-500 rounded-lg bg-yellow-100/50 shadow-inner">
                      <div className="flex items-start">
                        <div>
                          <p className="text-xs text-yellow-800 uppercase">
                            Nota: Verifique que la foto coincida con el portador y la validez de todos los documentos.
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
      <div className="border-t-2 border-gray-700 p-3 bg-gray-800 flex justify-between items-center shrink-0">
        {currentTab === 'documents' && (
          <button
            onClick={() => setIsFlipped(!isFlipped)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg shadow-md transition-colors"
          >
            <RotateCw className="h-5 w-5" />
            <span className="font-medium">Girar Documento</span>
          </button>
        )}     
      </div>
    </div>
  )
}
