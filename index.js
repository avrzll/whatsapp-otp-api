const app = require("./app/app");
const { connectToWhatsapp } = require("./app/helper/whatsapp");
const port = 3000;

async function startApp() {
  try {
    // Pastikan WhatsApp terhubung terlebih dahulu
    await connectToWhatsapp();
    console.log("WhatsApp connected!");

    // Setelah itu, baru jalankan server Express
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
      console.log(`API Docs available at http://localhost:${port}/api-docs`);
    });
  } catch (error) {
    console.error("Error connecting to WhatsApp:", error);
  }
}

startApp();
