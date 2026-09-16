import { useNavigate } from "react-router-dom";
import { useCarrito } from "../context/CarritoContext";

function Carrito() {
    const navigate = useNavigate();

    const {
        items,
        quitar,
        vaciar,
        total
    } = useCarrito();

    console.log("PRODUCTOS DEL CARRITO:", items);

    return (
        <div className="page-container">

            <h1>🛒 Mi carrito</h1>

            {items.length === 0 ? (
                <div>
                    <h2>Tu carrito está vacío</h2>

                    <p>
                        Agregá un producto desde el catálogo.
                    </p>

                    <button
                        type="button"
                        onClick={() => navigate("/")}
                    >
                        ← Volver al catálogo
                    </button>
                </div>
            ) : (
                <div>

                    <h2>
                        Productos en tu carrito
                    </h2>

                    {items.map((item) => (
                        <div
                            key={item.producto_id}
                            className="cart-item"
                        >

                            <h3>{item.nombre}</h3>

                            <p>
                                Precio unitario: $
                                {Number(item.precio).toLocaleString("es-AR", {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2
                                })}
                            </p>

                            <p>
                                Cantidad: {item.cantidad}
                            </p>

                            <p>
                                Subtotal: $
                                {(
                                    Number(item.precio) * item.cantidad
                                ).toLocaleString("es-AR", {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2
                                })}
                            </p>

                            <button
                                type="button"
                                onClick={() => quitar(item.producto_id)}
                            >
                                ❌ Quitar
                            </button>

                        </div>
                    ))}

                    <hr />

                    <h2>
                        Total: $
                        {total.toLocaleString("es-AR", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                        })}
                    </h2>

                    <button
                        type="button"
                        onClick={vaciar}
                    >
                        🗑️ Vaciar carrito
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate("/")}
                    >
                        ← Seguir comprando
                    </button>

                </div>
            )}

        </div>
    );
}

export default Carrito;