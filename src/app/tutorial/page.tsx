export default function TutorialScreen() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-4xl mb-8 font-bold text-center">¡Bienvenido a Clerk Control!</h1>

      <div className="max-w-4xl mx-auto space-y-6">
        <div className="p-6 bg-gray-800 rounded-lg">
          <h2 className="text-2xl mb-4 text-purple-400">📋 Mecánica del Juego</h2>
          <p>
            Eres el <span className="text-yellow-400 font-semibold">verificador oficial</span> de Midulandia, el paraíso de los programadores.
            Tu deber es aceptar o rechazar <span className="text-cyan-400 font-semibold">Midulovers</span> usando comandos SQL.
          </p>
          <p className="mt-4">
            Usa la terminal integrada y aprende SQL mientras decides su destino.
          </p>
        </div>

        <div className="p-6 bg-gray-800 rounded-lg">
          <h2 className="text-2xl mb-4 text-blue-400">🗓️ Progresión de Aprendizaje</h2>
          <div className="space-y-4">

            <div className="bg-gray-700 p-4 rounded">
              <h3 className="text-xl font-bold text-yellow-300">📅 Día 1 - Introducción</h3>
              <p>Comienza aprendiendo <code className="bg-black px-2 py-1 rounded">SELECT * FROM midulovers</code> y cómo usar <code className="bg-black px-2 py-1 rounded">WHERE</code> para filtrar datos.</p>
              <p className="mt-2 text-sm text-gray-300">Objetivo: Verifica identidad, país y profesión.</p>
            </div>

            <div className="bg-gray-700 p-4 rounded">
              <h3 className="text-xl font-bold text-green-300">📅 Día 2 - Relacionamiento</h3>
              <p>Aprende a hacer <code className="bg-black px-2 py-1 rounded">JOIN</code> entre tablas como <code>documentos</code> y <code>verificaciones</code>.</p>
              <p className="mt-2 text-sm text-gray-300">Objetivo: Verifica documentos y autenticidad.</p>
            </div>

            <div className="bg-gray-700 p-4 rounded">
              <h3 className="text-xl font-bold text-pink-300">📅 Día 3 - Seguridad y ética</h3>
              <p>Consulta <code className="bg-black px-2 py-1 rounded">antecedentes</code> y evalúa moralmente si debe ingresar.</p>
              <p className="mt-2 text-sm text-gray-300">Objetivo: Analiza antecedentes penales, éticos y profesionales.</p>
            </div>

            <div className="bg-gray-700 p-4 rounded">
              <h3 className="text-xl font-bold text-cyan-300">📅 Día 4 - Manipulación avanzada</h3>
              <p>Comienza a usar <code className="bg-black px-2 py-1 rounded">UPDATE</code> y <code className="bg-black px-2 py-1 rounded">DELETE</code> para modificar decisiones y corregir errores.</p>
              <p className="mt-2 text-sm text-gray-300">Objetivo: Aplicar cambios según tu criterio moral o legal.</p>
            </div>

            <div className="bg-gray-700 p-4 rounded">
              <h3 className="text-xl font-bold text-red-300">📅 Día 5 - SQL experto</h3>
              <p>Domina <code className="bg-black px-2 py-1 rounded">GROUP BY</code>, subconsultas, múltiples <code>JOIN</code> y casos especiales.</p>
              <p className="mt-2 text-sm text-gray-300">Objetivo: Evalúa a múltiples candidatos en conjunto y toma decisiones globales.</p>
            </div>

          </div>
        </div>

        <div className="text-center mt-8">
          <button className="bg-green-600 hover:bg-green-700 px-10 py-4 rounded-lg text-2xl font-bold transition">
            ¡Comenzar jornada 1! →
          </button>
          <p className="text-sm mt-2 text-gray-400">Prepárate para tomar decisiones difíciles... y aprender SQL como un pro.</p>
        </div>
      </div>
    </div>
  )
}
