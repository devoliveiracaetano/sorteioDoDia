import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Menu from "./pages/Menu";
import DashboardAdmin from "./pages/DashboardAdmin";
import Milhar from "./pages/Milhar";
import CadastroCliente from "./pages/CadastroCliente";
import CadastroAdministrador from "./pages/CadastroAdministrador"; // 🔹 import novo

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/dashboard-admin" element={<DashboardAdmin />} />
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
