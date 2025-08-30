import { useNavigate } from "react-router-dom";

export default function Menu() {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <h1>🎯 Menu Principal</h1>

      <button
        style={styles.button}
        onClick={() => navigate("/dashboard-admin")}
      >
        📊 Dashboard Admin
      </button>

      <button
        style={styles.button}
        onClick={() => navigate("/dashboard-vendedor")}
      >
        🧑‍💼 Dashboard Vendedor
      </button>

      <button style={styles.button} onClick={() => navigate("/milhar")}>
        🍀 Gerador de Milhar
      </button>
    </div>
  );
}

const styles = {
  container: {
    padding: "2rem",
    textAlign: "center",
    fontFamily: "Arial, sans-serif",
  },
  button: {
    display: "block",
    margin: "1rem auto",
    padding: "1rem 2rem",
    fontSize: "1.2rem",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#4caf50",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "bold",
  },
};
