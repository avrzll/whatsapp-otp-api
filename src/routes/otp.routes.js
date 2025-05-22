import express from "express";
import crypto from "crypto";
import { logger, sendCopyButtonMessage } from "../utils/index.js";

const otpRoutes = express.Router();

const otpStore = {};

otpRoutes.post("/generate-otp", async (req, res) => {
  if (!req.body) {
    return res
      .status(400)
      .json({ status: false, message: "Request body is required" });
  }

  const { userId, phoneNumber } = req.body;

  if (!userId || !phoneNumber) {
    return res
      .status(400)
      .json({ status: false, message: "userId and phoneNumber are required" });
  }

  if (!global.sock) {
    return res
      .status(500)
      .json({ status: false, message: "WhatsApp connection not established" });
  }

  const otp = crypto.randomInt(100000, 999999).toString();
  const expiresAt = Date.now() + 5 * 60 * 1000;
  otpStore[userId] = { otp, expiresAt };

  try {
    const jid = phoneNumber + "@s.whatsapp.net";

    await sendCopyButtonMessage(global.sock, jid, otp);

    res.status(200).json({
      status: true,
      otp_code: otp,
      message: "OTP generated and sent successfully",
    });
  } catch (error) {
    logger.error("Error sending OTP:", error);
    res.status(500).json({
      status: false,
      message: "Failed to send OTP via WhatsApp",
      error: error.message,
    });
  }
});

otpRoutes.post("/verify-otp", (req, res) => {
  if (!req.body) {
    return res
      .status(400)
      .json({ status: false, message: "Request body is required" });
  }

  const { userId, otp } = req.body;
  if (!userId || !otp) {
    return res
      .status(400)
      .json({ status: false, message: "userId and otp are required" });
  }

  const userOtpData = otpStore[userId];

  if (!userOtpData) {
    return res
      .status(400)
      .json({ status: false, message: "OTP not found or expired" });
  }

  const { otp: storedOtp, expiresAt } = userOtpData;

  if (Date.now() > expiresAt) {
    delete otpStore[userId];
    return res.status(400).json({ status: false, message: "OTP expired" });
  }

  if (storedOtp !== otp) {
    return res.status(400).json({ status: false, message: "Invalid OTP" });
  }

  delete otpStore[userId];
  res.status(200).json({ status: true, message: "OTP verified successfully" });
});

export { otpRoutes };
