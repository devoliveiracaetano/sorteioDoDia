import { useState, useRef } from "react";
import trevoImg from "../assets/trevo.jpg";

export default function Milhar() {
  const [milhares, setMilhares] = useState(["", "", "", ""]);
  const [modoManual, setModoManual] = useState(false);
  const [bilhetes, setBilhetes] = useState([]); // 📌 bilhetes confirmados

  // 🔴 Milhares já vendidas (simulação)
  const [vendidas] = useState(["1234", "5678", "9999"]);
  const [mensagem, setMensagem] = useState("");

  // 🔎 refs para os inputs
  const inputsRef = [useRef(null), useRef(null), useRef(null), useRef(null)];

  const gerarMilhares = () => {
    const novas = Array.from({ length: 4 }, () =>
      String(Math.floor(Math.random() * 10000)).padStart(4, "0")
    );

    // adiciona bilhete como aleatório
    setBilhetes((prev) => [...prev, { numeros: novas, tipo: "aleatório" }]);

    // limpa os inputs e mantém desabilitados
    setMilhares(["", "", "", ""]);
    setMensagem("");
    setModoManual(false);
  };

  const realizarPagamento = () => {
    alert("💳 Pagamento realizado com sucesso!");
    setBilhetes([]);
  };

  const ativarModoManual = () => {
    setMilhares(["", "", "", ""]);
    setModoManual(true);
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

    // 📌 quando todas estiverem preenchidas, adiciona bilhete manual
    const todasPreenchidas = novas.every((m) => m.length === 4);
    if (todasPreenchidas && vendidasEncontradas.length === 0) {
      setBilhetes((prev) => [...prev, { numeros: novas, tipo: "manual" }]);
      setMilhares(["", "", "", ""]); // limpa os inputs p/ próximo bilhete
      if (inputsRef[0].current) inputsRef[0].current.focus();
    }
  };

  const removerBilhete = (index) => {
    if (window.confirm("Tem certeza que deseja apagar este bilhete?")) {
      setBilhetes((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const total = bilhetes.length * 2;

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
            backgroundColor: "#4caf50",
            cursor: "pointer",
          }}
        >
          Gerar Milhares
        </button>

        <button
          onClick={ativarModoManual}
          style={{ ...styles.button, backgroundColor: "#ff9800" }}
        >
          ✍️ Digitar Milhares
        </button>
      </div>

      {/* 🟢 Lista de bilhetes gerados */}
      {bilhetes.length > 0 && (
        <div style={styles.bilhetesBox}>
          <h2>📋 Bilhetes Selecionados</h2>
          {bilhetes.map((b, i) => (
            <div
              key={i}
              style={{
                ...styles.bilheteCard,
                backgroundColor: b.tipo === "manual" ? "#e8f5e9" : "#e3f2fd", // cor diferente
              }}
            >
              <span style={styles.bilheteNumeros}>{b.numeros.join(" - ")}</span>
              <span style={styles.bilheteTipo}>{b.tipo}</span>
              <strong>R$ 2,00</strong>
              <button
                onClick={() => removerBilhete(i)}
                style={styles.deleteButton}
              >
                🗑️
              </button>
            </div>
          ))}
          <h3>Total: R$ {total.toFixed(2)}</h3>

          {/* 🔵 Botão de pagamento agora no final */}
          <button
            onClick={realizarPagamento}
            style={{
              ...styles.button,
              backgroundColor: bilhetes.length > 0 ? "#2196f3" : "#aaa",
              cursor: bilhetes.length > 0 ? "pointer" : "not-allowed",
              marginTop: "1rem",
              width: "100%",
            }}
            disabled={bilhetes.length === 0}
          >
            💳 Realizar Pagamento
          </button>
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
  bilhetesBox: {
    marginTop: "2rem",
    padding: "1.5rem",
    background: "#fff",
    borderRadius: "16px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
    width: "500px",
  },
  bilheteCard: {
    display: "grid",
    gridTemplateColumns: "1fr auto auto auto",
    alignItems: "center",
    padding: "0.8rem 1rem",
    borderBottom: "1px solid #ddd",
    gap: "0.8rem",
    fontSize: "1.2rem",
    borderRadius: "8px",
    marginBottom: "0.5rem",
  },
  bilheteNumeros: {
    fontWeight: "bold",
    whiteSpace: "nowrap", // garante que fica tudo em uma linha
  },
  bilheteTipo: {
    fontStyle: "italic",
    color: "#555",
  },
  deleteButton: {
    background: "transparent",
    border: "none",
    cursor: "pointer",
    fontSize: "1.4rem",
  },
};
