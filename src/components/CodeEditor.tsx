"use client"
import React, { useRef, useState } from "react"
import { basicSetup } from "codemirror"
import { EditorView, keymap } from "@codemirror/view"
import { defaultKeymap } from "@codemirror/commands"
import { sql } from "@codemirror/lang-sql"
import { oneDark } from "@codemirror/theme-one-dark"
import { Play, RotateCw } from "lucide-react"
import { GameModal } from "@/components/GameModal"
import { useUser } from "@clerk/nextjs"

export const CodeEditor: React.FC<{
  onQueryExecuted?: (wasExecuted: boolean) => void
}> = ({ onQueryExecuted }) => {
  const initialCode = `-- Escribe tu codigo SQL aqui`

  const [code, setCode] = useState<string>(initialCode)
  const [output, setOutput] = useState<string>("")
  const [modalOpen, setModalOpen] = useState({ 
    danger: false, 
    noob: false, 
  })
  const [dangerousQuery, setDangerousQuery] = useState<string>("")
  const editorRef = useRef<EditorView | null>(null)
  const {user} = useUser()

  const createEditor = (el: HTMLDivElement | null) => {
    if (el && !editorRef.current) {
      const view = new EditorView({
        doc: initialCode,
        extensions: [
          basicSetup,
          sql(),
          oneDark,
          keymap.of(defaultKeymap),
          EditorView.updateListener.of((update) => {
            if (update.docChanged) {
              setCode(update.state.doc.toString())
            }
          })
        ],
        parent: el
      })
      editorRef.current = view
    }
  }

  const isDangerousQuery = (query: string): boolean => {
    const dangerousKeywords = [
      'DROP', 'TRUNCATE', 'DELETE FROM', 'UPDATE', 'ALTER', 
      'CREATE DATABASE', 'DROP DATABASE', 'RENAME', 'MODIFY',
      'GRANT', 'REVOKE', 'INSERT INTO'
    ]
    
    const uppercaseQuery = query.toUpperCase()
    return dangerousKeywords.some(keyword => 
      uppercaseQuery.includes(keyword) && 
      !uppercaseQuery.includes('-- ' + keyword) // Ignora comentarios
    )
  }

  const executeCode = async (): Promise<void> => {
    const normalized = code.trim().replace(/\s+/g, ' ').toUpperCase()
    if (isDangerousQuery(code)) {
      setDangerousQuery(code)
      setModalOpen(prev => ({...prev, danger: true}))
      return
    }

    if (normalized.includes('SELECT * FROM MIDULOVERS') && !normalized.includes('WHERE') && !normalized.includes('JOIN')) {
      setModalOpen(prev => ({...prev, noob: true}))
    }

    setOutput("Ejecutando código...")
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
        setOutput(JSON.stringify(data.rows, null, 2))
        if (onQueryExecuted) {
        onQueryExecuted(true)
    }
      } else {
        setOutput("No se encontraron datos.")
      }

    
    } catch (error) {
      setOutput("Error al ejecutar el código. Inténtalo de nuevo. " + error)
    }
  }

  const resetCode = (): void => {
    if (editorRef.current) {
      editorRef.current.dispatch({
        changes: {
          from: 0,
          to: editorRef.current.state.doc.length,
          insert: initialCode
        }
      })
      setCode(initialCode)
    }
    setOutput("")
  }

  const closeModal = () => {
    setModalOpen(prev => ({...prev, danger:false, noob:false}))
  }

  const DangerContent = () => (
    <div className="flex flex-col gap-4">
      <p className="text-base">¿Qué le estás intentando hacer a mi base de datos? 👀 Te estoy vigilando y te voy a banear si sigues así.</p>
      
      <div className="mt-2 p-3 bg-gray-800 rounded-md text-sm overflow-x-auto">
        <code className="text-rose-400">{dangerousQuery}</code>
      </div>
    </div>
  )
  const NoobContent = () => (
    <div className="flex flex-col gap-4">
        <p>¿Acaso piensas revisar tres millones de MiduLovers uno por uno? 🤯</p>
        <p>
          Prueba agregando un <code className="font-mono bg-gray-800 px-1 rounded">WHERE</code>, por ejemplo:
        </p>
        <pre className="mt-2 p-2 bg-gray-800 rounded text-sm font-mono text-wrap">
          {`SELECT * FROM midulovers WHERE nombre = '${user?.username}'`};
        </pre>
        <p>
         Recuerda usar el nombre exactamente como aparece, o bien agregar COLLATE NOCASE al final de la consulta para que no distinga mayúsculas de minúsculas.
        </p>
      </div>
  )

  return (
    <div className="flex flex-col h-full bg-gray-900 border border-gray-700 rounded-lg overflow-hidden">
      <GameModal
        isOpen={modalOpen.danger}
        onClose={closeModal}
        title="¡Alto ahí!"
        type="warning"
        content={<DangerContent />}
      />
      <GameModal
        isOpen={modalOpen.noob}
        onClose={closeModal}
        title="Que ???!!!!"
        type="info"
        content={<NoobContent />}
      />
      
      <div className="bg-gray-800 p-2 flex justify-between items-center border-b border-gray-700">
        <div className="text-sm font-mono text-gray-300">SQL Editor</div>
        <div className="flex gap-2">
          <button
            onClick={resetCode}
            className="cursor-pointer flex items-center gap-1 px-3 py-1 bg-gray-700 text-gray-300 rounded text-sm"
          >
            <RotateCw className="h-4 w-4" />
            Reiniciar
          </button>
          <button
            onClick={executeCode}
            className="cursor-pointer flex items-center gap-1 px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded text-sm"
          >
            <Play className="h-4 w-4" />
            Ejecutar
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row">
        <div className="flex-1 min-h-[200px] border-r border-gray-700">
          <div 
            ref={createEditor} 
            className="h-full w-full"
          />
        </div>

        <div className="w-full md:w-[40%] flex flex-col bg-gray-900 text-gray-300">
          <div className="p-2 border-b border-gray-700 text-xs font-mono text-gray-500 flex justify-between">
            <span>RESULTADOS</span>
            {output && (
              <button onClick={() => setOutput("")} className="text-xs text-gray-400 hover:text-gray-200">
                Limpiar
              </button>
            )}
          </div>
          <div className="flex-1 p-3 overflow-y-auto text-sm font-mono">
            <pre className="whitespace-pre-wrap">{output || "// Aquí verás los resultados de tus consultas"}</pre>
          </div>
        </div>
      </div>
    </div>
  )
}
