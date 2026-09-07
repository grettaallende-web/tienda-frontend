import { Routes, Route } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";

import Catalogo from "./pages/Catalogo";
import Login from "./pages/Login";
import Registro from "./pages/Registro";
import MiCuenta from "./pages/MiCuenta";
import PanelAdmin from "./pages/PanelAdmin";

import RutaProtegida from "./components/RutaProtegida";

function App() {
  return (
    <AuthProvider>
      <Routes>

        <Route
          path="/"
          element={<Catalogo />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/registro"
          element={<Registro />}
        />

        <Route element={<RutaProtegida />}>
          <Route
            path="/mi-cuenta"
            element={<MiCuenta />}
          />
        </Route>

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

      </Routes>
    </AuthProvider>
  );
}

export default App;