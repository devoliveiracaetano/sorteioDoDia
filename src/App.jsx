import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import DashboardAdmin from "./pages/DashboardAdmin";
import DashboardVendedor from "./pages/DashboardVendedor";
import CadastroCliente from "./pages/CadastroCliente";
import Milhar from "./pages/Milhar"; // 👈 importa a tela Milhar

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard/admin" element={<DashboardAdmin />} />
        <Route path="/dashboard/vendedor/:id" element={<DashboardVendedor />} />
        <Route path="/cadastro-cliente" element={<CadastroCliente />} />
        <Route path="/milhar" element={<Milhar />} /> {/* 👈 rota corrigida */}
      </Routes>
    </Router>
  );
}
