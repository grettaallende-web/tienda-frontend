import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
    const navigate = useNavigate();

    const { iniciarSesion } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [cargando, setCargando] = useState(false);

    async function manejarLogin(e) {
        e.preventDefault();

        setError("");
        setCargando(true);

        try {
            const usuario = await iniciarSesion(
                email,
                password
            );

            if (usuario.rol === "admin") {
                navigate("/admin");
            } else {
                navigate("/mi-cuenta");
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setCargando(false);
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 p-6">
            <form
                onSubmit={manejarLogin}
                className="w-full max-w-md rounded-lg bg-white p-8 shadow-md"
            >
                <h1 className="mb-6 text-3xl font-bold">
                    Iniciar sesión
                </h1>

                {error && (
                    <p className="mb-4 rounded bg-red-100 p-3 text-red-700">
                        {error}
                    </p>
                )}

                <label className="mb-2 block font-semibold">
                    Correo
                </label>

                <input
                    type="email"
                    value={email}
                    onChange={(e) =>
                        setEmail(e.target.value)
                    }
                    className="mb-4 w-full rounded border p-3"
                    placeholder="correo@ejemplo.com"
                    required
                />

                <label className="mb-2 block font-semibold">
                    Contraseña
                </label>

                <input
                    type="password"
                    value={password}
                    onChange={(e) =>
                        setPassword(e.target.value)
                    }
                    className="mb-6 w-full rounded border p-3"
                    placeholder="********"
                    required
                />

                <button
                    type="submit"
                    disabled={cargando}
                    className="w-full rounded bg-black px-4 py-3 font-semibold text-white disabled:bg-gray-400"
                >
                    {cargando
                        ? "Ingresando..."
                        : "Iniciar sesión"}
                </button>

                <p className="mt-6 text-center">
                    ¿No tenés una cuenta?{" "}
                    <Link
                        to="/registro"
                        className="font-semibold underline"
                    >
                        Registrate
                    </Link>
                </p>
            </form>
        </div>
    );
}