import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import ProductCard from "../components/ProductCard";

import {
    getProductos,
    crearPedido
} from "../services/api";

import { useAuth } from "../context/AuthContext";


function Catalogo() {

    const navigate = useNavigate();

    const { usuario } = useAuth();

    const [productos, setProductos] = useState([]);
    const [carrito, setCarrito] = useState([]);

    const [mostrarCarrito, setMostrarCarrito] =
        useState(false);

    const [busqueda, setBusqueda] =
        useState("");

    const [page, setPage] =
        useState(0);

    const [haySiguiente, setHaySiguiente] =
        useState(false);

    const [cargando, setCargando] =
        useState(true);

    const [error, setError] =
        useState("");


    /* =========================================
       CARGAR PRODUCTOS
    ========================================== */

    async function cargarProductos() {

        try {

            setCargando(true);
            setError("");

            const resultado =
                await getProductos({
                    page,
                    limit: 2,
                    nombre: busqueda
                });

            setProductos(
                resultado.productos
            );

            setHaySiguiente(
                resultado.haySiguiente
            );

        } catch (error) {

            setError(error.message);

        } finally {

            setCargando(false);

        }
    }


    useEffect(() => {
        cargarProductos();
    }, [page, busqueda]);


    /* =========================================
       AGREGAR AL CARRITO
    ========================================== */

    function agregarAlCarrito(producto) {

        setCarrito((carritoActual) => {

            const existente =
                carritoActual.find(
                    (item) =>
                        item.id === producto.id
                );

            if (existente) {

                if (
                    existente.cantidad >=
                    producto.stock
                ) {

                    alert(
                        "No hay más stock disponible."
                    );

                    return carritoActual;
                }

                alert(
                    `"${producto.nombre}" se agregó al carrito.`
                );

                return carritoActual.map(
                    (item) =>
                        item.id === producto.id
                            ? {
                                ...item,
                                cantidad:
                                    item.cantidad + 1
                            }
                            : item
                );
            }

            alert(
                `"${producto.nombre}" se agregó al carrito.`
            );

            return [
                ...carritoActual,
                {
                    ...producto,
                    cantidad: 1
                }
            ];
        });
    }


    /* =========================================
       ELIMINAR
    ========================================== */

    function eliminarDelCarrito(id) {

        setCarrito(
            (carritoActual) =>
                carritoActual.filter(
                    (producto) =>
                        producto.id !== id
                )
        );
    }


    /* =========================================
       CAMBIAR CANTIDAD
    ========================================== */

    function cambiarCantidad(
        id,
        cantidad
    ) {

        if (cantidad < 1) {
            return;
        }

        setCarrito(
            (carritoActual) =>
                carritoActual.map(
                    (producto) => {

                        if (
                            producto.id !== id
                        ) {
                            return producto;
                        }

                        if (
                            cantidad >
                            producto.stock
                        ) {

                            alert(
                                `Solo quedan ${producto.stock} unidades.`
                            );

                            return producto;
                        }

                        return {
                            ...producto,
                            cantidad
                        };
                    }
                )
        );
    }


    /* =========================================
       TOTAL
    ========================================== */

    const totalCarrito =
        carrito.reduce(
            (total, producto) => {

                return (
                    total +
                    Number(
                        producto.precio_final
                    ) *
                    Number(
                        producto.cantidad
                    )
                );

            },
            0
        );


    /* =========================================
       CANTIDAD CARRITO
    ========================================== */

    const cantidadCarrito =
        carrito.reduce(
            (total, producto) =>
                total +
                Number(producto.cantidad),
            0
        );


    /* =========================================
       FINALIZAR COMPRA
    ========================================== */

    async function finalizarCompra() {

        if (carrito.length === 0) {

            alert(
                "El carrito está vacío."
            );

            return;
        }


        /* Si no está logueado,
           lo mandamos al login */

        if (!usuario) {

            alert(
                "Para finalizar la compra tenés que iniciar sesión."
            );

            navigate("/login");

            return;
        }


        try {

            const pedido =
                await crearPedido(
                    carrito
                );

            alert(
                `¡Compra realizada correctamente!\n\n` +
                `Pedido: #${pedido.id}\n` +
                `Total: $${Number(
                    pedido.total
                ).toLocaleString("es-AR", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                })}`
            );

            setCarrito([]);

            setMostrarCarrito(false);

            await cargarProductos();

        } catch (error) {

            alert(error.message);

        }
    }


    /* =========================================
       BUSCADOR
    ========================================== */

    function cambiarBusqueda(event) {

        setBusqueda(
            event.target.value
        );

        setPage(0);
    }


    /* =========================================
       PANTALLA CARGANDO
    ========================================== */

    if (cargando) {

        return (
            <main className="catalogo">

                <h1>
                    Mi Tienda
                </h1>

                <p>
                    Cargando productos...
                </p>

            </main>
        );
    }


    /* =========================================
       PANTALLA ERROR
    ========================================== */

    if (error) {

        return (
            <main className="catalogo">

                <h1>
                    Mi Tienda
                </h1>

                <div className="mensaje-error">
                    {error}
                </div>

                <button
                    onClick={cargarProductos}
                >
                    Intentar nuevamente
                </button>

            </main>
        );
    }


    /* =========================================
       PÁGINA
    ========================================== */

    return (
        <main className="catalogo">

            {/* ===================================
          ENCABEZADO
      =================================== */}

            <header className="catalogo-header">

                <h1>
                    Mi Tienda
                </h1>

                <div className="acciones-header">

                    {usuario ? (

                        <button
                            className="boton-cuenta"
                            onClick={() =>
                                navigate("/mi-cuenta")
                            }
                        >
                            👤 Mi cuenta
                        </button>

                    ) : (

                        <button
                            className="boton-cuenta"
                            onClick={() =>
                                navigate("/login")
                            }
                        >
                            Iniciar sesión
                        </button>

                    )}

                    <button
                        className="boton-carrito-header"
                        onClick={() =>
                            setMostrarCarrito(
                                !mostrarCarrito
                            )
                        }
                    >
                        🛒 Ver carrito (
                        {cantidadCarrito}
                        )
                    </button>

                </div>

            </header>


            {/* ===================================
          CARRITO
      =================================== */}

            {mostrarCarrito ? (

                <section className="carrito">

                    <div className="carrito-header">

                        <h2>
                            🛒 Carrito
                        </h2>

                        <button
                            className="boton-volver-productos"
                            onClick={() =>
                                setMostrarCarrito(false)
                            }
                        >
                            Volver a productos
                        </button>

                    </div>


                    {carrito.length === 0 ? (

                        <p>
                            El carrito está vacío.
                        </p>

                    ) : (

                        <>

                            {carrito.map(
                                (producto) => {

                                    const precio =
                                        Number(
                                            producto.precio_final
                                        );

                                    return (

                                        <div
                                            className="item-carrito"
                                            key={producto.id}
                                        >

                                            <div>

                                                <strong>
                                                    {producto.nombre}
                                                </strong>

                                                <p>
                                                    $
                                                    {precio.toLocaleString(
                                                        "es-AR",
                                                        {
                                                            minimumFractionDigits: 2,
                                                            maximumFractionDigits: 2
                                                        }
                                                    )}
                                                </p>

                                            </div>


                                            <div className="controles-carrito">

                                                <button
                                                    onClick={() =>
                                                        cambiarCantidad(
                                                            producto.id,
                                                            producto.cantidad - 1
                                                        )
                                                    }
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
                                                >
                                                    +
                                                </button>


                                                <button
                                                    onClick={() =>
                                                        eliminarDelCarrito(
                                                            producto.id
                                                        )
                                                    }
                                                >
                                                    Eliminar
                                                </button>

                                            </div>

                                        </div>

                                    );
                                }
                            )}


                            <div className="total-carrito">

                                Total: $
                                {totalCarrito.toLocaleString(
                                    "es-AR",
                                    {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2
                                    }
                                )}

                            </div>


                            <button
                                className="boton-finalizar"
                                onClick={finalizarCompra}
                            >
                                Finalizar compra
                            </button>

                        </>

                    )}

                </section>

            ) : (

                /* =================================
                   PRODUCTOS
                ================================= */

                <>

                    <input
                        className="buscador"
                        type="text"
                        placeholder="Buscar productos..."
                        value={busqueda}
                        onChange={cambiarBusqueda}
                    />


                    {productos.length === 0 ? (

                        <div className="sin-productos">
                            No se encontraron productos.
                        </div>

                    ) : (

                        <section className="productos-grid">

                            {productos.map(
                                (producto) => (

                                    <ProductCard
                                        key={producto.id}
                                        producto={producto}
                                        onAgregar={
                                            agregarAlCarrito
                                        }
                                    />

                                )
                            )}

                        </section>

                    )}


                    {/* =================================
              PAGINACIÓN
          ================================= */}

                    <div className="paginacion">

                        <button
                            disabled={page === 0}
                            onClick={() =>
                                setPage(
                                    page - 1
                                )
                            }
                        >
                            Anterior
                        </button>


                        <span>
                            Página {page + 1}
                        </span>


                        <button
                            disabled={!haySiguiente}
                            onClick={() =>
                                setPage(
                                    page + 1
                                )
                            }
                        >
                            Siguiente
                        </button>

                    </div>

                </>

            )}

        </main>
    );
}

export default Catalogo;