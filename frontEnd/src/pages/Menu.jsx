import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Menu() {
  const location = useLocation();
  const navigate = useNavigate();

  const role = location.state?.role || "vendedor";

  // Estado do popup
  const [showPopup, setShowPopup] = useState(false);
  const [selectedClient, setSelectedClient] = useState("");

  // Lista mockada de clientes
  const clientesMock = [
    { id: 1, nome: "João Silva" },
    { id: 2, nome: "Maria Oliveira" },
    { id: 3, nome: "Carlos Souza" },
  ];

  const handleConfirm = () => {
    if (!selectedClient) {
      alert("Selecione um cliente antes de continuar!");
      return;
    }
    setShowPopup(false);
    navigate("/milhar", { state: { role, cliente: selectedClient } });
  };

  return (
    <div style={styles.container}>
      <h1>📋 Menu Principal</h1>
      <p>Bem-vindo, {role === "admin" ? "Administrador" : "Vendedor"}!</p>

      <div style={styles.buttonGroup}>
        {role === "admin" && (
          <button
            style={styles.button}
            onClick={() => navigate("/dashboard-admin", { state: { role } })}
          >
            📊 Dashboard
          </button>
        )}

        {role === "vendedor" && (
          <button
            style={styles.button}
            onClick={() => navigate("/dashboard-vendedor", { state: { role } })}
          >
            📊 Dashboard
          </button>
        )}

        {/* 🔹 Gerador de Milhar agora abre popup */}
        <button style={styles.button} onClick={() => setShowPopup(true)}>
          🍀 Gerador de Milhar
        </button>

        <button
          style={styles.button}
          onClick={() => navigate("/cadastro-cliente", { state: { role } })}
        >
          🧑‍💻 Cadastro de Cliente
        </button>

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

        <button
          style={{ ...styles.button, background: "#e74c3c" }}
          onClick={() => navigate("/")}
        >
          🚪 Sair
        </button>
      </div>

      {/* Popup de seleção de cliente */}
      {showPopup && (
        <div style={styles.overlay}>
          <div style={styles.popup}>
            <h3>Selecione o Cliente</h3>
            <select
              style={styles.select}
              value={selectedClient}
              onChange={(e) => setSelectedClient(e.target.value)}
            >
              <option value="">-- Escolha um cliente --</option>
              {clientesMock.map((c) => (
                <option key={c.id} value={c.nome}>
                  {c.nome}
                </option>
              ))}
            </select>

            <div style={styles.popupButtons}>
              <button
                style={styles.button}
                onClick={() =>
                  navigate("/cadastro-cliente", { state: { role } })
                }
              >
                ➕ Cadastrar Novo Cliente
              </button>
              <button
                style={{ ...styles.button, background: "#2ecc71" }}
                onClick={handleConfirm}
              >
                ✅ Confirmar
              </button>
              <button
                style={{ ...styles.button, background: "#e74c3c" }}
                onClick={() => setShowPopup(false)}
              >
                ❌ Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
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
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.6)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  popup: {
    background: "#fff",
    padding: "2rem",
    borderRadius: "12px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
    width: "400px",
    textAlign: "center",
  },
  select: {
    width: "100%",
    padding: "0.5rem",
    fontSize: "1rem",
    marginTop: "1rem",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },
  popupButtons: {
    marginTop: "1.5rem",
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
};
