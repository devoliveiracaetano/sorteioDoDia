import { useState, useRef } from "react";
import trevoImg from "../assets/trevo.jpg";

export default function Milhar() {
  const [milhares, setMilhares] = useState(["", "", "", ""]);
  const [pagamentoGerado, setPagamentoGerado] = useState(false);
  const [modoManual, setModoManual] = useState(false);

  // 🔴 Milhares já vendidas (simulação)
  const [vendidas] = useState(["1234", "5678", "9999"]);
  const [mensagem, setMensagem] = useState("");

  // 🔎 refs para os inputs
  const inputsRef = [useRef(null), useRef(null), useRef(null), useRef(null)];

  const gerarMilhares = () => {
    const novas = Array.from({ length: 4 }, () =>
      String(Math.floor(Math.random() * 10000)).padStart(4, "0")
    );
    setMilhares(novas);
    setPagamentoGerado(true);
    setMensagem("");
    setModoManual(false);
  };

  const realizarPagamento = () => {
    alert("💳 Pagamento realizado com sucesso!");
  };

  const ativarModoManual = () => {
    setMilhares(["", "", "", ""]);
    setModoManual(true);
    setPagamentoGerado(false);
    setMensagem("✍️ Digite suas milhares.");
    // 👉 coloca o foco no primeiro input
    setTimeout(() => {
      if (inputsRef[0].current) {
        inputsRef[0].current.focus();
      }
    }, 0);
  };

  const atualizarMilhar = (valor, index) => {
    if (!/^\d{0,4}$/.test(valor)) return; // só números até 4 dígitos
    const novas = [...milhares];
    novas[index] = valor;
    setMilhares(novas);

    // 🔎 verifica milhares vendidas a cada digitação
    const vendidasEncontradas = novas.filter(
      (m) => m.length === 4 && vendidas.includes(m)
    );

    if (vendidasEncontradas.length > 0) {
      setMensagem(`❌ Já vendidas: ${vendidasEncontradas.join(", ")}`);
    } else {
      setMensagem("✍️ Continue digitando suas milhares.");
    }

    // 👉 se completou 4 dígitos, pula para o próximo input
    if (valor.length === 4 && index < inputsRef.length - 1) {
      inputsRef[index + 1].current.focus();
    }
  };

  const todasPreenchidas = milhares.every((m) => m.length === 4);
  const algumaVendida = milhares.some((m) => vendidas.includes(m));

  const pagamentoHabilitado = modoManual
    ? todasPreenchidas && !algumaVendida
    : pagamentoGerado;

  const podeGerar = !modoManual || (modoManual && todasPreenchidas);

  return (
    <div style={styles.container}>
      <h1>🍀 Gerador de Milhar</h1>

      <div style={styles.grid}>
        {milhares.map((milhar, i) => (
          <input
            key={i}
            ref={inputsRef[i]}
            type="text"
            value={milhar}
            disabled={!modoManual}
            onChange={(e) => atualizarMilhar(e.target.value, i)}
            style={{
              ...styles.input,
              borderColor: vendidas.includes(milhar) ? "red" : "#4caf50",
              color: vendidas.includes(milhar) ? "red" : "black",
            }}
          />
        ))}

        <div style={styles.trevoBox}>
          <img src={trevoImg} alt="Trevo" style={styles.trevo} />
        </div>
      </div>

      {mensagem && <p style={{ fontWeight: "bold" }}>{mensagem}</p>}

      <div style={styles.actions}>
        <button
          onClick={gerarMilhares}
          style={{
            ...styles.button,
            backgroundColor: podeGerar ? "#4caf50" : "#aaa",
            cursor: podeGerar ? "pointer" : "not-allowed",
          }}
          disabled={!podeGerar}
        >
          Gerar Milhares
        </button>

        <button
          onClick={realizarPagamento}
          style={{
            ...styles.button,
            backgroundColor: pagamentoHabilitado ? "#2196f3" : "#aaa",
            cursor: pagamentoHabilitado ? "pointer" : "not-allowed",
          }}
          disabled={!pagamentoHabilitado}
        >
          Realizar Pagamento
        </button>

        <button
          onClick={ativarModoManual}
          style={{ ...styles.button, backgroundColor: "#ff9800" }}
        >
          ✍️ Digitar Milhares
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
