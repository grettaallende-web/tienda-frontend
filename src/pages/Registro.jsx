import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registrar } from "../services/api";

export default function Registro() {
    const navigate = useNavigate();

    const [formulario, setFormulario] = useState({
        nombre: "",
        email: "",
        password: "",
        acepto_tratamiento: false
    });

    const [error, setError] = useState("");
    const [exito, setExito] = useState("");
    const [cargando, setCargando] = useState(false);

    function manejarCambio(e) {
        const {
            name,
            value,
            type,
            checked
        } = e.target;

        setFormulario({
            ...formulario,
            [name]:
                type === "checkbox"
                    ? checked
                    : value
        });
    }

    async function manejarRegistro(e) {
        e.preventDefault();

        setError("");
        setExito("");
        setCargando(true);

        try {
            await registrar(formulario);

            setExito(
                "Cuenta creada correctamente. Ahora podés iniciar sesión."
            );

            setTimeout(() => {
                navigate("/login");
            }, 1500);
        } catch (error) {
            setError(error.message);
        } finally {
            setCargando(false);
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 p-6">
            <form
                onSubmit={manejarRegistro}
                className="w-full max-w-md rounded-lg bg-white p-8 shadow-md"
            >
                <h1 className="mb-6 text-3xl font-bold">
                    Crear cuenta
                </h1>

                {error && (
                    <p className="mb-4 rounded bg-red-100 p-3 text-red-700">
                        {error}
                    </p>
                )}

                {exito && (
                    <p className="mb-4 rounded bg-green-100 p-3 text-green-700">
                        {exito}
                    </p>
                )}

                <label className="mb-2 block font-semibold">
                    Nombre
                </label>

                <input
                    type="text"
                    name="nombre"
                    value={formulario.nombre}
                    onChange={manejarCambio}
                    className="mb-4 w-full rounded border p-3"
                    required
                />

                <label className="mb-2 block font-semibold">
                    Correo
                </label>

                <input
                    type="email"
                    name="email"
                    value={formulario.email}
                    onChange={manejarCambio}
                    className="mb-4 w-full rounded border p-3"
                    required
                />

                <label className="mb-2 block font-semibold">
                    Contraseña
                </label>

                <input
                    type="password"
                    name="password"
                    value={formulario.password}
                    onChange={manejarCambio}
                    minLength={8}
                    className="mb-4 w-full rounded border p-3"
                    required
                />

                <label className="mb-6 flex gap-3">
                    <input
                        type="checkbox"
                        name="acepto_tratamiento"
                        checked={
                            formulario.acepto_tratamiento
                        }
                        onChange={manejarCambio}
                    />

                    <span className="text-sm">
                        Acepto que se guarden mi nombre y mi
                        correo para gestionar mi cuenta y mis
                        pedidos. Puedo verlos o pedir que los
                        borren (Ley 25.326).
                    </span>
                </label>

                <button
                    type="submit"
                    disabled={
                        !formulario.acepto_tratamiento ||
                        cargando
                    }
                    className="w-full rounded bg-black px-4 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:bg-gray-400"
                >
                    {cargando
                        ? "Creando cuenta..."
                        : "Registrarme"}
                </button>

                <p className="mt-6 text-center">
                    ¿Ya tenés una cuenta?{" "}
                    <Link
                        to="/login"
                        className="font-semibold underline"
                    >
                        Iniciá sesión
                    </Link>
                </p>
            </form>
        </div>
    );
}