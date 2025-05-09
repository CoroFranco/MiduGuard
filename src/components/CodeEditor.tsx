"use client"
import React, { useState } from "react"
import MonacoEditor from "@monaco-editor/react"
import { Play, RotateCw } from "lucide-react"

/**
 * CodeEditor permite al usuario escribir cualquier texto en el editor
 * y al hacer clic en "Ejecutar", ese mismo texto se muestra en la consola.
 */
export const CodeEditor: React.FC = () => {
  // Código inicial que aparece al cargar el editor
  const initialCode = `// Escribe lo que quieras aquí\n¡Hola MiduLovers!`

  const [code, setCode] = useState<string>(initialCode)
  const [output, setOutput] = useState<string>("")

  // Al ejecutar, guardamos el texto y lo mostramos en la consola de salida
  const executeCode = async (): void => {
    setOutput("Ejecutando código...") // Mensaje de ejecución mientras esperas la respuesta
    try {
      const res = await fetch('/api/db', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content: code })
      })

      const data = await res.json()
      if (data?.rows?.[0]) {
        // Convertimos el objeto en una cadena JSON
        setOutput(JSON.stringify(data.rows[0], null, 2))
      } else {
        setOutput("No se encontraron datos.")
      }
    } catch (error) {
      setOutput("Error al ejecutar el código. Inténtalo de nuevo.")
    }
  }

  // Reinicia el editor a su estado inicial
  const resetCode = (): void => {
    setCode(initialCode)
    setOutput("")
  }

  return (
    <div className="flex flex-col h-[500px] bg-gray-900 border border-gray-700 rounded-lg overflow-hidden">
      {/* Barra superior con botones */}
      <div className="bg-gray-800 p-2 flex justify-between items-center border-b border-gray-700">
        <div className="text-sm font-mono text-gray-300">Editor de Texto</div>
        <div className="flex gap-2">
          <button
            onClick={resetCode}
            className="flex items-center gap-1 px-3 py-1 bg-gray-700 text-gray-300 rounded text-sm"
          >
            <RotateCw className="h-4 w-4" />
            Reiniciar
          </button>
          <button
            onClick={executeCode}
            className="flex items-center gap-1 px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded text-sm"
          >
            <Play className="h-4 w-4" />
            Ejecutar
          </button>
        </div>
      </div>

      {/* Editor y Consola */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Editor (60%) */}
        <div className="flex-1 min-h-[200px] border-r border-gray-700">
          <MonacoEditor
            height="100%"
            defaultLanguage="plaintext"
            theme="vs-dark"
            value={code}
            onChange={(value) => setCode(value ?? "")}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              scrollBeyondLastLine: false,
              automaticLayout: true,
              lineNumbers: "on",
              wordWrap: "on",
            }}
          />
        </div>

        {/* Consola de salida (40%) */}
        <div className="w-full md:w-[40%] flex flex-col bg-gray-900 text-gray-300">
          <div className="p-2 border-b border-gray-700 text-xs font-mono text-gray-500 flex justify-between">
            <span>SALIDA</span>
            {output && (
              <button onClick={() => setOutput("")} className="text-xs text-gray-400 hover:text-gray-200">
                Limpiar
              </button>
            )}
          </div>
          <div className="flex-1 p-3 overflow-y-auto text-sm font-mono">
            <pre className="whitespace-pre-wrap">{output || "// Escribe y haz clic en Ejecutar para ver tu texto aquí"}</pre>
          </div>
        </div>
      </div>
    </div>
  )
}
