// src/pages/Milhar.jsx
import { useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import trevoImg from "../assets/trevo.jpg";

// 🔑 Função para formatar campo EMV
function formatEMV(id, value) {
  const length = String(value.length).padStart(2, "0");
  return id + length + value;
}

// 🔑 Cálculo CRC16 para Pix
function crc16(payload) {
  let polinomio = 0x1021;
  let resultado = 0xffff;

  for (let i = 0; i < payload.length; i++) {
    resultado ^= payload.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      if ((resultado <<= 1) & 0x10000) resultado ^= polinomio;
      resultado &= 0xffff;
    }
  }

  return resultado.toString(16).toUpperCase().padStart(4, "0");
}

// 🔑 Gerador do payload Pix dinâmico
function gerarPixPayload({ chave, nome, cidade, identificador, valor }) {
  const gui =
    formatEMV("00", "01") +
    formatEMV("01", "11") +
    formatEMV("25", "BR.GOV.BCB.PIX");
  const chavePix = formatEMV("01", chave);
  const merchantAccount = formatEMV("26", gui + chavePix);
  const merchantCategory = formatEMV("52", "0000");
  const moeda = formatEMV("53", "986");
  const valorFormatado = formatEMV("54", valor.toFixed(2));
  const pais = formatEMV("58", "BR");
  const nomeBenef = formatEMV("59", nome);
  const cidadeBenef = formatEMV("60", cidade);
  const txid = formatEMV("05", identificador);
  const adicionais = formatEMV("62", txid);

  let payload =
    formatEMV("00", "01") +
    formatEMV("01", "12") +
    merchantAccount +
    merchantCategory +
    moeda +
    valorFormatado +
    pais +
    nomeBenef +
    cidadeBenef +
    adicionais +
    "6304";

  return payload + crc16(payload);
}

