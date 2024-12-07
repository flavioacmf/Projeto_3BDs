const AWS = require("aws-sdk");

// Configuração das credenciais da AWS
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID, // Defina as variáveis de ambiente
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION, // Região do bucket, e.g., 'us-east-1'
});

const s3 = new AWS.S3();

module.exports = s3;
