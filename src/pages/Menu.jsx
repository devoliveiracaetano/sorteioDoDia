// src/pages/Menu.jsx
import { useLocation, useNavigate } from "react-router-dom";
import trevoImg from "../assets/trevo.jpg"; // ✅ Importando a imagem do trevo

export default function Menu() {
  const location = useLocation();
  const navigate = useNavigate();

  // Recupera o perfil vindo do Login
  const role = location.state?.role || "vendedor";

  return (
    <div style={styles.container}>
      <h1>📋 Menu Principal</h1>
      <p>Bem-vindo, {role === "admin" ? "Administrador" : "Vendedor"}!</p>

      <div style={styles.buttonGroup}>
        {/* Dashboard para cada perfil */}
        {role === "admin" ? (
          <button
            style={styles.button}
            onClick={() => navigate("/dashboard-admin", { state: { role } })}
          >
            📊 Dashboard
          </button>
        ) : (
          <button
            style={styles.button}
            onClick={() => navigate("/dashboard-vendedor", { state: { role } })}
          >
            📊 Dashboard
          </button>
        )}

        {/* Botão Gerador de Milhar com ícone do trevo */}
        <button
          style={styles.button}
          onClick={() => navigate("/milhar", { state: { role } })}
        >
          <img src={trevoImg} alt="Trevo" style={styles.icon} /> Gerador de
          Milhar
        </button>

        <button
          style={styles.button}
          onClick={() => navigate("/cadastro-cliente", { state: { role } })}
        >
          🧑‍💻 Cadastro de Cliente
        </button>

        {/* Botão exclusivo do admin */}
        {role === "admin" && (
          <button
            style={styles.button}
            onClick={() => navigate("/cadastro-admin", { state: { role } })}
          >
            🛠️ Cadastrar Administrador
          </button>
        )}

        <button
          style={{ ...styles.button, background: "#e74c3c" }}
          onClick={() => navigate("/")}
        >
          🚪 Sair
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "2rem",
  },
  buttonGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    marginTop: "2rem",
  },
  button: {
    padding: "1rem 2rem",
    fontSize: "1rem",
    borderRadius: "8px",
    border: "none",
    background: "#3498db",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "0.3s",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
  },
  icon: {
    width: "20px",
    height: "20px",
  },
};
