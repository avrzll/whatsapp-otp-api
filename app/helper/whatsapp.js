const { useMultiFileAuthState, Browsers } = require("@whiskeysockets/baileys");
const makeWASocket = require("@whiskeysockets/baileys").default;
const pino = require("pino");

let socket; // Deklarasikan socket secara global
let isConnected = false; // Tambahkan flag untuk memantau status koneksi

async function connectToWhatsapp() {
  const auth = await useMultiFileAuthState("auth");
  socket = makeWASocket({
    printQRInTerminal: true,
    browser: Browsers.macOS("Nishimura"),
    auth: auth.state,
    logger: pino({ level: "silent" }),
  });

  socket.ev.on("creds.update", auth.saveCreds);

  socket.ev.on("connection.update", ({ connection }) => {
    if (connection === "open") {
      console.log("WhatsApp connected!");
      isConnected = true; // Set flag menjadi true ketika koneksi berhasil
    }
    if (connection === "close") {
      console.log("WhatsApp disconnected!");
      isConnected = false; // Reset flag ketika koneksi terputus
      connectToWhatsapp(); // Reconnect otomatis
    }
  });

  socket.ev.on("messages.upsert", ({ messages }) => {
    const m = messages[0];
    console.log(m);
  });
}

async function sendMessage(phoneNumber, message) {
  if (!isConnected || !socket) {
    throw new Error("WhatsApp is not connected yet.");
  }

  const jid = `${phoneNumber}@s.whatsapp.net`; // Format nomor WA
  await socket.sendMessage(jid, { text: message });
  console.log(`Message sent to ${phoneNumber}: ${message}`);
}

module.exports = { connectToWhatsapp, sendMessage };
