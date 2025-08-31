// src/pages/DashboardAdmin.jsx
import { useNavigate, useLocation } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { FaUserCircle } from "react-icons/fa";

export default function DashboardAdmin() {
  const navigate = useNavigate();
  const location = useLocation();
  const role = location.state?.role || "admin";

  // 🔹 Lista com 10 vendedores
  const vendedores = [
    { id: 1, nome: "Fulano de Tal", vendas: 480, valor: 960 },
    { id: 2, nome: "Beltrano Silva", vendas: 520, valor: 1040 },
    { id: 3, nome: "Ciclano Souza", vendas: 350, valor: 700 },
    { id: 4, nome: "Ana Pereira", vendas: 410, valor: 820 },
    { id: 5, nome: "João Oliveira", vendas: 600, valor: 1200 },
    { id: 6, nome: "Marcos Santos", vendas: 300, valor: 600 },
    { id: 7, nome: "Paula Gomes", vendas: 280, valor: 560 },
    { id: 8, nome: "Ricardo Lima", vendas: 470, valor: 940 },
    { id: 9, nome: "Fernanda Costa", vendas: 510, valor: 1020 },
    { id: 10, nome: "Patrícia Almeida", vendas: 450, valor: 900 },
  ];

  const totalBilhetes = vendedores.reduce((acc, v) => acc + v.vendas, 0);
  const faturamento = vendedores.reduce((acc, v) => acc + v.valor, 0);
  const comissaoTotal = totalBilhetes * 1.0;

  const COLORS = [
    "#4caf50",
    "#2196f3",
    "#ff9800",
    "#f44336",
    "#9c27b0",
    "#3f51b5",
    "#00bcd4",
    "#8bc34a",
    "#ffc107",
    "#795548",
  ];

  return (
    <div style={styles.container}>
      <h1>📊 Dashboard do Administrador</h1>

      <div>
        {/* 🔹 Agora volta para o Menu com role admin */}
        <button
          onClick={() => navigate("/menu", { state: { role } })}
          style={styles.buttonSecundario}
        >
          ⬅️ Voltar para Menu
        </button>

        <button
          onClick={() => navigate("/milhar", { state: { role } })}
          style={styles.button}
        >
          🍀 Ir para Gerador de Milhar
        </button>
      </div>

      {/* Cards resumo */}
      <div style={styles.cards}>
        <div style={styles.card}>🎟️ Total Bilhetes: {totalBilhetes}</div>
        <div style={styles.card}>
          💰 Faturamento:{" "}
          {faturamento.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
        </div>
        <div style={styles.card}>
          🪙 Comissões Pagas:{" "}
          {comissaoTotal.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
        </div>
      </div>

      {/* Gráfico de barras */}
      <h2>Vendas por Vendedor</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={vendedores}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="nome" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="vendas" fill="#4caf50" />
        </BarChart>
      </ResponsiveContainer>

      {/* Gráfico de pizza */}
      <h2>Participação no Faturamento</h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={vendedores}
            dataKey="valor"
            nameKey="nome"
            cx="50%"
            cy="50%"
            outerRadius={120}
            fill="#8884d8"
            label
          >
            {vendedores.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>

      {/* Tabela de vendedores */}
      <h2>Lista de Vendedores</h2>
      <table style={styles.table}>
        <thead>
          <tr>
            <th>Vendedor</th>
            <th>Bilhetes</th>
            <th>Faturamento</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {vendedores.map((v) => (
            <tr key={v.id}>
              <td>{v.nome}</td>
              <td>{v.vendas}</td>
              <td>
                {v.valor.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </td>
              <td>
                <button
                  onClick={() =>
                    navigate(`/dashboard/vendedor/${v.id}`, { state: { role } })
                  }
                  style={styles.iconButton}
                >
                  <FaUserCircle size={20} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const styles = {
  container: { padding: "2rem", fontFamily: "Arial, sans-serif" },
  button: {
    marginBottom: "1rem",
    marginRight: "1rem",
    padding: "0.7rem 1.5rem",
    fontSize: "1rem",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#4caf50",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "bold",
  },
  buttonSecundario: {
    marginBottom: "1rem",
    marginRight: "1rem",
    padding: "0.7rem 1.5rem",
    fontSize: "1rem",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#9e9e9e",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "bold",
  },
  cards: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "1rem",
    margin: "1rem 0",
  },
  card: {
    padding: "1rem",
    borderRadius: "8px",
    backgroundColor: "#f5f5f5",
    textAlign: "center",
    fontSize: "1.2rem",
    fontWeight: "bold",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "1rem",
  },
  iconButton: {
    border: "none",
    background: "transparent",
    cursor: "pointer",
    color: "#4caf50",
  },
};
