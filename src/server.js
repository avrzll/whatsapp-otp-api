import express from "express";
import bodyParser from "body-parser";
import rateLimit from "express-rate-limit";
import { config } from "./config/config.js";
import { defaultRoutes, otpRoutes } from "./routes/index.js";

const port = config.server.port;
const app = express();
const limiter = rateLimit(config.rate_limit);
app.use(bodyParser.json({ limit: "30mb" }));
app.use(limiter);

app.use("/", defaultRoutes);
app.use("/otp", otpRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
