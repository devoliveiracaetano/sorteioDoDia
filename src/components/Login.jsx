import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdEmail, MdLock } from "react-icons/md"; // Ícones
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

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("Email:", email, "Senha:", password);
    navigate("/dashboard");
  };

  return (
    <div style={styles.container}>
      {/* Cartão de Login */}
      <div style={styles.card}>
        <img src={trevoImg} alt="Trevo" style={styles.logo} />
        <h2>Login</h2>

        {/* Não tem conta */}
        <p style={styles.smallText}>
          Não tem uma conta?{" "}
          <a href="/register" style={styles.link}>
            Cadastre-se
          </a>
        </p>

        <form onSubmit={handleLogin} style={styles.form}>
          {/* Input Email com ícone */}
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

          {/* Input Senha com ícone */}
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

          <button type="submit" style={styles.button}>
            Entrar
          </button>
        </form>

        {/* Link de esqueci senha */}
        <div style={styles.links}>
          <p>
            <a href="/forgot-password" style={styles.link}>
              Esqueceu sua senha?
            </a>
          </p>
        </div>

        {/* Footer */}
        <footer style={styles.footer}>
          <p>
            <a href="/terms" style={styles.link}>
              Termos do Serviço
            </a>{" "}
            |{" "}
            <a href="/privacy" style={styles.link}>
              Política de Privacidade
            </a>
          </p>
          <p>© {new Date().getFullYear()} Sorte do Dia</p>
        </footer>
      </div>

      {/* Cartão Sorte do Dia */}
      <div style={styles.card}>
        <h2>Sorte do Dia 🍀</h2>
        <img src={jogarImg} alt="Jogar" style={styles.sorteImage} />
        <p style={styles.sorteText}>{sorte}</p>
        <button onClick={() => setSorte(generateSorte())} style={styles.button}>
          Nova Sorte
        </button>
      </div>
    </div>
  );
}

// Estilos
const baseCard = {
  padding: "2rem",
  borderRadius: "8px",
  backgroundColor: "#fff",
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  textAlign: "center",
  width: "300px",
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    minHeight: "100vh",
    backgroundColor: "#f0f2f5",
    gap: "2rem",
    padding: "1rem",
    flexWrap: "wrap", // Responsivo
  },
  card: {
    ...baseCard,
    flex: "1 1 300px",
  },
  logo: {
    width: "120px",
    height: "auto",
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
    border: "1px solid #ccc",
    borderRadius: "4px",
    padding: "0.3rem 0.5rem",
    backgroundColor: "#fff",
  },
  icon: {
    fontSize: "1.2rem",
    color: "#666",
    marginRight: "0.5rem",
  },
  input: {
    flex: 1,
    border: "none",
    outline: "none",
    fontSize: "1rem",
  },
  button: {
    padding: "0.5rem",
    borderRadius: "4px",
    border: "none",
    backgroundColor: "#4caf50",
    color: "#fff",
    fontSize: "1rem",
    cursor: "pointer",
    marginTop: "0.5rem",
  },
  smallText: {
    fontSize: "0.9rem",
    margin: "0.5rem 0 1.5rem 0",
    color: "#555",
  },
  links: {
    marginTop: "1rem",
    fontSize: "0.9rem",
  },
  link: {
    color: "#4caf50",
    textDecoration: "none",
  },
  footer: {
    marginTop: "2rem",
    fontSize: "0.8rem",
    color: "#666",
  },
  sorteText: {
    fontSize: "1.2rem",
    margin: "1rem 0",
  },
  sorteImage: {
    width: "120px",
    height: "auto",
    margin: "1rem 0",
  },
};
