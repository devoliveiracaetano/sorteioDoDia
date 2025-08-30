import { useState } from "react";
import trevoImg from "../assets/trevo.jpg";

export default function Milhar() {
  const [milhares, setMilhares] = useState(["", "", "", ""]);
  const [habilitarPagamento, setHabilitarPagamento] = useState(false);

  const gerarMilhares = () => {
    const novas = Array.from({ length: 4 }, () =>
      String(Math.floor(Math.random() * 10000)).padStart(4, "0")
    );
    setMilhares(novas);
    setHabilitarPagamento(true); // habilita o botão pagamento
  };

  const realizarPagamento = () => {
    alert("💳 Pagamento realizado com sucesso!");
  };

  return (
    <div style={styles.container}>
      <h1>🍀 Gerador de Milhar</h1>

      <div style={styles.grid}>
        {/* Primeira linha */}
        <input type="text" value={milhares[0]} disabled style={styles.input} />
        <input type="text" value={milhares[1]} disabled style={styles.input} />

        {/* Imagem do trevo */}
        <div style={styles.trevoBox}>
          <img src={trevoImg} alt="Trevo" style={styles.trevo} />
        </div>

        {/* Segunda linha */}
        <input type="text" value={milhares[2]} disabled style={styles.input} />
        <input type="text" value={milhares[3]} disabled style={styles.input} />
      </div>

      {/* Botões lado a lado */}
      <div style={styles.actions}>
        <button onClick={gerarMilhares} style={styles.button}>
          Gerar Milhares
        </button>
        <button
          onClick={realizarPagamento}
          style={{
            ...styles.button,
            backgroundColor: habilitarPagamento ? "#2196f3" : "#aaa",
            cursor: habilitarPagamento ? "pointer" : "not-allowed",
          }}
          disabled={!habilitarPagamento}
        >
          Realizar Pagamento
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
    justifyContent: "center",
    minHeight: "100vh",
    backgroundColor: "#f0f2f5",
    padding: "2rem",
    textAlign: "center",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "1rem",
    alignItems: "center",
    justifyItems: "center",
    margin: "2rem 0",
  },
  input: {
    width: "120px",
    padding: "0.7rem",
    fontSize: "1.5rem",
    textAlign: "center",
    borderRadius: "8px",
    border: "2px solid #4caf50",
    backgroundColor: "#fff",
    fontWeight: "bold",
  },
  trevoBox: {
    gridColumn: "span 2",
    display: "flex",
    justifyContent: "center",
  },
  trevo: {
    width: "100px",
    margin: "1rem 0",
  },
  actions: {
    display: "flex",
    gap: "1rem",
    marginTop: "1rem",
  },
  button: {
    padding: "0.7rem 1.5rem",
    fontSize: "1.2rem",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#4caf50",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "0.3s",
  },
};
