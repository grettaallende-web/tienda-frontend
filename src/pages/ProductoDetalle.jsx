import { useEffect, useState } from "react";
import {
    useNavigate,
    useParams
} from "react-router-dom";

import {
    getProducto
} from "../services/api";


function ProductoDetalle() {

    const { id } = useParams();

    const navigate = useNavigate();

    const [producto, setProducto] =
        useState(null);

    const [cargando, setCargando] =
        useState(true);

    const [error, setError] =
        useState("");


    useEffect(() => {

        async function cargarProducto() {

            try {

                const datos =
                    await getProducto(id);

                setProducto(datos);

            } catch (error) {

                setError(error.message);

            } finally {

                setCargando(false);

            }
        }

        cargarProducto();

    }, [id]);


    if (cargando) {

        return (
            <main className="detalle-producto">
                <div className="detalle-card">
                    <p>
                        Cargando producto...
                    </p>
                </div>
            </main>
        );

    }


    if (error) {

        return (
            <main className="detalle-producto">

                <button
                    type="button"
                    onClick={() => navigate("/")}
                >
                    ← Volver a productos
                </button>

                <div className="detalle-card">

                    <h1>
                        Error
                    </h1>

                    <p>
                        {error}
                    </p>

                </div>

            </main>
        );

    }


    const precio =
        Number(producto.precio_final);

    const cuota =
        Number(producto.cuotas_valor);


    return (
        <main className="detalle-producto">

            <button
                type="button"
                onClick={() => navigate("/")}
            >
                ← Volver a productos
            </button>


            <div className="detalle-card">

                <h1>
                    {producto.nombre}
                </h1>


                <div className="detalle-precio">
                    $
                    {precio.toLocaleString("es-AR", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    })}
                </div>


                <div className="detalle-informacion">

                    <p>
                        💳{" "}
                        <strong>
                            Cuotas:
                        </strong>{" "}
                        {producto.cuotas_cantidad}
                        {" "}cuotas de $
                        {cuota.toLocaleString("es-AR", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                        })}
                    </p>


                    <p>
                        🛡️{" "}
                        <strong>
                            Garantía:
                        </strong>{" "}
                        {producto.garantia_meses} meses
                    </p>


                    <p>
                        📦{" "}
                        <strong>
                            Stock:
                        </strong>{" "}
                        {producto.stock}
                    </p>

                </div>


                <div className="descripcion-producto">

                    <h2>
                        Descripción
                    </h2>

                    <p>
                        {producto.nombre} se encuentra
                        disponible en nuestra tienda.
                    </p>

                    <p>
                        Precio final: $
                        {precio.toLocaleString("es-AR", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                        })}
                    </p>

                    <p>
                        Cuenta con{" "}
                        {producto.cuotas_cantidad}
                        {" "}cuotas de financiación y{" "}
                        {producto.garantia_meses}
                        {" "}meses de garantía.
                    </p>

                </div>

            </div>

        </main>
    );
}

export default ProductoDetalle;