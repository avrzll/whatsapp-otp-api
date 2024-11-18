const express = require("express");
const bodyParser = require("body-parser");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
const otpRoutes = require("./routes/otpRoutes");

const app = express();

// Middleware untuk mem-parsing JSON
app.use(bodyParser.json());

// Konfigurasi Swagger
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Whatsapp OTP API Documentation",
      version: "1.0.0",
      description: "API ini 100% gratis, maka gunakanlah dengan bijak!",
    },
    servers: [
      {
        url: "https://waotp.avrizal.my.id",
        description: "Production server",
      },
    ],
  },
  apis: ["./app/routes/otpRoutes.js"], // Lokasi dokumentasi
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Gunakan route OTP
app.use("/api", otpRoutes);

module.exports = app;
