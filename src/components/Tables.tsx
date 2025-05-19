"use client"
import { useState } from "react"
import { Database, Terminal, Copy, Sparkles, Table, Users, Star, Info, List, Eye } from "lucide-react"
import { useParams } from "next/navigation"

type TableName = "midulovers" | "midu_skills" | "documentos"
type TabType = "overview" | "tables" | TableName

interface TableInfo {
  name: TableName
  description: string
  structure: Array<{
    column: string
    type: string
    description?: string
  }>
}

interface SpecialTable {
  name: string
  character: string
  description: string
}

const getTablesByDay = (): TableInfo[] => {
  const baseTables: TableInfo[] = [
    {
      name: "midulovers",
      description: "Información general de los MiduLovers que desean entrar a Midulandia",
      structure: [
        { column: "id", type: "INTEGER PRIMARY KEY", description: "Identificador único" },
        { column: "nombre", type: "NUMERIC", description: "Nombre completo" },
        { column: "edad", type: "INTEGER", description: "Edad en años" },
        { column: "pais_origen", type: "NUMERIC", description: "País de procedencia" },
        { column: "profesion", type: "NUMERIC", description: "Ocupación o profesión" },
        { column: "fecha_ingreso", type: "NUMERIC", description: "Fecha de entrada a Midulandia" }
      ]
    },
    {
      name: "midu_skills",
      description: "Habilidades registradas de cada MiduLover",
      structure: [
        { column: "midulover_id", type: "INTEGER", description: "Referencia al id de midulovers" },
        { column: "skill", type: "TEXT", description: "Nombre de la habilidad" }
      ]
    },
    {
      name: "documentos",
      description: "Documentos oficiales presentados por cada visitante",
      structure: [
        { column: "id", type: "INTEGER PRIMARY KEY", description: "Identificador único del documento" },
        { column: "midulover_id", type: "INTEGER", description: "Referencia al id de midulovers" },
        { column: "tipo", type: "NUMERIC", description: "Tipo de documento" },
        { column: "numero", type: "NUMERIC", description: "Número de identificación del documento" },
        { column: "fecha_vencimiento", type: "NUMERIC", description: "Fecha de caducidad" }
      ]
    },
  ]
  
  return baseTables
}

const getSpecialTables = (): SpecialTable[] => [
  { name: "documentos_interdimensionales", character: "Rick", description: "Documentos de viajes interdimensionales" },
  { name: "ceos_galacticos", character: "Elon", description: "Registro de CEOs del espacio" },
  { name: "archivos_prohibidos", character: "Mr. Tartaria", description: "Base de datos de agentes SHIELD" },
  { name: "lista_busqueda", character: "Walter", description: "Profesores de Albuquerque" },
  { name: "registros_minas_tirith", character: "Gandalf", description: "Registros de Minas Tirith" },
  { name: "registros_futuro", character: "Okabe", description: "Registros de Poniente" },
  { name: "registros_scotland_yard", character: "Sherlock", description: "Archivos de Scotland Yard" },
  { name: "robots_futuristas", character: "Doraemon", description: "Datos de la Alianza Rebelde" },
  { name: "dulceros_certificados", character: "Willy", description: "Dulceros certificados" },
  { name: "ejecutivos_tech", character: "Mark", description: "Guardianes de la Noche" }
]

