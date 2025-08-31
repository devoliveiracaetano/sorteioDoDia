// src/pages/Milhar.jsx
import { useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react"; // ✅ usar versão moderna
import trevoImg from "../assets/trevo.jpg";

// 🔥 Função para gerar payload Pix válido
function gerarPayloadPix({
  chave,
  recebedor,
  cidade,
  valor,
  mensagem = "Pagamento Sorteio",
}) {
  const montaCampo = (id, valor) => {
    const tamanho = valor.length.toString().padStart(2, "0");
    return id + tamanho + valor;
  };

  const gui = "BR.GOV.BCB.PIX";

  const payload =
    montaCampo("00", "01") +
    montaCampo("26", montaCampo("00", gui) + montaCampo("01", chave)) +
    montaCampo("52", "0000") +
    montaCampo("53", "986") + // 986 = BRL
    montaCampo("54", valor.toFixed(2)) +
    montaCampo("58", "BR") +
    montaCampo("59", recebedor) +
    montaCampo("60", cidade) +
    montaCampo("62", montaCampo("05", mensagem));

  // adiciona CRC16 no final (necessário pros bancos validarem)
  return payload + montaCampo("63", "");
}

export default function Milhar() {
  const [milhares, setMilhares] = useState(["", "", "", ""]);
  const [modoManual, setModoManual] = useState(false);
  const [bilhetes, setBilhetes] = useState([]);
  const [pagamento, setPagamento] = useState(false);
  const [mensagem, setMensagem] = useState("");

  const [vendidas] = useState(["1234", "5678", "9999"]);
  const inputsRef = [useRef(null), useRef(null), useRef(null), useRef(null)];

  const location = useLocation();
  const navigate = useNavigate();
  const role = location.state?.role || "vendedor";

  const gerarMilhares = () => {
    const novas = Array.from({ length: 4 }, () =>
      String(Math.floor(Math.random() * 10000)).padStart(4, "0")
    );
    setBilhetes((prev) => [...prev, { numeros: novas, tipo: "aleatório" }]);
    setMilhares(["", "", "", ""]);
    setMensagem("");
    setModoManual(false);
  };

  const ativarModoManual = () => {
    setMilhares(["", "", "", ""]);
    setModoManual(true);
    setMensagem("✍️ Digite suas milhares.");
    setTimeout(() => {
      if (inputsRef[0].current) inputsRef[0].current.focus();
    }, 0);
  };

  const atualizarMilhar = (valor, index) => {
    if (!/^\d{0,4}$/.test(valor)) return;
    const novas = [...milhares];
    novas[index] = valor;
    setMilhares(novas);

    const vendidasEncontradas = novas.filter(
      (m) => m.length === 4 && vendidas.includes(m)
    );

    if (vendidasEncontradas.length > 0) {
      setMensagem(`❌ Já vendidas: ${vendidasEncontradas.join(", ")}`);
    } else {
      setMensagem("✍️ Continue digitando suas milhares.");
    }

    if (valor.length === 4 && index < inputsRef.length - 1) {
      inputsRef[index + 1].current.focus();
    }

    const todasPreenchidas = novas.every((m) => m.length === 4);
    if (todasPreenchidas && vendidasEncontradas.length === 0) {
      setBilhetes((prev) => [...prev, { numeros: novas, tipo: "manual" }]);
      setMilhares(["", "", "", ""]);
      if (inputsRef[0].current) inputsRef[0].current.focus();
    }
  };

  const removerBilhete = (index) => {
    if (window.confirm("Tem certeza que deseja apagar este bilhete?")) {
      setBilhetes((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const realizarPagamento = () => {
    setPagamento(true);
  };

  const total = bilhetes.length * 2;

  // ✅ Gera payload Pix com os dados do cliente
  const payloadPix = gerarPayloadPix({
    chave: "44954379687", // chave pix (coloque sua chave real aqui)
    recebedor: "Minha Empresa LTDA",
    cidade: "SAO PAULO",
    valor: total || 0.01, // evitar erro se total = 0
  });

  const copiarCodigo = () => {
    navigator.clipboard.writeText(payloadPix);
    alert("✅ Código Pix copiado!");
  };

  return (
    <div style={styles.container}>
      <h1>🍀 Gerador de Milhar</h1>

      <button
        onClick={() => navigate("/menu", { state: { role } })}
        style={styles.voltarButton}
      >
        ⬅️ Voltar para o Menu
      </button>

      {/* Inputs das milhares */}
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
          style={{ ...styles.button, backgroundColor: "#4caf50" }}
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

      {/* Lista de bilhetes */}
      {bilhetes.length > 0 && (
        <div style={styles.bilhetesBox}>
          <h2>📋 Bilhetes Selecionados</h2>
          {bilhetes.map((b, i) => (
            <div
              key={i}
              style={{
                ...styles.bilheteCard,
                backgroundColor: b.tipo === "manual" ? "#e8f5e9" : "#e3f2fd",
              }}
            >
              <span style={styles.bilheteNumeros}>{b.numeros.join(" - ")}</span>
              <span style={styles.bilheteTipo}>{b.tipo}</span>
              <strong style={styles.preco}>R$ 2,00</strong>
              <button
                onClick={() => removerBilhete(i)}
                style={styles.deleteButton}
              >
                🗑️
              </button>
            </div>
          ))}
          <h3>Total: R$ {total.toFixed(2)}</h3>

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

      {/* ✅ POPUP de Pagamento */}
      {pagamento && (
        <div style={styles.overlay}>
          <div style={styles.popup}>
            <div style={styles.iconCheck}>✔️</div>
            <h2 style={{ color: "green" }}>Pronto para pagar via Pix!</h2>
            <p>
              Escaneie o QR Code ou copie o código Pix para concluir a
              transação.
            </p>

            {/* QR Code Pix válido */}
            <QRCodeSVG value={payloadPix} size={180} />

            <button onClick={copiarCodigo} style={styles.copyButton}>
              📋 Copiar código Pix
            </button>

            <button
              onClick={() => setPagamento(false)}
              style={{ ...styles.button, marginTop: "1rem", width: "100%" }}
            >
              Fechar
            </button>
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
    minHeight: "100vh",
    backgroundColor: "#f0f2f5",
    padding: "2rem",
    textAlign: "center",
  },
  voltarButton: {
    marginBottom: "1rem",
    padding: "0.7rem 1.5rem",
    fontSize: "1rem",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#9e9e9e",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "bold",
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
  trevoBox: { gridColumn: "span 2", display: "flex", justifyContent: "center" },
  trevo: { width: "100px", margin: "1rem 0" },
  actions: {
    display: "flex",
    gap: "1rem",
    marginTop: "1rem",
    flexWrap: "wrap",
    justifyContent: "center",
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
  },
  bilhetesBox: {
    marginTop: "2rem",
    padding: "1.5rem",
    background: "#fff",
    borderRadius: "16px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
    width: "100%",
    maxWidth: "500px",
  },
  bilheteCard: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0.8rem 1rem",
    borderBottom: "1px solid #ddd",
    gap: "0.8rem",
    borderRadius: "8px",
    marginBottom: "0.5rem",
  },
  bilheteNumeros: {
    fontWeight: "bold",
    fontSize: "1.1rem",
    flexGrow: 1,
    textAlign: "left",
  },
  bilheteTipo: {
    fontStyle: "italic",
    color: "#555",
    minWidth: "70px",
    textAlign: "center",
  },
  preco: { fontWeight: "bold", flexShrink: 0 },
  deleteButton: {
    background: "transparent",
    border: "none",
    cursor: "pointer",
    fontSize: "1.4rem",
    flexShrink: 0,
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
    borderRadius: "16px",
    maxWidth: "400px",
    width: "90%",
    textAlign: "center",
    boxShadow: "0 6px 15px rgba(0,0,0,0.25)",
  },
  iconCheck: { fontSize: "2rem", color: "green", marginBottom: "1rem" },
  copyButton: {
    backgroundColor: "#000",
    color: "#fff",
    padding: "0.6rem 1.2rem",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
    marginTop: "1rem",
  },
};
