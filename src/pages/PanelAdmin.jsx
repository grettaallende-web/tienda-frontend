import { useAuth } from "../context/AuthContext";

export default function PanelAdmin() {
    const { usuario, cerrarSesion } = useAuth();

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="mx-auto max-w-3xl rounded-lg bg-white p-8 shadow-md">
                <h1 className="mb-4 text-3xl font-bold">
                    Panel de administración
                </h1>

                <p className="mb-2">
                    Bienvenido,{" "}
                    <strong>{usuario.nombre}</strong>.
                </p>

                <p className="mb-6">
                    Rol actual:{" "}
                    <strong>{usuario.rol}</strong>
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