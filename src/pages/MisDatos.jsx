import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    getMisDatos,
    exportarMisDatos,
    eliminarMiCuenta
} from "../services/api";

import "./MisDatos.css";

function MisDatos() {
    const navigate = useNavigate();

    const [datos, setDatos] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");
    const [texto, setTexto] = useState("");
    const [eliminando, setEliminando] = useState(false);

    useEffect(() => {
        async function cargarDatos() {
            try {
                setError("");
                const resultado = await getMisDatos();
                setDatos(resultado);
            } catch (error) {
                setError(error.message);
            } finally {
                setCargando(false);
            }
        }

        cargarDatos();
    }, []);

    async function manejarExportacion() {
        try {
            setError("");
            await exportarMisDatos();
        } catch (error) {
            setError(error.message);
        }
    }

    async function manejarEliminacion() {
        if (texto !== "ELIMINAR") return;

        const confirmar = window.confirm(
            "¿Estás segura de que querés eliminar tu cuenta? Esta acción no se puede deshacer."
        );

        if (!confirmar) return;

        try {
            setError("");
            setEliminando(true);

            await eliminarMiCuenta();

            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");

            navigate("/", {
                state: {
                    mensaje: "Tu cuenta fue dada de baja."
                }
            });
        } catch (error) {
            setError(error.message);
        } finally {
            setEliminando(false);
        }
    }

    if (cargando) {
        return (
            <main className="datos-page">
                <div className="datos-card loading-card">
                    <p>Cargando tus datos...</p>
                </div>
            </main>
        );
    }

    if (error && !datos) {
        return (
            <main className="datos-page">
                <div className="datos-card">
                    <h1>Mis datos</h1>
                    <p className="error-message">{error}</p>

                    <button
                        className="secondary-button"
                        onClick={() => navigate("/mi-cuenta")}
                    >
                        ← Volver a mi cuenta
                    </button>
                </div>
            </main>
        );
    }

    return (
        <main className="datos-page">

            <div className="datos-header">
                <div>
                    <h1>Mis datos</h1>
                    <p>Consultá y gestioná la información de tu cuenta.</p>
                </div>

                <button
                    className="secondary-button"
                    onClick={() => navigate("/mi-cuenta")}
                >
                    ← Volver a mi cuenta
                </button>
            </div>

            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            {datos && (
                <div className="datos-grid">

                    {/* DATOS PERSONALES */}
                    <section className="datos-card">
                        <div className="section-title">
                            <span className="section-icon">👤</span>
                            <div>
                                <h2>Datos personales</h2>
                                <p>Información asociada a tu cuenta.</p>
                            </div>
                        </div>

                        <div className="info-list">

                            <div className="info-row">
                                <span>ID</span>
                                <strong>{datos.usuario.id}</strong>
                            </div>

                            <div className="info-row">
                                <span>Nombre</span>
                                <strong>{datos.usuario.nombre}</strong>
                            </div>

                            <div className="info-row">
                                <span>Correo electrónico</span>
                                <strong>{datos.usuario.email}</strong>
                            </div>

                            <div className="info-row">
                                <span>Rol</span>
                                <strong className="badge">
                                    {datos.usuario.rol}
                                </strong>
                            </div>

                        </div>
                    </section>


                    {/* CONSENTIMIENTO */}
                    <section className="datos-card">
                        <div className="section-title">
                            <span className="section-icon">✓</span>
                            <div>
                                <h2>Consentimiento</h2>
                                <p>Información sobre el tratamiento de tus datos.</p>
                            </div>
                        </div>

                        <div className="consent-box">

                            <div className="consent-status">
                                <span className="status-dot"></span>

                                <div>
                                    <strong>
                                        {datos.usuario.acepto_tratamiento
                                            ? "Tratamiento aceptado"
                                            : "Tratamiento no aceptado"}
                                    </strong>

                                    <p>
                                        {datos.usuario.acepto_tratamiento
                                            ? "Aceptaste el tratamiento de tus datos."
                                            : "No hay consentimiento registrado."}
                                    </p>
                                </div>
                            </div>

                            <div className="consent-date">
                                <span>Fecha del consentimiento</span>

                                <strong>
                                    {datos.usuario.fecha_consentimiento
                                        ? new Date(
                                            datos.usuario.fecha_consentimiento
                                        ).toLocaleString("es-AR")
                                        : "No registrada"}
                                </strong>
                            </div>

                        </div>
                    </section>


                    {/* PEDIDOS */}
                    <section className="datos-card pedidos-card">

                        <div className="section-title">
                            <span className="section-icon">📦</span>

                            <div>
                                <h2>Mis compras</h2>
                                <p>
                                    {datos.pedidos.length}{" "}
                                    {datos.pedidos.length === 1
                                        ? "pedido registrado"
                                        : "pedidos registrados"}
                                </p>
                            </div>
                        </div>

                        {datos.pedidos.length === 0 ? (
                            <div className="empty-orders">
                                <p>No tenés compras registradas.</p>
                            </div>
                        ) : (
                            <div className="orders-list">

                                {datos.pedidos.map((pedido) => (
                                    <article
                                        key={pedido.id}
                                        className="order-card"
                                    >

                                        <div className="order-top">
                                            <h3>Pedido #{pedido.id}</h3>

                                            <span
                                                className={`order-status ${pedido.estado === "cancelado"
                                                        ? "cancelado"
                                                        : ""
                                                    }`}
                                            >
                                                {pedido.estado}
                                            </span>
                                        </div>

                                        <div className="order-info">

                                            <div>
                                                <span>Fecha</span>
                                                <strong>
                                                    {pedido.creado_en
                                                        ? new Date(
                                                            pedido.creado_en
                                                        ).toLocaleString("es-AR")
                                                        : "No registrada"}
                                                </strong>
                                            </div>

                                            <div>
                                                <span>Total</span>
                                                <strong>
                                                    $
                                                    {Number(
                                                        pedido.total
                                                    ).toLocaleString("es-AR", {
                                                        minimumFractionDigits: 2,
                                                        maximumFractionDigits: 2
                                                    })}
                                                </strong>
                                            </div>

                                        </div>

                                    </article>
                                ))}

                            </div>
                        )}

                    </section>


                    {/* EXPORTAR */}
                    <section className="datos-card action-card">

                        <div className="section-title">
                            <span className="section-icon">📥</span>

                            <div>
                                <h2>Exportar mis datos</h2>
                                <p>
                                    Descargá una copia de la información
                                    almacenada de tu cuenta.
                                </p>
                            </div>
                        </div>

                        <button
                            className="primary-button"
                            onClick={manejarExportacion}
                        >
                            Descargar mis datos
                        </button>

                    </section>


                    {/* ELIMINAR CUENTA */}
                    <section className="datos-card delete-card">

                        <div className="section-title">
                            <span className="section-icon">⚠️</span>

                            <div>
                                <h2>Eliminar mi cuenta</h2>
                                <p>
                                    Esta acción dará de baja tu cuenta y
                                    anonimizará tus datos personales.
                                </p>
                            </div>
                        </div>

                        <div className="delete-warning">
                            <strong>Esta acción no se puede deshacer.</strong>

                            <p>
                                Para confirmar la eliminación de tu cuenta,
                                escribí <strong>ELIMINAR</strong> en el campo.
                            </p>
                        </div>

                        <input
                            className="delete-input"
                            type="text"
                            value={texto}
                            onChange={(e) => setTexto(e.target.value)}
                            placeholder="Escribí ELIMINAR"
                        />

                        <button
                            className="delete-button"
                            disabled={
                                texto !== "ELIMINAR" || eliminando
                            }
                            onClick={manejarEliminacion}
                        >
                            {eliminando
                                ? "Eliminando..."
                                : "Eliminar mi cuenta"}
                        </button>

                    </section>

                </div>
            )}

        </main>
    );
}

export default MisDatos;