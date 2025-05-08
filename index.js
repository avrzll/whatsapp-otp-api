const baileys = await import("baileys-pro");
const { default: makeWASocket } = baileys.default;
import {
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  DisconnectReason,
  makeCacheableSignalKeyStore,
  generateWAMessageFromContent,
  WAProto,
  Browsers,
} from "baileys-pro";
import readline from "readline";
import Pino from "pino";
import NodeCache from "node-cache";
import "./src/server.js";
// import { handlerMessages } from "./src/controllers/messages.js";
import { logger } from "./src/utils/index.js";

const msgRetryCounterCache = new NodeCache();

const P = Pino({ level: "silent" });

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (text) => new Promise((resolve) => rl.question(text, resolve));

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState("src/sessions");
  const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    version,
    logger: P,
    printQRInTerminal: false,
    browser: Browsers.ubuntu("Chrome"),
    markOnlineOnConnect: false,
    msgRetryCounterCache,
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys, P),
    },
  });

  sock.ev.on("creds.update", saveCreds);

  if (!sock.authState.creds.registered) {
    const phoneNumber = await question("Enter Active WA Number: ");
    const code = await sock.requestPairingCode(phoneNumber);
    console.log(`PAIRING CODE: ${code}`);
  }

  sock.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect } = update;

    if (connection === "connecting") {
      logger.info("Connecting to WhatsApp...");
    } else if (connection === "open") {
      global.sock = sock;
      logger.info("Connected to WhatsApp ✓");
    } else if (connection === "close") {
      const reason = lastDisconnect?.error?.output?.statusCode;
      if (reason === DisconnectReason.loggedOut) {
        logger.warn("Logged out. Exiting...");
        process.exit(0);
      }
      logger.info("Reconnecting...");
      startBot().catch(console.error);
    }
  });

  sock.ev.on("messages.upsert", async ({ messages }) => {
    const m = messages[0];
    // handlerMessages(sock, m, generateWAMessageFromContent, WAProto);
  });
}

startBot().catch(console.error);
