"use client"
import { useState } from "react"
import MonacoEditor from "@monaco-editor/react"
import { Play, RotateCw } from "lucide-react"

// Mock de la API de Clerk
const mockClerk = {
  user: {
    id: "user_789",
    firstName: "Alex",
    lastName: "Developer",
    emailAddresses: [{ emailAddress: "alex@dev.com" }],
    publicMetadata: {
      skills: ["React", "Node.js"],
      securityClearance: 3,
      documentsVerified: true
    }
  }
}

export function CodeEditor() {
  const [code, setCode] = useState("")
  const [output, setOutput] = useState("")
  const [isValid, setIsValid] = useState<boolean | null>(null)
  const [isExecuting, setIsExecuting] = useState(false)

  const executeCode = () => {
    setIsExecuting(true)
    setOutput("Ejecutando...")
    
    try {
      // Creamos un entorno con las importaciones simuladas
      const result = new Function(`
        const { useUser } = {
          useUser: () => ({ user: ${JSON.stringify(mockClerk.user)} })
        };
        ${code}
      `)()
      
      setOutput(typeof result === 'boolean' ? 
        `Resultado: ${result}` : 
        JSON.stringify(result, null, 2))
      setIsValid(typeof result === 'boolean' ? result : null)
    } catch (error: any) {
      setOutput(`Error: ${error.message}`)
      setIsValid(null)
    } finally {
      setIsExecuting(false)
    }
  }

  return (
    <div className="flex flex-col h-screen bg-gray-900 border border-gray-700 rounded-lg overflow-hidden">
      {/* Top Bar with Run Button */}
      <div className="bg-gray-800 p-2 flex justify-between items-center border-b border-gray-700">
        <div className="text-sm font-mono text-gray-300">
          Editor Clerk - Usuario: {mockClerk.user.firstName} {mockClerk.user.lastName}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setCode("")}
            className="flex items-center gap-1 px-3 py-1 bg-gray-700 text-gray-300 rounded text-sm"
          >
            <RotateCw className="h-4 w-4" />
            Limpiar
          </button>
          <button
            onClick={executeCode}
            disabled={isExecuting}
            className={`flex items-center gap-1 px-3 py-1 rounded text-sm ${
              isExecuting ? 'bg-blue-700 text-blue-200' : 'bg-blue-600 hover:bg-blue-500 text-white'
            }`}
          >
            <Play className="h-4 w-4" />
            Ejecutar
          </button>
        </div>
      </div>

      {/* Editor and Output */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Editor - 70% width */}
        <div className="flex-1 min-h-[200px] border-r border-gray-700">
          <MonacoEditor
            height="100%"
            defaultLanguage="javascript"
            theme="vs-dark"
            value={code}
            onChange={(value) => setCode(value || '')}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              scrollBeyondLastLine: false,
              automaticLayout: true,
            }}
          />
        </div>

        {/* Output Console - 30% width */}
        <div className={`w-full md:w-[30%] flex flex-col border-t md:border-t-0 border-gray-700 ${
          isValid === true ? 'bg-green-900/20 text-green-400' :
          isValid === false ? 'bg-red-900/20 text-red-400' :
          'bg-gray-800/50 text-gray-400'
        }`}>
          <div className="p-2 border-b border-gray-700 text-xs font-mono text-gray-500">
            CONSOLA
          </div>
          <div className="flex-1 p-3 overflow-y-auto text-sm font-mono">
            <pre>{output || "Ejecuta tu código para ver el resultado"}</pre>
          </div>
        </div>
      </div>
    </div>
  )
}
