import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import DashboardAdmin from "./pages/DashboardAdmin";
import DashboardVendedor from "./pages/DashboardVendedor";
import Menu from "./pages/Menu"; // ⬅️ importa o menu

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/menu" element={<Menu />} /> {/* ⬅️ adiciona rota */}
        <Route path="/dashboard/admin" element={<DashboardAdmin />} />
        <Route path="/dashboard/vendedor" element={<DashboardVendedor />} />
      </Routes>
    </Router>
  );
}
