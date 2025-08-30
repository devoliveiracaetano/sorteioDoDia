import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CadastroCliente() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nome: "",
    email: "",
    telefone: "",
    senha: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // 🔹 Aqui no futuro vamos salvar no backend (API ou localStorage)
    console.log("📌 Cliente cadastrado:", form);

    alert("Cliente cadastrado com sucesso!");
    navigate("/"); // Volta para login
  };

  return (
    <div style={styles.container}>
      <h1>📝 Cadastro de Cliente</h1>

      <form onSubmit={handleSubmit} style={styles.form}>
        <label style={styles.label}>Nome:</label>
        <input
          type="text"
          name="nome"
          value={form.nome}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <label style={styles.label}>E-mail:</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <label style={styles.label}>Telefone:</label>
        <input
          type="tel"
          name="telefone"
          value={form.telefone}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <label style={styles.label}>Senha:</label>
        <input
          type="password"
          name="senha"
          value={form.senha}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <button type="submit" style={styles.button}>
          ✅ Cadastrar
        </button>
        <button
          type="button"
          onClick={() => navigate("/")}
          style={styles.buttonSecundario}
        >
          ⬅️ Voltar
        </button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    padding: "2rem",
    maxWidth: "500px",
    margin: "0 auto",
    fontFamily: "Arial, sans-serif",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  label: {
    fontWeight: "bold",
  },
  input: {
    padding: "0.7rem",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "1rem",
  },
  button: {
    marginTop: "1rem",
    padding: "0.8rem",
    fontSize: "1rem",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#4caf50",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "bold",
  },
  buttonSecundario: {
    marginTop: "0.5rem",
    padding: "0.8rem",
    fontSize: "1rem",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#9e9e9e",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "bold",
  },
};
