import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function CadastroAdministrador() {
  const navigate = useNavigate();
  const location = useLocation();

  // 🔹 Recupera a role passada pelo Login/Menu
  const role = location.state?.role || "admin";

  const [form, setForm] = useState({
    nome: "",
    apelido: "",
    email: "",
    telefone: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "telefone") {
      // 🔹 aplica máscara (99) 99999-9999
      let v = value.replace(/\D/g, "");
      v = v.replace(/^(\d{2})(\d)/g, "($1) $2");
      v = v.replace(/(\d{5})(\d{4})$/, "$1-$2");
      setForm({ ...form, [name]: v });
    } else {
      setForm({ ...form, [name]: value });
    }

    // 🔹 limpar erro ao digitar
    setErrors({ ...errors, [name]: "" });
  };

  const validate = () => {
    let newErrors = {};
    if (!form.nome.trim()) newErrors.nome = "Nome é obrigatório";
    if (!form.email.trim()) newErrors.email = "E-mail é obrigatório";
    if (!form.telefone.trim()) newErrors.telefone = "Telefone é obrigatório";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    console.log("📌 Administrador cadastrado:", form);
    alert("Administrador cadastrado com sucesso!");

    // 🔹 Volta para o Menu respeitando a role
    navigate("/menu", { state: { role } });
  };

  return (
    <div style={styles.container}>
      <h1>📝 Cadastro de Administrador</h1>

      <form onSubmit={handleSubmit} style={styles.form}>
        <label style={styles.labelObrigatorio}>
          Nome <span style={styles.asterisco}>*</span>
        </label>
        <input
          type="text"
          name="nome"
          value={form.nome}
          onChange={handleChange}
          style={{
            ...styles.input,
            borderColor: errors.nome ? "#d32f2f" : "#ccc",
          }}
        />
        {errors.nome && <span style={styles.error}>{errors.nome}</span>}

        <label style={styles.label}>Como quer ser chamado? (Apelido):</label>
        <input
          type="text"
          name="apelido"
          value={form.apelido}
          onChange={handleChange}
          style={styles.input}
        />

        <label style={styles.labelObrigatorio}>
          E-mail <span style={styles.asterisco}>*</span>
        </label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          style={{
            ...styles.input,
            borderColor: errors.email ? "#d32f2f" : "#ccc",
          }}
        />
        {errors.email && <span style={styles.error}>{errors.email}</span>}

        <label style={styles.labelObrigatorio}>
          Telefone <span style={styles.asterisco}>*</span>
        </label>
        <input
          type="tel"
          name="telefone"
          value={form.telefone}
          onChange={handleChange}
          maxLength="15"
          style={{
            ...styles.input,
            borderColor: errors.telefone ? "#d32f2f" : "#ccc",
          }}
        />
        {errors.telefone && <span style={styles.error}>{errors.telefone}</span>}

        <button type="submit" style={styles.button}>
          ✅ Cadastrar
        </button>
        <button
          type="button"
          onClick={() => navigate("/menu", { state: { role } })}
          style={styles.buttonSecundario}
        >
          ⬅️ Voltar ao Menu
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
  labelObrigatorio: {
    fontWeight: "bold",
    color: "#d32f2f",
  },
  asterisco: {
    color: "#d32f2f",
    fontWeight: "bold",
  },
  input: {
    padding: "0.7rem",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "1rem",
  },
  error: {
    color: "#d32f2f",
    fontSize: "0.9rem",
    marginTop: "-0.5rem",
    marginBottom: "0.5rem",
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
