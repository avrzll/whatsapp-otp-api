const express = require("express");
const crypto = require("crypto");
const { sendMessage } = require("../helper/whatsapp");

const router = express.Router();

// Database sementara untuk menyimpan OTP
const otpStore = {};

// Endpoint untuk generate OTP
/**
 * @swagger
 * /api/generate-otp:
 *   get:
 *     summary: Endpoint untuk generate OTP
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: ID unik pengguna
 *                 example: user123
 *               phoneNumber:
 *                 type: string
 *                 description: Nomor Whatsapp Tujuan OTP
 *                 example: 628511552626
 *     responses:
 *       200:
 *         description: OTP berhasil dibuat dan dikirim whatsapp
 *       400:
 *         description: Diperlukan userId dan phoneNumber pada body JSON
 *       500:
 *         description: Gagal mengirimkan OTP
 */

router.get("/generate-otp", async (req, res) => {
  const { userId, phoneNumber } = req.body;

  if (!userId || !phoneNumber) {
    return res
      .status(400)
      .json({ status: false, message: "userId and phoneNumber are required" });
  }

  // Generate OTP
  const otp = crypto.randomInt(100000, 999999).toString();
  const expiresAt = Date.now() + 5 * 60 * 1000;
  otpStore[userId] = { otp, expiresAt };

  try {
    // Kirim OTP melalui WhatsApp
    await sendMessage(
      phoneNumber,
      `
Your OTP is: ${otp}. It will expire in 5 minutes.
Please do not share this OTP with anyone. If you did not request this, please ignore this message.
      
> Powered by @avrzll_
`
    );

    res
      .status(200)
      .json({ status: true, message: "OTP generated and sent via WhatsApp" });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Failed to send OTP via WhatsApp",
      error: error.message,
    });
  }
});

// Endpoint untuk verifikasi OTP
/**
 * @swagger
 * /api/verify-otp:
 *   post:
 *     summary: Endpoint untuk verifikasi OTP untuk user tertentu.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: ID unik user
 *                 example: user123
 *               otp:
 *                 type: string
 *                 description: OTP yang akan diverifikasi
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: OTP verified successfully
 *       400:
 *         description: userId and otp are required
 *       404:
 *         description: OTP not found or expired
 *       410:
 *         description: OTP expired
 *       422:
 *         description: Invalid OTP
 */
router.post("/verify-otp", (req, res) => {
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

module.exports = router;
