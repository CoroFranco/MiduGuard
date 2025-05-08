export default function TutorialScreen() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-4xl mb-8 font-bold text-center">¡Bienvenido a Clerk Control!</h1>
      
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="p-6 bg-gray-800 rounded-lg">
          <h2 className="text-2xl mb-4 text-purple-400">📋 Mecánica Básica</h2>
          <p>Cada día llegarán <span className="text-yellow-400">Midulovers</span> solicitando acceso a Midulandia.</p>
          <div className="my-4 p-4 bg-gray-700 rounded">
            <span className="font-mono bg-black p-2 rounded">verify email</span> → Verifica correo confirmado
          </div>
          <p>Usa comandos en la consola para revisar sus credenciales usando la API de Clerk.</p>
        </div>

        <div className="p-6 bg-gray-800 rounded-lg">
          <h2 className="text-2xl mb-4 text-blue-400">🚀 Progresión</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-gray-700 rounded">
              <h3 className="font-bold mb-2">Día 1</h3>
              <p>Verificación básica de email y nombre</p>
            </div>
            <div className="p-4 bg-gray-700 rounded">
              <h3 className="font-bold mb-2">Día 3</h3>
              <p>Roles de usuario y 2FA</p>
            </div>
            <div className="p-4 bg-gray-700 rounded">
              <h3 className="font-bold mb-2">Día 5</h3>
              <p>Detección de actividad sospechosa</p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <button className="bg-green-600 hover:bg-green-700 px-8 py-3 rounded-lg text-xl font-bold">
            ¡Comenzar! →
          </button>
        </div>
      </div>
    </div>
  )
}
