// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Menu from "./pages/Menu";
import DashboardAdmin from "./pages/DashboardAdmin";
import DashboardVendedor from "./pages/DashboardVendedor"; // 🔹 import novo
import Milhar from "./pages/Milhar";
import CadastroCliente from "./pages/CadastroCliente";
import CadastroAdministrador from "./pages/CadastroAdministrador";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/dashboard-admin" element={<DashboardAdmin />} />
        <Route
          path="/dashboard-vendedor"
          element={<DashboardVendedor />}
        />{" "}
        {/* 🔹 nova rota */}
        <Route path="/milhar" element={<Milhar />} />
        <Route path="/cadastro-cliente" element={<CadastroCliente />} />
        <Route
          path="/cadastro-administrador"
          element={<CadastroAdministrador />}
        />
      </Routes>
    </Router>
  );
}
