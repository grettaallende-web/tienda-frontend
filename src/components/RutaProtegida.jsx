import {
    Navigate,
    Outlet
} from "react-router-dom";

import {
    useAuth
} from "../context/AuthContext";


function RutaProtegida({ rol }) {

    const {
        usuario,
        cargando
    } = useAuth();


    if (cargando) {

        return (
            <div className="pantalla-cargando">
                Cargando...
            </div>
        );

    }


    if (!usuario) {

        return (
            <Navigate
                to="/login"
                replace
            />
        );

    }


    if (
        rol &&
        usuario.rol !== rol
    ) {

        return (
            <Navigate
                to="/"
                replace
            />
        );

    }


    return <Outlet />;
}

export default RutaProtegida;