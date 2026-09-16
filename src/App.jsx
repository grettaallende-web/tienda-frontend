import "./App.css";

import { Routes, Route } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import { CarritoProvider } from "./context/CarritoContext";

import Catalogo from "./pages/Catalogo";
import Login from "./pages/Login";
import Registro from "./pages/Registro";
import MiCuenta from "./pages/MiCuenta";
import MisDatos from "./pages/MisDatos";
import MisPedidos from "./pages/MisPedidos";
import PanelAdmin from "./pages/PanelAdmin";
import ProductoDetalle from "./pages/ProductoDetalle";

import RutaProtegida from "./components/RutaProtegida";

function App() {
  return (
    <AuthProvider>
      <CarritoProvider>
        <Routes>

          {/* Catálogo */}
          <Route
            path="/"
            element={<Catalogo />}
          />

          {/* Detalle de producto */}
          <Route
            path="/producto/:id"
            element={<ProductoDetalle />}
          />

          {/* Autenticación */}
          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/registro"
            element={<Registro />}
          />

          {/* Rutas protegidas */}
          <Route element={<RutaProtegida />}>

            <Route
              path="/mi-cuenta"
              element={<MiCuenta />}
            />

            <Route
              path="/mis-datos"
              element={<MisDatos />}
            />

            <Route
              path="/mis-pedidos"
              element={<MisPedidos />}
            />

          </Route>

          {/* Panel de administrador */}
          <Route element={<RutaProtegida rol="admin" />}>
            <Route
              path="/admin"
              element={<PanelAdmin />}
            />
          </Route>

          {/* Ruta inexistente */}
          <Route
            path="*"
            element={<Catalogo />}
          />

        </Routes>
      </CarritoProvider>
    </AuthProvider>
  );
}

export default App;