export default function TablesOverview() {
  const params = useParams()
  const day = params?.day ? Number(params.day) : 1
  const tables = getTablesByDay()
  const specialTables = getSpecialTables()
  
  const [activeTab, setActiveTab] = useState<TabType>("overview")
  const [copiedQuery, setCopiedQuery] = useState<string>("")
  
  const exampleQuery = "SELECT * FROM midulovers;"
  const pragmaExampleQuery = "PRAGMA table_info('midulovers');"
  const day2ExampleQuery = `SELECT m.nombre, di.*
FROM midulovers m
JOIN documentos_interdimensionales di ON m.nombre = di.nombre
WHERE m.nombre LIKE '%Rick%'`

  const handleCopyQuery = (query: string) => {
    navigator.clipboard.writeText(query)
      .then(() => {
        setCopiedQuery(query)
        setTimeout(() => setCopiedQuery(""), 2000)
      })
      .catch(() => {
        
      })
  }

  if (day === 2) {
    return (
      <div className="w-full p-4 bg-gray-900 rounded-lg space-y-4">
        <style jsx global>{`
          ::-webkit-scrollbar {
            width: 6px;
            height: 6px;
          }
          
          ::-webkit-scrollbar-track {
            background: #1a1a1a;
            border-radius: 6px;
          }
          
          ::-webkit-scrollbar-thumb {
            background: linear-gradient(180deg, #7c3aed, #4f46e5);
            border-radius: 6px;
          }
          
          ::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(180deg, #8b5cf6, #6366f1);
          }
          
          * {
            scrollbar-width: thin;
            scrollbar-color: #7c3aed #1a1a1a;
          }
        `}</style>

        <div className="text-center">
          <div className="inline-flex items-center bg-indigo-800/50 rounded-full px-2 py-1 mb-2">
            <Terminal className="h-3 w-3 text-indigo-300 mr-1" />
            <span className="text-xs font-medium text-indigo-200">Día {day} - Base de Datos SQLite</span>
          </div>
          <h2 className="text-lg font-bold text-white">Base de Datos SQL</h2>
          <p className="text-xs text-gray-400 mt-1">Consulta las tablas para verificar los datos de cada visitante</p>
        </div>
        <div className="border-b border-gray-700">
          <nav className="flex -mb-px" aria-label="Pestañas">
            <button
              onClick={() => setActiveTab("overview")}
              className={`py-1.5 px-3 border-b-2 text-xs font-medium flex-shrink-0 ${
                activeTab === "overview"
                  ? "border-indigo-500 text-indigo-400"
                  : "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600"
              }`}
            >
              <div className="flex items-center gap-1">
                <Info className="w-3 h-3" />
                <span>Guía SQL</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab("tables")}
              className={`py-1.5 px-3 border-b-2 text-xs font-medium flex-shrink-0 ${
                activeTab === "tables"
                  ? "border-indigo-500 text-indigo-400"
                  : "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600"
              }`}
            >
              <div className="flex items-center gap-1">
                <List className="w-3 h-3" />
                <span>Lista de Tablas</span>
              </div>
            </button>
          </nav>
        </div>


        <div className="max-h-80 overflow-y-auto">
          {activeTab === "overview" && (
            <div className="space-y-4">
              <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700 relative">
                <h3 className="font-medium text-lg mb-2 flex items-center gap-2">
                  <Eye className="h-5 w-5 text-cyan-400" />
                  <span>Inspeccionar estructura de tablas</span>
                </h3>
                <p className="text-gray-300 mb-3 text-sm">
                  Usa PRAGMA para inspeccionar la estructura de las tablas especiales (SQLite):
                </p>
                <div className="relative">
                  <div className="bg-gray-900 text-gray-100 rounded border border-gray-700 p-3 font-mono text-sm">
                    {`PRAGMA table_info('documentos_interdimensionales');
                  `}</div>
                  <button
                    onClick={() => handleCopyQuery("PRAGMA table_info('documentos_interdimensionales');")}
                    className="absolute top-2 right-2 p-1.5 rounded-md hover:bg-gray-800 transition-colors"
                    title="Copiar consulta PRAGMA"
                  >
                    {copiedQuery === "PRAGMA table_info('documentos_interdimensionales');" ? (
                      <span className="text-green-400 text-xs">¡Copiado!</span>
                    ) : (
                      <Copy className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700 relative">
                <h3 className="font-medium text-lg mb-2 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-amber-400" />
                  <span>Consulta con JOIN - Ejemplo</span>
                </h3>
                <p className="text-gray-300 mb-3 text-sm">
                  Para el día 2, necesitarás combinar datos de las tablas principales con las tablas especiales de cada personaje:
                </p>
                <div className="relative">
                  <div className="bg-gray-900 text-gray-100 rounded border border-gray-700 p-3 font-mono text-sm whitespace-pre-line">
                    {day2ExampleQuery}
                  </div>
                  <button
                    onClick={() => handleCopyQuery(day2ExampleQuery)}
                    className="absolute top-2 right-2 p-1.5 rounded-md hover:bg-gray-800 transition-colors"
                    title="Copiar consulta"
                  >
                    {copiedQuery === day2ExampleQuery ? (
                      <span className="text-green-400 text-xs">¡Copiado!</span>
                    ) : (
                      <Copy className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
                
                <div className="mt-4 space-y-2 text-sm text-gray-300">
                  <div className="bg-gray-900/50 rounded p-3">
                    <h4 className="font-medium text-yellow-400 mb-2">¿Cómo funciona esta consulta?</h4>
                    <ul className="space-y-1 text-xs">
                      <li><strong className="text-blue-400">SELECT m.nombre, di.*:</strong> Selecciona el nombre de midulovers y todos los campos de la tabla especial</li>
                      <li><strong className="text-green-400">FROM midulovers m:</strong>{` Tabla principal con alias 'm' (como un apodo)`}</li>
                      <li><strong className="text-purple-400">JOIN documentos_interdimensionales di:</strong>{` Une con la tabla especial usando alias 'di'`}</li>
                      <li><strong className="text-orange-400">ON m.nombre = di.nombre:</strong> Condición de unión - nombres que coinciden</li>
                      <li><strong className="text-pink-400">{`WHERE m.nombre LIKE '%Rick%':`}</strong> {`Filtro para nombres que contengan "Rick"`}</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                <h3 className="font-medium text-lg mb-3 flex items-center gap-2">
                  <Database className="h-5 w-5 text-blue-400" />
                  <span>Consejos SQLite para hoy</span>
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <span className="text-cyan-400">📋</span>
                    <span>Usa <code className="bg-gray-700 px-1 rounded">{`PRAGMA table_info('tabla')`}</code> para ver la estructura de cualquier tabla</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-400">✓</span>
                    <span>Cada personaje especial tiene su propia tabla con columnas únicas</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-400">✓</span>
                    <span>Usa JOIN para verificar información entre tablas eficientemente</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-400">✓</span>
                    <span>Verifica que el campo <code className="bg-gray-700 px-1 rounded">documento_valido = true</code></span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-amber-400">⚠</span>
                    <span>Algunos datos pueden diferir entre tablas - busca inconsistencias</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "tables" && (
            <div className="space-y-4">
              <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
                <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                  <Users className="h-4 w-4 text-blue-400" />
                  Tablas Principales (3)
                </h3>
                <div className="space-y-2">
                  {tables.map((table) => (
                    <div key={table.name} className="bg-gray-900 rounded p-2 border border-gray-600">
                      <div className="flex items-center gap-2">
                        <Database className="h-4 w-4 text-blue-400" />
                        <span className="font-mono text-green-400 text-sm">{table.name}</span>
                        <div className="ml-auto flex gap-1">
                          <button
                            onClick={() => handleCopyQuery(`PRAGMA table_info('${table.name}');`)}
                            className="text-xs text-gray-400 hover:text-gray-300 bg-gray-800 px-2 py-1 rounded"
                            title="Ver estructura"
                          >
                            <Eye className="h-3 w-3 inline mr-1" />
                            PRAGMA
                          </button>
                          <button
                            onClick={() => handleCopyQuery(`SELECT * FROM ${table.name};`)}
                            className="text-xs text-gray-400 hover:text-gray-300 bg-gray-800 px-2 py-1 rounded"
                          >
                            <Copy className="h-3 w-3 inline mr-1" />
                            SQL
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
                <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                  <Star className="h-4 w-4 text-amber-400" />
                  Tablas Especiales ({specialTables.length})
                </h3>
                <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
                  {specialTables.map((table) => (
                    <div key={table.name} className="bg-gray-900 rounded p-2 border border-gray-600 hover:border-gray-500 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-purple-400 bg-purple-900/30 px-1.5 py-0.5 rounded">
                            {table.character}
                          </span>
                          <Database className="h-3 w-3 text-blue-400" />
                          <span className="font-mono text-green-400 text-sm">{table.name}</span>
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleCopyQuery(`PRAGMA table_info('${table.name}');`)}
                            className="text-xs text-gray-400 hover:text-gray-300 bg-gray-800 px-2 py-1 rounded"
                            title="Ver estructura"
                          >
                            <Eye className="h-3 w-3 inline mr-1" />
                            PRAGMA
                          </button>
                          <button
                            onClick={() => handleCopyQuery(`SELECT * FROM ${table.name};`)}
                            className="text-xs text-gray-400 hover:text-gray-300 bg-gray-800 px-2 py-1 rounded"
                          >
                            <Copy className="h-3 w-3 inline mr-1" />
                            SQL
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="w-full p-4 bg-gray-900 rounded-lg space-y-4">
      <div className="text-center">
        <div className="inline-flex items-center bg-indigo-800/50 rounded-full px-2 py-1 mb-2">
          <Terminal className="h-3 w-3 text-indigo-300 mr-1" />
          <span className="text-xs font-medium text-indigo-200">Día {day} - Base de Datos SQLite</span>
        </div>
        <h2 className="text-lg font-bold text-white">Base de Datos SQL</h2>
        <p className="text-xs text-gray-400 mt-1">Consulta las tablas para verificar los datos de cada visitante</p>
      </div>

      <div className="border-b border-gray-700">
        <nav className="flex -mb-px overflow-x-auto pb-1" aria-label="Pestañas">
          <button
            onClick={() => setActiveTab("overview")}
            className={`py-1.5 px-3 border-b-2 text-xs font-medium flex-shrink-0 ${
              activeTab === "overview"
                ? "border-indigo-500 text-indigo-400"
                : "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600"
            }`}
          >
            <div className="flex items-center gap-1">
              <Info className="w-3 h-3" />
              <span>Guía SQL</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab("tables")}
            className={`py-1.5 px-3 border-b-2 text-xs font-medium flex-shrink-0 ${
              activeTab === "tables"
                ? "border-indigo-500 text-indigo-400"
                : "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600"
            }`}
          >
            <div className="flex items-center gap-1">
              <List className="w-3 h-3" />
              <span>Lista de Tablas</span>
            </div>
          </button>
          {tables.map((table) => (
            <button
              key={table.name}
              onClick={() => setActiveTab(table.name)}
              className={`py-1.5 px-3 border-b-2 text-xs font-medium flex-shrink-0 ${
                activeTab === table.name
                  ? "border-indigo-500 text-indigo-400"
                  : "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600"
              }`}
            >
              <div className="flex items-center gap-1">
                <Database className="w-3 h-3" />
                <span>{table.name}</span>
              </div>
            </button>
          ))}
        </nav>
      </div>

      <div className="py-2 max-h-64 overflow-y-auto pr-1">
        {activeTab === "overview" && (
          <>
            <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700 relative mb-4">
              <h3 className="font-medium text-sm mb-2 flex items-center gap-2">
                <Eye className="h-4 w-4 text-cyan-400" />
                <span>Inspeccionar estructura de tablas</span>
              </h3>
              <p className="text-xs text-gray-400 mb-2">Usa PRAGMA para ver las columnas de cualquier tabla (SQLite):</p>
              <div className="relative">
                <div className="bg-gray-900 text-gray-100 rounded border border-gray-700 p-2 font-mono text-xs">
                  {pragmaExampleQuery}
                </div>
                <button
                  onClick={() => handleCopyQuery(pragmaExampleQuery)}
                  className="absolute top-1 right-1 p-1 rounded hover:bg-gray-800 transition-colors"
                  title="Copiar consulta PRAGMA"
                >
                  {copiedQuery === pragmaExampleQuery ? (
                    <span className="text-green-400 text-xs">✓</span>
                  ) : (
                    <Copy className="h-3 w-3 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700 relative mb-4">
              <h3 className="font-medium text-sm mb-2 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-amber-400" />
                <span>Consulta básica de ejemplo</span>
              </h3>
              <p className="text-xs text-gray-400 mb-2">Obtén todos los datos de una tabla:</p>
              <div className="relative">
                <div className="bg-gray-900 text-gray-100 rounded border border-gray-700 p-2 font-mono text-xs">
                  {exampleQuery}
                </div>
                <button
                  onClick={() => handleCopyQuery(exampleQuery)}
                  className="absolute top-1 right-1 p-1 rounded hover:bg-gray-800 transition-colors"
                  title="Copiar consulta"
                >
                  {copiedQuery === exampleQuery ? (
                    <span className="text-green-400 text-xs">✓</span>
                  ) : (
                    <Copy className="h-3 w-3 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
              <h3 className="font-medium text-sm mb-2 flex items-center gap-2">
                <Database className="h-4 w-4 text-blue-400" />
                <span>Consejos SQLite básicos</span>
              </h3>
              <div className="space-y-2 text-xs">
                <div className="flex items-start gap-2">
                  <span className="text-cyan-400">📋</span>
                  <span>Usa <code className="bg-gray-700 px-1 rounded">{`PRAGMA table_info('tabla')`}</code> para ver la estructura</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-400">✓</span>
                  <span>Usa <code className="bg-gray-700 px-1 rounded">SELECT *</code> para obtener todas las columnas</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-400">✓</span>
                  <span>Usa <code className="bg-gray-700 px-1 rounded">WHERE</code> para filtrar resultados específicos</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-400">✓</span>
                  <span>Termina cada consulta con punto y coma <code className="bg-gray-700 px-1 rounded">;</code></span>
                </div>
              </div>
            </div>
          </>
        )}
        {activeTab === "tables" && (
          <div className="space-y-2">
            {tables.map((table) => (
              <div 
                key={table.name} 
                className="flex items-center justify-between p-2 bg-gray-800 rounded-lg border border-gray-700 hover:bg-gray-750 cursor-pointer"
                onClick={() => setActiveTab(table.name)}
              >
                <div className="flex items-center gap-2">
                  <Database className="h-4 w-4 text-blue-400 flex-shrink-0" />
                  <span className="font-mono text-green-400 text-sm">{table.name}</span>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleCopyQuery(`PRAGMA table_info('${table.name}');`)
                    }}
                    className="text-xs text-gray-400 hover:text-gray-300 bg-gray-700 px-2 py-1 rounded"
                    title="Ver estructura"
                  >
                    <Eye className="h-3 w-3 inline mr-1" />
                    PRAGMA
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleCopyQuery(`SELECT * FROM ${table.name};`)
                    }}
                    className="text-xs text-gray-400 hover:text-gray-300 bg-gray-700 px-2 py-1 rounded"
                  >
                    <Copy className="h-3 w-3 inline mr-1" />
                    SQL
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {tables.map((table) => (
          activeTab === table.name && (
            <div key={table.name} className="space-y-3">
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4 text-blue-400" />
                <h3 className="text-sm font-medium">{table.name}</h3>
              </div>
              
              <p className="text-gray-300 text-xs">{table.description}</p>
              
              <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
                <h4 className="text-xs font-medium text-gray-300 mb-2 flex items-center gap-1">
                  <Table className="h-3 w-3" />
                  Estructura de la tabla
                </h4>
                <div className="overflow-x-auto max-h-32">
                  <table className="min-w-full text-xs">
                    <thead className="sticky top-0 bg-gray-800">
                      <tr className="border-b border-gray-700">
                        <th className="py-1 px-2 text-left font-medium text-gray-300">Columna</th>
                        <th className="py-1 px-2 text-left font-medium text-gray-300">Tipo</th>
                      </tr>
                    </thead>
                    <tbody>
                      {table.structure.map((col, idx) => (
                        <tr key={idx} className="border-b border-gray-700 last:border-0">
                          <td className="py-1 px-2 font-mono text-green-400">{col.column}</td>
                          <td className="py-1 px-2 font-mono text-blue-300">{col.type}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-2 flex gap-2">
                  <button
                    onClick={() => handleCopyQuery(`PRAGMA table_info('${table.name}');`)}
                    className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 transition-colors py-1 px-2 bg-gray-850 rounded"
                  >
                    <Eye className="h-3 w-3" />
                    {copiedQuery === `PRAGMA table_info('${table.name}');` ? "¡Copiado!" : "Ver estructura"}
                  </button>
                  <button
                    onClick={() => handleCopyQuery(`SELECT * FROM ${table.name};`)}
                    className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 transition-colors py-1 px-2 bg-gray-850 rounded"
                  >
                    <Copy className="h-3 w-3" />
                    {copiedQuery === `SELECT * FROM ${table.name};` ? "¡Copiado!" : "Copiar SQL"}
                  </button>
                </div>
              </div>
            </div>
          )
        ))}
      </div>
    </div>
  )
}
