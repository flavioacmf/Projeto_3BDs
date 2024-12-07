const winston = require("winston");

// Configuração do logger
const logger = winston.createLogger({
  level: "info", // Nível de log: info, warn, error, etc.
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level.toUpperCase()}]: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console(), // Exibe os logs no console
    new winston.transports.File({ filename: "C:/logs/app.log" }), // Salva logs em logs/app.log
  ],
});

// Exporta o logger para ser usado em outros arquivos
module.exports = logger;
