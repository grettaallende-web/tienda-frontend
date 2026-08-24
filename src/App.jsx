import { useEffect, useState } from 'react'
import ProductCard from './components/ProductCard'
import { getProductos } from './services/api'

function App() {
  const [productos, setProductos] = useState([])

  useEffect(() => {
    getProductos().then(setProductos)
  }, [])

  return (
    <div className="min-h-screen bg-gray-100 p-8">

      <header className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">
          Mi Tienda
        </h1>

        <button className="rounded-lg bg-black px-4 py-2 text-white">
          🛒 Carrito
        </button>
      </header>

      <div className="mb-8">
        <input
          type="text"
          placeholder="Buscar productos..."
          className="w-full rounded-lg border bg-white p-3 outline-none"
        />
      </div>

      <main className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {productos.map((p) => (
          <ProductCard key={p.id} producto={p} />
        ))}
      </main>

    </div>
  )
}

export default App