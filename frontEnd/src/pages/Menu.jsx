import { useLocation, useNavigate } from "react-router-dom";

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
        {/* 🔹 Se for ADMIN mostra Dashboard Admin */}
        {role === "admin" && (
          <button
            style={styles.button}
            onClick={() => navigate("/dashboard-admin", { state: { role } })}
          >
            📊 Dashboard
          </button>
        )}

        {/* 🔹 Se for VENDEDOR mostra Dashboard Vendedor */}
        {role === "vendedor" && (
          <button
            style={styles.button}
            onClick={() => navigate("/dashboard-vendedor", { state: { role } })}
          >
            📊 Dashboard
          </button>
        )}

        {/* Botão comum para ambos */}
        <button
          style={styles.button}
          onClick={() => navigate("/milhar", { state: { role } })}
        >
          🍀 Gerador de Milhar
        </button>

        <button
          style={styles.button}
          onClick={() => navigate("/cadastro-cliente", { state: { role } })}
        >
          🧑‍💻 Cadastro de Cliente
        </button>

        {/* 🔹 Botão exclusivo do Admin */}
        {role === "admin" && (
          <button
            style={styles.button}
            onClick={() =>
              navigate("/cadastro-administrador", { state: { role } })
            }
          >
            🛠️ Cadastrar Administrador
          </button>
        )}

        {/* Sair */}
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
  },
};