export default function Milhar() {
  const [milhares, setMilhares] = useState(["", "", "", ""]);
  const [modoManual, setModoManual] = useState(false);
  const [bilhetes, setBilhetes] = useState([]);
  const [pagamento, setPagamento] = useState(false);
  const [pixPayload, setPixPayload] = useState("");

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
    setModoManual(false);
  };

  const ativarModoManual = () => {
    setMilhares(["", "", "", ""]);
    setModoManual(true);
    setTimeout(() => {
      if (inputsRef[0].current) inputsRef[0].current.focus();
    }, 0);
  };

  const atualizarMilhar = (valor, index) => {
    if (!/^\d{0,4}$/.test(valor)) return;
    const novas = [...milhares];
    novas[index] = valor;
    setMilhares(novas);

    if (valor.length === 4 && index < inputsRef.length - 1) {
      inputsRef[index + 1].current.focus();
    }

    const todasPreenchidas = novas.every((m) => m.length === 4);
    if (todasPreenchidas && !novas.some((m) => vendidas.includes(m))) {
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
    const total = 0.0; // 🔒 valor fixo só pra teste
    const payload = gerarPixPayload({
      chave: "11999999999", // 🔑 sua chave Pix aqui
      nome: "SORTEIO DIA",
      cidade: "SAO PAULO",
      identificador: "TX12345",
      valor: total,
    });
    setPixPayload(payload);
    setPagamento(true);
  };

  const copiarCodigo = () => {
    navigator.clipboard.writeText(pixPayload);
    alert("✅ Código Pix copiado!");
  };

  const total = bilhetes.length * 2;

  return (
    <div style={styles.container}>
      <h1>🍀 Gerador de Milhar</h1>

      <button
        onClick={() => navigate("/menu", { state: { role } })}
        style={styles.voltarButton}
      >
        ⬅️ Voltar para o Menu
      </button>

      <div style={styles.grid}>
        {milhares.map((milhar, i) => (
          <input
            key={i}
            ref={inputsRef[i]}
            type="text"
            value={milhar}
            disabled={!modoManual}
            onChange={(e) => atualizarMilhar(e.target.value, i)}
            style={styles.input}
          />
        ))}
        <div style={styles.trevoBox}>
          <img src={trevoImg} alt="Trevo" style={styles.trevo} />
        </div>
      </div>

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

      {bilhetes.length > 0 && (
        <div style={styles.bilhetesBox}>
          <h2>📋 Bilhetes Selecionados</h2>
          {bilhetes.map((b, i) => (
            <div key={i} style={styles.bilheteCard}>
              <span>{b.numeros.join(" - ")}</span>
              <span>{b.tipo}</span>
              <strong>R$ 2,00</strong>
              <button onClick={() => removerBilhete(i)}>🗑️</button>
            </div>
          ))}
          <h3>Total: R$ {total.toFixed(2)}</h3>
          <button
            onClick={realizarPagamento}
            style={styles.button}
            disabled={bilhetes.length === 0}
          >
            💳 Realizar Pagamento
          </button>
        </div>
      )}

      {/* MODAL DE PAGAMENTO */}
      {pagamento && (
        <div style={styles.overlay}>
          <div style={styles.popup}>
            {/* Cabeçalho */}
            <div style={styles.header}>
              <div style={styles.iconCircle}>
                <span className="checkmark">✔</span>
              </div>
              <h2 style={styles.title}>Pronto para digitalizar!</h2>
              <p style={styles.subtitle}>
                Use o código QR para prosseguir com a transação. <br />
                Quando a transação for concluída, você receberá uma notificação.
              </p>
            </div>

            {/* QR Code */}
            <div style={{ margin: "2rem 0" }}>
              <QRCodeSVG value={pixPayload} size={220} />
            </div>

            {/* Apenas o botão de copiar */}
            <button onClick={copiarCodigo} style={styles.copyButton}>
              📋 Copiar código Pix
            </button>

            {/* Fechar */}
            <button
              onClick={() => setPagamento(false)}
              style={{ ...styles.button, marginTop: "1.5rem", width: "100%" }}
            >
              Fechar
            </button>
          </div>
        </div>
      )}

      {/* Animação CSS inline */}
      <style>
        {`
          .checkmark {
            display: inline-block;
            font-size: 2rem;
            opacity: 0;
            transform: scale(0.5);
            animation: popIn 0.6s ease forwards;
          }
          @keyframes popIn {
            to {
              opacity: 1;
              transform: scale(1);
            }
          }
        `}
      </style>
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
  voltarButton: { marginBottom: "1rem" },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "1rem",
    margin: "2rem 0",
  },
  input: { width: "100px", fontSize: "1.5rem", textAlign: "center" },
  trevoBox: { gridColumn: "span 2", textAlign: "center" },
  trevo: { width: "100px" },
  actions: { display: "flex", gap: "1rem" },
  button: {
    padding: "0.7rem 1.5rem",
    fontSize: "1rem",
    cursor: "pointer",
    borderRadius: "8px",
  },
  bilhetesBox: {
    marginTop: "2rem",
    padding: "1rem",
    background: "#fff",
    borderRadius: "12px",
    boxShadow: "0px 2px 8px rgba(0,0,0,0.1)",
  },
  bilheteCard: {
    display: "flex",
    gap: "1rem",
    justifyContent: "space-between",
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
    zIndex: 9999,
  },
  popup: {
    background: "#fff",
    padding: "2rem",
    borderRadius: "16px",
    textAlign: "center",
    width: "400px",
    boxShadow: "0px 4px 12px rgba(0,0,0,0.15)",
  },
  header: { marginBottom: "1rem" },
  iconCircle: {
    width: "70px",
    height: "70px",
    borderRadius: "50%",
    backgroundColor: "#4caf50",
    color: "white",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: "0 auto 1rem",
  },
  title: { margin: "0.5rem 0", fontSize: "1.5rem", color: "#333" },
  subtitle: { fontSize: "0.95rem", color: "#666" },
  copyButton: {
    marginTop: "1rem",
    padding: "0.7rem 1rem",
    background: "black",
    color: "white",
    fontSize: "1rem",
    borderRadius: "8px",
    cursor: "pointer",
    width: "100%",
  },
};
