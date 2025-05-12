"use client"
import React, { useState } from "react"
import { basicSetup } from "codemirror"
import { EditorView, keymap } from "@codemirror/view"
import { defaultKeymap } from "@codemirror/commands"
import { sql } from "@codemirror/lang-sql"
import { oneDark } from "@codemirror/theme-one-dark"
import { Play, RotateCw } from "lucide-react"

export const CodeEditor: React.FC = () => {
  const initialCode = `-- Escribe tu codigo SQL aqui`

  const [code, setCode] = useState<string>(initialCode)
  const [output, setOutput] = useState<string>("")
  const [editorView, setEditorView] = useState<EditorView | null>(null)

  const createEditor = (el: HTMLDivElement | null) => {
    if (el && !editorView) {
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
      setEditorView(view)
    }
  }

  const executeCode = async (): void => {
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
      } else {
        setOutput("No se encontraron datos.")
      }
    } catch (error) {
      setOutput("Error al ejecutar el código. Inténtalo de nuevo." + error)
    }
  }

  const resetCode = (): void => {
    if (editorView) {
      editorView.dispatch({
        changes: {
          from: 0,
          to: editorView.state.doc.length,
          insert: initialCode
        }
      })
    }
    setOutput("")
  }

  return (
    <div className="flex flex-col h-[500px] bg-gray-900 border border-gray-700 rounded-lg overflow-hidden">
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
            <pre className="whitespace-pre-wrap">{output || "// Aqui veras los resultados de tus consultas"}</pre>
          </div>
        </div>
      </div>
    </div>
  )
}
