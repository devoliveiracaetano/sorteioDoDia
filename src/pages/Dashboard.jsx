import { useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export default function Dashboard() {
  // Dados fake das vendas (detalhes)
  const [vendas] = useState([
    {
      vendedor: "João",
      cliente: "Maria",
      qtd: 3,
      valor: 6,
      data: "28/08/2025",
    },
    {
      vendedor: "Ana",
      cliente: "Carlos",
      qtd: 1,
      valor: 2,
      data: "28/08/2025",
    },
    {
      vendedor: "Pedro",
      cliente: "Júlia",
      qtd: 5,
      valor: 10,
      data: "27/08/2025",
    },
  ]);

  // Dados fake de faturamento por mês
  const [faturamentoMensal] = useState([
    { mes: "Jan", valor: 120 },
    { mes: "Fev", valor: 90 },
    { mes: "Mar", valor: 150 },
    { mes: "Abr", valor: 200 },
    { mes: "Mai", valor: 300 },
    { mes: "Jun", valor: 250 },
    { mes: "Jul", valor: 400 },
    { mes: "Ago", valor: 180 },
  ]);

  // Cálculos
  const totalBilhetes = vendas.reduce((acc, v) => acc + v.qtd, 0);
  const faturamento = vendas.reduce((acc, v) => acc + v.valor, 0);
  const vendedoresUnicos = [...new Set(vendas.map((v) => v.vendedor))].length;
  const clientesUnicos = [...new Set(vendas.map((v) => v.cliente))].length;

  return (
    <div style={styles.container}>
      <h1>📊 Dashboard de Vendas</h1>

      {/* Cards resumo */}
      <div style={styles.cards}>
        <div style={styles.card}>🎟️ Bilhetes: {totalBilhetes}</div>
        <div style={styles.card}>💰 Faturamento: R${faturamento}</div>
        <div style={styles.card}>👥 Clientes: {clientesUnicos}</div>
        <div style={styles.card}>🧑‍💼 Vendedores: {vendedoresUnicos}</div>
      </div>

      {/* Gráfico Vendas por Vendedor */}
      <h2>Vendas por Vendedor</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={vendas}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="vendedor" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="qtd" fill="#4caf50" />
        </BarChart>
      </ResponsiveContainer>

      {/* Gráfico Faturamento Mensal */}
      <h2>Faturamento dos Últimos Meses</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={faturamentoMensal}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="mes" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="valor"
            stroke="#8884d8"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>

      {/* Tabela */}
      <h2>Últimas Vendas</h2>
      <table style={styles.table}>
        <thead>
          <tr>
            <th>Vendedor</th>
            <th>Cliente</th>
            <th>Qtd</th>
            <th>Valor</th>
            <th>Data</th>
          </tr>
        </thead>
        <tbody>
          {vendas.map((v, i) => (
            <tr key={i}>
              <td>{v.vendedor}</td>
              <td>{v.cliente}</td>
              <td>{v.qtd}</td>
              <td>R${v.valor}</td>
              <td>{v.data}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const styles = {
  container: {
    padding: "2rem",
    fontFamily: "Arial, sans-serif",
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
