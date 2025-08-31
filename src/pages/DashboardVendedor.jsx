// src/pages/DashboardVendedor.jsx
import { useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

export default function DashboardVendedor() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const role = location.state?.role || "vendedor";

  // 🔹 10 vendedores fictícios
  const vendedores = {
    1: "Fulano de Tal",
    2: "Beltrano Silva",
    3: "Ciclano Souza",
    4: "Ana Pereira",
    5: "João Oliveira",
    6: "Marcos Santos",
    7: "Paula Gomes",
    8: "Ricardo Lima",
    9: "Fernanda Costa",
    10: "Patrícia Almeida",
  };

  const nomeVendedor = vendedores[id] || "Vendedor Desconhecido";

  // 🔹 Vendas fictícias
  const [vendas] = useState([
    { cliente: "Maria", qtd: 8, valor: 16, data: "28/08/2025" },
    { cliente: "Carlos", qtd: 12, valor: 24, data: "28/08/2025" },
    { cliente: "Júlia", qtd: 15, valor: 30, data: "27/08/2025" },
    { cliente: "Roberto", qtd: 10, valor: 20, data: "27/08/2025" },
    { cliente: "Mariana", qtd: 20, valor: 40, data: "26/08/2025" },
    { cliente: "Pedro", qtd: 18, valor: 36, data: "25/08/2025" },
    { cliente: "Clara", qtd: 22, valor: 44, data: "24/08/2025" },
    { cliente: "Lucas", qtd: 25, valor: 50, data: "23/08/2025" },
  ]);

  const [comissoesAno] = useState([
    { mes: "Jan", comissao: 400 },
    { mes: "Fev", comissao: 600 },
    { mes: "Mar", comissao: 300 },
    { mes: "Abr", comissao: 500 },
    { mes: "Mai", comissao: 700 },
    { mes: "Jun", comissao: 800 },
    { mes: "Jul", comissao: 900 },
    { mes: "Ago", comissao: 1000 },
  ]);

  const totalBilhetes = vendas.reduce((acc, v) => acc + v.qtd, 0);
  const faturamento = vendas.reduce((acc, v) => acc + v.valor, 0);
  const comissaoMes = totalBilhetes * 1.0;
  const clientesUnicos = [...new Set(vendas.map((v) => v.cliente))].length;

  return (
    <div style={styles.container}>
      <h1>📊 Dashboard do Vendedor {nomeVendedor}</h1>

      <div>
        {/* 🔹 Agora volta para o Menu com role vendedor */}
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
        <div style={styles.card}>🎟️ Bilhetes: {totalBilhetes}</div>
        <div style={styles.card}>
          💰 Faturamento:{" "}
          {faturamento.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
        </div>
        <div style={styles.card}>👥 Clientes: {clientesUnicos}</div>
        <div style={styles.card}>
          🪙 Comissão do Mês:{" "}
          {comissaoMes.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
        </div>
      </div>

      {/* Gráfico de vendas por cliente */}
      <h2>Vendas por Cliente</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={vendas}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="cliente" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="qtd" fill="#4caf50" />
        </BarChart>
      </ResponsiveContainer>

      {/* Gráfico de comissões do ano */}
      <h2>Comissões ao Longo do Ano</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={comissoesAno}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="mes" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="comissao" stroke="#ff9800" />
        </LineChart>
      </ResponsiveContainer>

      {/* Tabela */}
      <h2>Últimas Vendas</h2>
      <table style={styles.table}>
        <thead>
          <tr>
            <th>Cliente</th>
            <th>Qtd</th>
            <th>Valor</th>
            <th>Data</th>
          </tr>
        </thead>
        <tbody>
          {vendas.map((v, i) => (
            <tr key={i}>
              <td>{v.cliente}</td>
              <td>{v.qtd}</td>
              <td>
                {v.valor.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </td>
              <td>{v.data}</td>
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
};
