// src/pages/Milhar.jsx
import { useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import trevoImg from "../assets/trevo.jpg";

/* ================= Helpers PIX ================= */

// Remove acentos e caracteres não-ASCII básicos
function sanitize(text) {
  return (text || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^A-Za-z0-9 ]/g, "")
    .toUpperCase();
}

// Formata campo EMV: ID + len(2) + valor
function formatEMV(id, value) {
  const val = String(value ?? "");
  const length = String(val.length).padStart(2, "0");
  return id + length + val;
}

// CRC16-CCITT (0x1021), init 0xFFFF
function crc16(payload) {
  let crc = 0xffff;
  for (let i = 0; i < payload.length; i++) {
    crc ^= payload.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      if (crc & 0x8000) crc = (crc << 1) ^ 0x1021;
      else crc <<= 1;
      crc &= 0xffff;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, "0");
}

/**
 * Gera payload Pix ESTÁTICO (Point of Initiation Method = "11")
 * Campos principais:
 * 00=01, 01=11, 26(MAI: 00 GUI, 01 CHAVE), 52, 53, [54], 58, 59, 60, 62(05=TXID), 63(CRC)
 */
function gerarPixPayload({ chave, nome, cidade, identificador, valor }) {
  const nomeSan = sanitize(nome).slice(0, 25) || "NAO INFORMADO";
  const cidadeSan = sanitize(cidade).slice(0, 15) || "CIDADE";
  const txid =
    (identificador || "TXID").replace(/[^A-Za-z0-9]/g, "").slice(0, 25) ||
    "TXID";

  // Merchant Account Information (ID 26)
  const mai =
    formatEMV("00", "BR.GOV.BCB.PIX") + // GUI
    formatEMV("01", String(chave)); // Chave PIX (CPF neste caso)

  // Montagem do payload
  let payload =
    formatEMV("00", "01") + // Payload Format Indicator
    formatEMV("01", "11") + // Static
    formatEMV("26", mai) + // Merchant Account Info
    formatEMV("52", "0000") + // Merchant Category Code
    formatEMV("53", "986"); // Moeda (BRL)

  // Valor: só inclui se > 0; se 0/ausente, omite para permitir digitação no app
  if (valor && valor > 0) {
    payload += formatEMV("54", Number(valor).toFixed(2));
  }

  payload +=
    formatEMV("58", "BR") + // País
    formatEMV("59", nomeSan) + // Nome recebedor (<=25)
    formatEMV("60", cidadeSan) + // Cidade (<=15)
    formatEMV("62", formatEMV("05", txid)) + // Additional Data Template / TXID
    "6304"; // CRC placeholder

  // Apende CRC calculado
  return payload + crc16(payload);
}

/* ================== Componente ================== */

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
    setTimeout(() => inputsRef[0].current?.focus(), 0);
  };

  const atualizarMilhar = (valor, index) => {
    if (!/^\d{0,4}$/.test(valor)) return;
    const novas = [...milhares];
    novas[index] = valor;
    setMilhares(novas);

    if (valor.length === 4 && index < inputsRef.length - 1) {
      inputsRef[index + 1].current?.focus();
    }

    const todasPreenchidas = novas.every((m) => m.length === 4);
    if (todasPreenchidas && !novas.some((m) => vendidas.includes(m))) {
      setBilhetes((prev) => [...prev, { numeros: novas, tipo: "manual" }]);
      setMilhares(["", "", "", ""]);
      inputsRef[0].current?.focus();
    }
  };

  const removerBilhete = (index) => {
    if (window.confirm("Tem certeza que deseja apagar este bilhete?")) {
      setBilhetes((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const total = bilhetes.length * 2; // R$2 por bilhete

  const realizarPagamento = () => {
    // Gera TXID curto e único
    const txid = "SD" + Date.now().toString().slice(-10);

    const payload = gerarPixPayload({
      chave: "44954379687", // ✅ sua chave CPF
      nome: "SorteioDoDia",
      cidade: "Aguas Lindas de Goias", // será sanitizado e truncado
      identificador: txid,
      valor: total > 0 ? total : undefined, // se 0, omite 54 (usuário digita)
    });

    setPixPayload(payload);
    setPagamento(true);
  };

  const copiarCodigo = () => {
    if (!pixPayload) return;
    navigator.clipboard.writeText(pixPayload);
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
              <span style={{ fontStyle: "italic", color: "#555" }}>
                {b.tipo}
              </span>
              <strong>R$ 2,00</strong>
              <button onClick={() => removerBilhete(i)} style={styles.trashBtn}>
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

      {/* ===== Modal de Pagamento ===== */}
      {pagamento && (
        <div style={styles.overlay}>
          <div style={styles.popup}>
            {/* Ícone + título + texto (com animação simples) */}
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
            <div style={{ margin: "1.5rem 0" }}>
              <QRCodeSVG value={pixPayload} size={220} includeMargin />
            </div>

            {/* Botão copiar (sem textarea) */}
            <button onClick={copiarCodigo} style={styles.copyButton}>
              📋 Copiar código Pix
            </button>

            <button
              onClick={() => setPagamento(false)}
              style={{ ...styles.button, marginTop: "1.2rem", width: "100%" }}
            >
              Fechar
            </button>
          </div>
        </div>
      )}

      {/* CSS da animação do check */}
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
            to { opacity: 1; transform: scale(1); }
          }
        `}
      </style>
    </div>
  );
}

/* ================== Estilos ================== */

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "2rem",
    minHeight: "100vh",
    backgroundColor: "#f0f2f5",
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
    margin: "2rem 0",
    alignItems: "center",
    justifyItems: "center",
  },
  input: {
    width: "110px",
    padding: "0.7rem",
    fontSize: "1.4rem",
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
    flexWrap: "wrap",
    justifyContent: "center",
  },
  button: {
    padding: "0.7rem 1.5rem",
    fontSize: "1.1rem",
    borderRadius: "10px",
    border: "none",
    backgroundColor: "#4caf50",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "0.2s",
  },
  bilhetesBox: {
    marginTop: "2rem",
    padding: "1.5rem",
    background: "#fff",
    borderRadius: "16px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
    width: "100%",
    maxWidth: "520px",
  },
  bilheteCard: {
    display: "grid",
    gridTemplateColumns: "1fr auto auto auto",
    alignItems: "center",
    gap: "0.8rem",
    padding: "0.8rem 0",
    borderBottom: "1px solid #eee",
  },
  trashBtn: {
    background: "transparent",
    border: "none",
    fontSize: "1.3rem",
    cursor: "pointer",
  },
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.6)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
    padding: "1rem",
  },
  popup: {
    background: "#fff",
    padding: "2rem",
    borderRadius: "16px",
    textAlign: "center",
    width: "min(420px, 100%)",
    boxShadow: "0 6px 15px rgba(0,0,0,0.25)",
  },
  header: { marginBottom: "0.5rem" },
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
    padding: "0.7rem 1rem",
    background: "black",
    color: "white",
    fontSize: "1rem",
    borderRadius: "8px",
    cursor: "pointer",
    width: "100%",
  },
};
