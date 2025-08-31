// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// 🔹 Importando as páginas
import Login from "./pages/Login";
import Menu from "./pages/Menu";
import Milhar from "./pages/Milhar";
import DashboardAdmin from "./pages/DashboardAdmin";
import DashboardVendedor from "./pages/DashboardVendedor";
import CadastroCliente from "./pages/CadastroCliente";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Tela inicial */}
        <Route path="/" element={<Login />} />

        {/* Menu principal */}
        <Route path="/menu" element={<Menu />} />

        {/* Telas de funcionalidades */}
        <Route path="/milhar" element={<Milhar />} />
        <Route path="/dashboard-admin" element={<DashboardAdmin />} />
        <Route path="/dashboard-vendedor" element={<DashboardVendedor />} />
        <Route path="/cadastro-cliente" element={<CadastroCliente />} />
      </Routes>
    </Router>
  );
}
