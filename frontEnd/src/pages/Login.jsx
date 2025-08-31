import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MdEmail, MdLock } from "react-icons/md";
import trevoImg from "../assets/trevo.jpg";
import jogarImg from "../assets/jogar.png";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [sorte, setSorte] = useState(generateSorte());
  const navigate = useNavigate();

  function generateSorte() {
    const frases = [
      "Acredite e coisas boas virão!",
      "Sorte e alegria estão no ar!",
      "Um número da sorte: " + Math.floor(Math.random() * 100 + 1),
      "Algo inesperado vai acontecer!",
    ];
    return frases[Math.floor(Math.random() * frases.length)];
  }

  // 🔹 Sempre que entrar na tela de login, limpar os inputs
  useEffect(() => {
    setEmail("");
    setPassword("");
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();

    if (email === "admin@teste.com") {
      navigate("/menu", { state: { role: "admin" } });
    } else {
      navigate("/menu", { state: { role: "vendedor" } });
    }
  };

  const handleNovaSorte = () => {
    setSorte(generateSorte());
  };

  const isFormValid = email.trim() !== "" && password.trim() !== "";

  return (
    <div style={styles.container}>
      {/* Cartão de Login */}
      <div style={styles.card}>
        <h2>🎟️ Sorte do Dia</h2>
        <img src={trevoImg} alt="Trevo" style={styles.logo} />
        <h2>Login</h2>

        <form onSubmit={handleLogin} style={styles.form}>
          <div style={styles.inputGroup}>
            <MdEmail style={styles.icon} />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <MdLock style={styles.icon} />
            <input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              required
            />
          </div>

          <button
            type="submit"
            style={{
              ...styles.button,
              backgroundColor: isFormValid ? "#4caf50" : "#aaa",
              cursor: isFormValid ? "pointer" : "not-allowed",
            }}
            disabled={!isFormValid}
          >
            Entrar
          </button>
        </form>

        <p style={styles.linkText}>
          <a href="#">Esqueceu sua senha?</a>
        </p>
        <p style={styles.footer}>
          © 2025 Minha Empresa · <a href="#">Termos do Serviço</a> ·{" "}
          <a href="#">Política de Privacidade</a>
        </p>
      </div>

      {/* Cartão Sorte do Dia */}
      <div style={styles.sorteCard}>
        <h2>🍀 Sua Sorte</h2>
        <img src={jogarImg} alt="Jogar" style={styles.sorteImage} />
        <p style={styles.sorteText}>{sorte}</p>
        <button onClick={handleNovaSorte} style={styles.button}>
          Nova Sorte
        </button>
      </div>
    </div>
  );
}

// Estilos inline
const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f0f2f5",
    gap: "2rem",
    padding: "1rem",
    flexWrap: "wrap",
  },
  card: {
    padding: "2rem",
    borderRadius: "8px",
    backgroundColor: "#fff",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    textAlign: "center",
    width: "300px",
  },
  logo: {
    width: "80px",
    marginBottom: "1rem",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  inputGroup: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  },
  input: {
    flex: 1,
    padding: "0.5rem",
    borderRadius: "4px",
    border: "1px solid #ccc",
    fontSize: "1rem",
  },
  icon: {
    fontSize: "1.2rem",
    color: "#666",
  },
  button: {
    padding: "0.5rem",
    borderRadius: "4px",
    border: "none",
    backgroundColor: "#4caf50",
    color: "#fff",
    fontSize: "1rem",
    marginTop: "0.5rem",
    cursor: "pointer",
    fontWeight: "bold",
  },
  sorteCard: {
    padding: "2rem",
    borderRadius: "8px",
    backgroundColor: "#fff",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    textAlign: "center",
    width: "300px",
  },
  sorteText: {
    fontSize: "1.2rem",
    margin: "1rem 0",
  },
  sorteImage: {
    width: "100px",
    margin: "1rem 0",
  },
  linkText: {
    fontSize: "0.9rem",
    marginTop: "0.5rem",
  },
  footer: {
    marginTop: "1rem",
    fontSize: "0.8rem",
    color: "#777",
  },
};
