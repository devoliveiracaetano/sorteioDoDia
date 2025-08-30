import { useState } from "react";
import { useNavigate } from "react-router-dom";
import trevoImg from "../assets/trevo.jpg";
import jogarImg from "../assets/jogar.png"; // Imagem de incentivo

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [sorte, setSorte] = useState(generateSorte());
  const navigate = useNavigate();

  function generateSorte() {
    const frases = [
      "Hoje é seu dia de sorte!",
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

  const handleNovaSorte = () => {
    setSorte(generateSorte());
  };

  return (
    <div style={styles.container}>
      {/* Cartão de Login */}
      <div style={styles.card}>
        <img src={trevoImg} alt="Trevo" style={styles.image} />
        <h2>Login</h2>
        <form onSubmit={handleLogin} style={styles.form}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            required
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            required
          />
          <button type="submit" style={styles.button}>
            Entrar
          </button>
        </form>
      </div>

      {/* Cartão Sorte do Dia */}
      <div style={styles.sorteCard}>
        <h2>Sorte do Dia 🍀</h2>
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
  },
  card: {
    padding: "2rem",
    borderRadius: "8px",
    backgroundColor: "#fff",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    textAlign: "center",
    width: "300px",
  },
  image: {
    width: "80px",
    marginBottom: "1rem",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  input: {
    padding: "0.5rem",
    borderRadius: "4px",
    border: "1px solid #ccc",
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
};
