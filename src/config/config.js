const config = {
  server: {
    port: 3030,
  },
  logger: {
    level: "debug",
  },
  rate_limit: {
    windowMs: 60 * 1000,
    max: 10,
    message: "Too Many Requests! :(",
    standardHeaders: true,
    legacyHeaders: false,
  },
};

export { config };
