import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RutaProtegida({ rol }) {
    const { usuario, cargando } = useAuth();

    if (cargando) {
        return (
            <p className="p-8">
                Cargando...
            </p>
        );
    }

    if (!usuario) {
        return <Navigate to="/login" replace />;
    }

    if (rol && usuario.rol !== rol) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}