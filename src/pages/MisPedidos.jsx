import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    getMisPedidos,
    revocarPedido
} from "../services/api";

import "./MisPedidos.css";

const DIAS_PARA_REVOCAR = 10;

function puedeRevocar(pedido) {
    if (pedido.estado === "cancelado") {
        return false;
    }

    const ms =
        Date.now() -
        new Date(pedido.creado_en).getTime();

    return ms / 86400000 <= DIAS_PARA_REVOCAR;
}

function MisPedidos() {
    const navigate = useNavigate();

    const [pedidos, setPedidos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");
    const [codigo, setCodigo] = useState(null);
    const [enviando, setEnviando] = useState(false);

    async function cargarPedidos() {
        try {
            setError("");

            const datos = await getMisPedidos();

            setPedidos(datos);
        } catch (error) {
            setError(error.message);
        } finally {
            setCargando(false);
        }
    }

    useEffect(() => {
        cargarPedidos();
    }, []);

    async function manejarRevocacion(pedidoId) {
        const ok = window.confirm(
            "¿Cancelar esta compra? Vas a recibir un código."
        );

        if (!ok || enviando) {
            return;
        }

        try {
            setError("");
            setEnviando(true);

            const solicitud =
                await revocarPedido(pedidoId);

            setCodigo(solicitud.codigo);

            await cargarPedidos();
        } catch (error) {
            setError(error.message);
        } finally {
            setEnviando(false);
        }
    }

    if (cargando) {
        return (
            <main className="pedidos-page">
                <div className="pedidos-container loading-pedidos">
                    <p>Cargando tus pedidos...</p>
                </div>
            </main>
        );
    }

    return (
        <main className="pedidos-page">

            <div className="pedidos-container">

                <div className="pedidos-header">

                    <div>
                        <h1>📦 Mis pedidos</h1>
                        <p>
                            Consultá tus compras y gestioná
                            las solicitudes de arrepentimiento.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="secondary-button"
                        onClick={() =>
                            navigate("/mi-cuenta")
                        }
                    >
                        ← Volver a mi cuenta
                    </button>

                </div>


                {codigo && (
                    <div
                        className="codigo-box"
                        role="status"
                    >
                        <div className="codigo-icon">
                            ✓
                        </div>

                        <div>
                            <h2>
                                Solicitud registrada
                            </h2>

                            <p>
                                Tu solicitud de arrepentimiento
                                fue registrada correctamente.
                            </p>

                            <span>
                                Código de seguimiento
                            </span>

                            <strong>
                                {codigo}
                            </strong>

                            <small>
                                Guardá este código como
                                comprobante de la solicitud.
                            </small>
                        </div>
                    </div>
                )}


                {error && (
                    <div
                        className="error-message"
                        role="alert"
                    >
                        {error}
                    </div>
                )}


                {pedidos.length === 0 ? (

                    <div className="empty-pedidos">
                        <div className="empty-icon">
                            📦
                        </div>

                        <h2>
                            No tenés pedidos todavía.
                        </h2>

                        <p>
                            Cuando realices una compra,
                            aparecerá acá.
                        </p>
                    </div>

                ) : (

                    <div className="pedidos-list">

                        {pedidos.map((pedido) => (

                            <article
                                key={pedido.id}
                                className="pedido-card"
                            >

                                <div className="pedido-card-header">

                                    <div>
                                        <span className="pedido-label">
                                            COMPRA
                                        </span>

                                        <h2>
                                            Pedido #{pedido.id}
                                        </h2>
                                    </div>

                                    <span
                                        className={`pedido-estado ${pedido.estado ===
                                                "cancelado"
                                                ? "estado-cancelado"
                                                : ""
                                            }`}
                                    >
                                        {pedido.estado}
                                    </span>

                                </div>


                                <div className="pedido-details">

                                    <div>
                                        <span>Fecha</span>

                                        <strong>
                                            {new Date(
                                                pedido.creado_en
                                            ).toLocaleString(
                                                "es-AR"
                                            )}
                                        </strong>
                                    </div>

                                    <div>
                                        <span>Total</span>

                                        <strong>
                                            $
                                            {Number(
                                                pedido.total
                                            ).toLocaleString(
                                                "es-AR",
                                                {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2
                                                }
                                            )}
                                        </strong>
                                    </div>

                                </div>


                                <div className="productos-section">

                                    <h3>
                                        Productos
                                    </h3>

                                    {pedido.items.map(
                                        (item) => (

                                            <div
                                                key={item.id}
                                                className="producto-item"
                                            >

                                                <div>
                                                    <strong>
                                                        Producto #
                                                        {
                                                            item.producto_id
                                                        }
                                                    </strong>

                                                    <span>
                                                        Cantidad:{" "}
                                                        {
                                                            item.cantidad
                                                        }
                                                    </span>
                                                </div>

                                                <strong>
                                                    $
                                                    {Number(
                                                        item.precio_unitario
                                                    ).toLocaleString(
                                                        "es-AR",
                                                        {
                                                            minimumFractionDigits: 2,
                                                            maximumFractionDigits: 2
                                                        }
                                                    )}
                                                </strong>

                                            </div>

                                        )
                                    )}

                                </div>


                                {puedeRevocar(pedido) && (

                                    <div className="revocacion-section">

                                        <div>
                                            <strong>
                                                ¿Cambiaste de opinión?
                                            </strong>

                                            <p>
                                                Podés solicitar el
                                                arrepentimiento de
                                                esta compra.
                                            </p>
                                        </div>

                                        <button
                                            type="button"
                                            className="revocar-button"
                                            onClick={() =>
                                                manejarRevocacion(
                                                    pedido.id
                                                )
                                            }
                                            disabled={enviando}
                                        >
                                            {enviando
                                                ? "Procesando..."
                                                : "Arrepentirme"}
                                        </button>

                                    </div>

                                )}

                            </article>

                        ))}

                    </div>

                )}

            </div>

        </main>
    );
}

export default MisPedidos;