"use client"

import { useState } from "react"
import { Database, Terminal, Copy, Sparkles } from "lucide-react"

const tables = [
  {
    name: "midulovers",
    description: "Información general de los MiduLovers que desean entrar a Midulandia",
  },
  {
    name: "miduSkills",
    description: "Habilidades registradas de cada MiduLover",
  },
  {
    name: "documentos",
    description: "Documentos oficiales presentados por cada visitante",
  },
]

export default function TablesOverview() {
  const [copiedQuery, setCopiedQuery] = useState<string>("")
  const exampleQuery = "SELECT * FROM midulovers;"

  const handleCopyQuery = (query: string) => {
    navigator.clipboard.writeText(query)
      .then(() => {
        setCopiedQuery(query)
        setTimeout(() => setCopiedQuery(""), 2000)
      })
      .catch(() => {
        /* opcional: mostrar error si falla */
      })
  }

  return (
    <div className="max-w-xl mx-auto p-6 bg-gray-900 rounded-lg space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center bg-indigo-800/50 rounded-full px-3 py-1 mb-2">
          <Terminal className="h-4 w-4 text-indigo-300 mr-1" />
          <span className="text-xs font-medium text-indigo-200">Base de datos – Día 1</span>
        </div>
        <h2 className="text-2xl font-bold">Tablas Disponibles</h2>
      </div>

      {/* Consejo de inicio */}
      <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700 relative">
        <h3 className="font-medium text-lg mb-2 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-amber-400" />
          <span>Consejos para empezar</span>
        </h3>
        <p className="text-gray-300 mb-3">
          Puedes comenzar explorando la información general de los MiduLovers con esta consulta:
        </p>
        <div className="relative">
          <div className="bg-gray-900 text-gray-100 rounded border border-gray-700 p-3 font-mono text-sm">
            {exampleQuery}
          </div>
          <button
            onClick={() => handleCopyQuery(exampleQuery)}
            className="absolute top-2 right-2 p-1.5 rounded-md hover:bg-gray-800 transition-colors"
            title="Copiar consulta"
          >
            {copiedQuery === exampleQuery ? (
              <span className="text-green-400 text-xs">¡Copiado!</span>
            ) : (
              <Copy className="h-4 w-4 text-gray-400" />
            )}
          </button>
        </div>
      </div>

      {/* Listado de tablas */}
      <ul className="space-y-3">
        {tables.map((t) => (
          <li
            key={t.name}
            className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg border border-gray-700"
          >
            <div>
            <Database className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <p className="font-medium text-white capitalize">{t.name}</p>
              <p className="text-sm text-gray-400">{t.description}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
