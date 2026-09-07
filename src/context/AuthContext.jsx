import {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";

import { getMe, login } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [token, setToken] = useState(
        localStorage.getItem("access_token")
    );

    const [usuario, setUsuario] = useState(null);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        if (!token) {
            setCargando(false);
            return;
        }

        getMe()
            .then((usuarioActual) => {
                setUsuario(usuarioActual);
            })
            .catch(() => {
                cerrarSesion();
            })
            .finally(() => {
                setCargando(false);
            });
    }, [token]);

    async function iniciarSesion(email, password) {
        const tokens = await login(email, password);

        localStorage.setItem(
            "access_token",
            tokens.access_token
        );

        localStorage.setItem(
            "refresh_token",
            tokens.refresh_token
        );

        setToken(tokens.access_token);

        const usuarioActual = await getMe();

        setUsuario(usuarioActual);

        return usuarioActual;
    }

    function cerrarSesion() {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");

        setToken(null);
        setUsuario(null);
    }

    return (
        <AuthContext.Provider
            value={{
                usuario,
                cargando,
                iniciarSesion,
                cerrarSesion
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}