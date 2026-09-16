import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import ProductCard from "../components/ProductCard";

import {
    getProductos,
    crearPedido
} from "../services/api";

import { useAuth } from "../context/AuthContext";
import { useCarrito } from "../context/CarritoContext";


function Catalogo() {

    const navigate = useNavigate();

    const { usuario } = useAuth();

    const {
        items: carrito,
        aumentar,
        disminuir,
        quitar,
        vaciar,
        total: totalCarrito,
        cantidadTotal
    } = useCarrito();


    const [productos, setProductos] =
        useState([]);

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

    const [enviando, setEnviando] =
        useState(false);


    // =========================================
    // CARGAR PRODUCTOS
    // =========================================

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

            setError(
                error.message
            );

        } finally {

            setCargando(false);

        }

    }


    useEffect(() => {

        cargarProductos();

    }, [page, busqueda]);


    // =========================================
    // FINALIZAR COMPRA
    // =========================================

    async function finalizarCompra() {

        if (carrito.length === 0) {

            alert(
                "El carrito está vacío."
            );

            return;
        }


        if (!usuario) {

            alert(
                "Para finalizar la compra tenés que iniciar sesión."
            );

            navigate("/login");

            return;
        }


        if (enviando) {
            return;
        }


        try {

            setEnviando(true);

            const pedido =
                await crearPedido(carrito);


            alert(
                `¡Compra realizada correctamente!\n\n` +
                `Pedido: #${pedido.id}\n` +
                `Total: $${Number(
                    pedido.total
                ).toLocaleString(
                    "es-AR",
                    {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    }
                )}`
            );


            vaciar();

            setMostrarCarrito(false);

            await cargarProductos();

        } catch (error) {

            alert(
                error.message
            );

        } finally {

            setEnviando(false);

        }

    }


    // =========================================
    // BUSCADOR
    // =========================================

    function cambiarBusqueda(event) {

        setBusqueda(
            event.target.value
        );

        setPage(0);

    }


    // =========================================
    // CARGANDO
    // =========================================

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


    // =========================================
    // ERROR
    // =========================================

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


    // =========================================
    // PÁGINA
    // =========================================

    return (
        <main className="catalogo">


            {/* =================================
                ENCABEZADO
            ================================= */}

            <header className="catalogo-header">

                <h1>
                    Mi Tienda
                </h1>


                <div className="acciones-header">

                    {usuario ? (

                        <button
                            className="boton-cuenta"
                            onClick={() =>
                                navigate(
                                    "/mi-cuenta"
                                )
                            }
                        >
                            👤 Mi cuenta
                        </button>

                    ) : (

                        <button
                            className="boton-cuenta"
                            onClick={() =>
                                navigate(
                                    "/login"
                                )
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
                        {cantidadTotal}
                        )
                    </button>

                </div>

            </header>


            {/* =================================
                CARRITO
            ================================= */}

            {mostrarCarrito ? (

                <section className="carrito">


                    <div className="carrito-header">

                        <h2>
                            🛒 Carrito
                        </h2>


                        <button
                            className="boton-volver-productos"
                            onClick={() =>
                                setMostrarCarrito(
                                    false
                                )
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
                                            producto.precio
                                        );


                                    const cantidad =
                                        Number(
                                            producto.cantidad
                                        );


                                    const subtotal =
                                        precio *
                                        cantidad;


                                    return (

                                        <div
                                            className="item-carrito"
                                            key={
                                                producto.producto_id
                                            }
                                        >


                                            {/* INFORMACIÓN */}

                                            <div>

                                                <strong>
                                                    {
                                                        producto.nombre
                                                    }
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


                                                <p>
                                                    Cantidad:{" "}
                                                    {cantidad}
                                                </p>


                                                <p>
                                                    Subtotal: $
                                                    {subtotal.toLocaleString(
                                                        "es-AR",
                                                        {
                                                            minimumFractionDigits: 2,
                                                            maximumFractionDigits: 2
                                                        }
                                                    )}
                                                </p>

                                            </div>


                                            {/* CONTROLES */}

                                            <div className="controles-carrito">


                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        disminuir(
                                                            producto.producto_id
                                                        )
                                                    }
                                                >
                                                    −
                                                </button>


                                                <span>
                                                    {cantidad}
                                                </span>


                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        aumentar(
                                                            producto.producto_id
                                                        )
                                                    }
                                                >
                                                    +
                                                </button>


                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        quitar(
                                                            producto.producto_id
                                                        )
                                                    }
                                                >
                                                    ❌ Eliminar
                                                </button>


                                            </div>

                                        </div>

                                    );

                                }
                            )}


                            {/* TOTAL */}

                            <div className="total-carrito">

                                <strong>

                                    Total: $
                                    {Number(
                                        totalCarrito
                                    ).toLocaleString(
                                        "es-AR",
                                        {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2
                                        }
                                    )}

                                </strong>

                            </div>


                            {/* FINALIZAR */}

                            <button
                                className="boton-finalizar"
                                onClick={
                                    finalizarCompra
                                }
                                disabled={
                                    enviando
                                }
                            >

                                {enviando
                                    ? "Procesando..."
                                    : "Finalizar compra"}

                            </button>

                        </>

                    )}

                </section>

            ) : (

                <>


                    {/* =================================
                        BUSCADOR
                    ================================= */}

                    <input
                        className="buscador"
                        type="text"
                        placeholder="Buscar productos..."
                        value={busqueda}
                        onChange={
                            cambiarBusqueda
                        }
                    />


                    {/* =================================
                        PRODUCTOS
                    ================================= */}

                    {productos.length === 0 ? (

                        <div className="sin-productos">
                            No se encontraron productos.
                        </div>

                    ) : (

                        <section className="productos-grid">

                            {productos.map(
                                (producto) => (

                                    <ProductCard
                                        key={
                                            producto.id
                                        }
                                        producto={
                                            producto
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
                            disabled={
                                page === 0
                            }
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
                            disabled={
                                !haySiguiente
                            }
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