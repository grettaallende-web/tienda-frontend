export default function ProductCard({ producto }) {
  return (
    <div className="overflow-hidden rounded-lg bg-white shadow-md">

      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900">
          {producto.nombre}
        </h3>

        <p className="mt-2 text-xl font-bold text-gray-900">
          ${producto.precio_final}
        </p>

        <p className="mt-2 text-gray-600">
          {producto.cuotas_cantidad} cuotas de ${producto.cuotas_valor}
        </p>

        <p className="mt-2 text-gray-600">
          Garantía: {producto.garantia_meses} meses
        </p>

        <button className="mt-4 w-full rounded-lg bg-black px-4 py-2 font-semibold text-white transition hover:bg-gray-800">
          Agregar al carrito
        </button>
      </div>

    </div>
  )
}
