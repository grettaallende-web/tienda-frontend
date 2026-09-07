import { useAuth } from "../context/AuthContext";

export default function MiCuenta() {
    const { usuario, cerrarSesion } = useAuth();

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="mx-auto max-w-2xl rounded-lg bg-white p-8 shadow-md">
                <h1 className="mb-6 text-3xl font-bold">
                    Mi cuenta
                </h1>

                <p className="mb-2">
                    <strong>Nombre:</strong>{" "}
                    {usuario.nombre}
                </p>

                <p className="mb-2">
                    <strong>Correo:</strong>{" "}
                    {usuario.email}
                </p>

                <p className="mb-6">
                    <strong>Rol:</strong>{" "}
                    {usuario.rol}
                </p>

                <button
                    onClick={cerrarSesion}
                    className="rounded bg-black px-4 py-2 text-white"
                >
                    Cerrar sesión
                </button>
            </div>
        </div>
    );
}