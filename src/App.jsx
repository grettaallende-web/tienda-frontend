import "./App.css";

import {
  Routes,
  Route
} from "react-router-dom";

import {
  AuthProvider
} from "./context/AuthContext";

import Catalogo from "./pages/Catalogo";
import Login from "./pages/Login";
import Registro from "./pages/Registro";
import MiCuenta from "./pages/MiCuenta";
import PanelAdmin from "./pages/PanelAdmin";
import ProductoDetalle from "./pages/ProductoDetalle";

import RutaProtegida from "./components/RutaProtegida";


function App() {
  return (
    <AuthProvider>

      <Routes>

        {/* Página principal */}
        <Route
          path="/"
          element={<Catalogo />}
        />

        {/* Detalle del producto */}
        <Route
          path="/producto/:id"
          element={<ProductoDetalle />}
        />

        {/* Login */}
        <Route
          path="/login"
          element={<Login />}
        />

        {/* Registro */}
        <Route
          path="/registro"
          element={<Registro />}
        />

        {/* Mi cuenta */}
        <Route
          element={<RutaProtegida />}
        >
          <Route
            path="/mi-cuenta"
            element={<MiCuenta />}
          />
        </Route>

        {/* Administrador */}
        <Route
          element={
            <RutaProtegida rol="admin" />
          }
        >
          <Route
            path="/admin"
            element={<PanelAdmin />}
          />
        </Route>

        {/* Ruta desconocida */}
        <Route
          path="*"
          element={<Catalogo />}
        />

      </Routes>

    </AuthProvider>
  );
}

export default App;