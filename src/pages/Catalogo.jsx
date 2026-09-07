import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import { getProductos } from "../services/api";

function Catalogo() {
    const [productos, setProductos] = useState([]);
    const [carrito, setCarrito] = useState([]);
    const [mostrarCarrito, setMostrarCarrito] = useState(false);

    const [page, setPage] = useState(0);
    const [busqueda, setBusqueda] = useState("");
    const [haySiguiente, setHaySiguiente] = useState(false);

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setIsLoading(true);
        setError(null);

        getProductos({
            page,
            limit: 2,
            nombre: busqueda
        })
            .then((resultado) => {
                setProductos(resultado.productos);
                setHaySiguiente(resultado.haySiguiente);
            })
            .catch((error) => {
                setError(error.message);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [page, busqueda]);

    const agregarAlCarrito = (producto) => {
        setCarrito((carritoActual) => {
            const productoExistente = carritoActual.find(
                (item) => item.id === producto.id
            );

            if (productoExistente) {
                return carritoActual.map((item) =>
                    item.id === producto.id
                        ? {
                            ...item,
                            cantidad: item.cantidad + 1
                        }
                        : item
                );
            }

            return [
                ...carritoActual,
                {
                    ...producto,
                    cantidad: 1
                }
            ];
        });
    };

    const eliminarDelCarrito = (id) => {
        setCarrito((carritoActual) =>
            carritoActual.filter(
                (producto) => producto.id !== id
            )
        );
    };

    const cambiarCantidad = (id, cantidad) => {
        if (cantidad < 1) return;

        setCarrito((carritoActual) =>
            carritoActual.map((producto) =>
                producto.id === id
                    ? {
                        ...producto,
                        cantidad
                    }
                    : producto
            )
        );
    };

    const finalizarCompra = () => {
        if (carrito.length === 0) {
            alert("El carrito está vacío");
            return;
        }

        alert("¡Compra finalizada correctamente!");

        setCarrito([]);
        setMostrarCarrito(false);
    };

    const handleBusqueda = (e) => {
        setPage(0);
        setBusqueda(e.target.value);
    };

    const totalCarrito = carrito.reduce(
        (total, producto) =>
            total +
            producto.precio_final * producto.cantidad,
        0
    );

    if (isLoading) {
        return (
            <p className="p-8">
                Cargando productos...
            </p>
        );
    }

    if (error) {
        return (
            <p className="p-8">
                {error}
            </p>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <header className="mb-8 flex items-center justify-between">
                <h1 className="text-3xl font-bold">
                    Mi Tienda
                </h1>

                <button
                    onClick={() =>
                        setMostrarCarrito(!mostrarCarrito)
                    }
                    className="rounded-lg bg-black px-4 py-2 text-white"
                >
                    🛒 Ver carrito (
                    {carrito.reduce(
                        (total, producto) =>
                            total + producto.cantidad,
                        0
                    )}
                    )
                </button>
            </header>

            {!mostrarCarrito ? (
                <>
                    <div className="mb-8">
                        <input
                            type="text"
                            placeholder="Buscar productos..."
                            value={busqueda}
                            onChange={handleBusqueda}
                            className="w-full rounded-lg border bg-white p-3 outline-none"
                        />
                    </div>

                    {productos.length === 0 ? (
                        <p className="text-center text-gray-600">
                            No se encontraron productos.
                        </p>
                    ) : (
                        <main className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            {productos.map((producto) => (
                                <ProductCard
                                    key={producto.id}
                                    producto={producto}
                                    onAgregar={agregarAlCarrito}
                                />
                            ))}
                        </main>
                    )}

                    <div className="mt-8 flex items-center justify-center gap-4">
                        <button
                            disabled={page === 0}
                            onClick={() => setPage(page - 1)}
                            className="rounded-lg bg-black px-4 py-2 text-white disabled:cursor-not-allowed disabled:bg-gray-400"
                        >
                            Anterior
                        </button>

                        <span>
                            Página {page + 1}
                        </span>

                        <button
                            disabled={!haySiguiente}
                            onClick={() => setPage(page + 1)}
                            className="rounded-lg bg-black px-4 py-2 text-white disabled:cursor-not-allowed disabled:bg-gray-400"
                        >
                            Siguiente
                        </button>
                    </div>
                </>
            ) : (
                <div className="rounded-lg bg-white p-6 shadow-md">
                    <div className="mb-6 flex items-center justify-between">
                        <h2 className="text-2xl font-bold">
                            🛒 Carrito
                        </h2>

                        <button
                            onClick={() =>
                                setMostrarCarrito(false)
                            }
                            className="rounded-lg bg-gray-200 px-4 py-2"
                        >
                            Volver a productos
                        </button>
                    </div>

                    {carrito.length === 0 ? (
                        <p className="text-gray-600">
                            El carrito está vacío.
                        </p>
                    ) : (
                        <>
                            <div className="space-y-4">
                                {carrito.map((producto) => (
                                    <div
                                        key={producto.id}
                                        className="flex items-center justify-between rounded-lg border p-4"
                                    >
                                        <div>
                                            <h3 className="font-bold">
                                                {producto.nombre}
                                            </h3>

                                            <p>
                                                ${producto.precio_final}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() =>
                                                    cambiarCantidad(
                                                        producto.id,
                                                        producto.cantidad - 1
                                                    )
                                                }
                                                className="rounded bg-gray-200 px-3 py-1"
                                            >
                                                -
                                            </button>

                                            <span>
                                                {producto.cantidad}
                                            </span>

                                            <button
                                                onClick={() =>
                                                    cambiarCantidad(
                                                        producto.id,
                                                        producto.cantidad + 1
                                                    )
                                                }
                                                className="rounded bg-gray-200 px-3 py-1"
                                            >
                                                +
                                            </button>

                                            <button
                                                onClick={() =>
                                                    eliminarDelCarrito(
                                                        producto.id
                                                    )
                                                }
                                                className="rounded bg-red-500 px-3 py-1 text-white"
                                            >
                                                Eliminar
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-8 border-t pt-6">
                                <h3 className="mb-4 text-xl font-bold">
                                    Total: $
                                    {totalCarrito.toFixed(2)}
                                </h3>

                                <button
                                    onClick={finalizarCompra}
                                    className="rounded-lg bg-black px-6 py-3 font-semibold text-white"
                                >
                                    Finalizar compra
                                </button>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}

export default Catalogo;