import express from "express";

const defaultRoutes = express.Router();

defaultRoutes.get("/", (req, res) => {
  res.send({
    status: true,
    data: {
      message: "Welcome to the WhatsApp OTP Generator & Verifier API",
      version: "2.0.0",
      author: "avrzll_",
      documentation: "https://github.com/avrzll/whatsapp-otp-api",
    },
  });
});

export { defaultRoutes };
