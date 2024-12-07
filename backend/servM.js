const mongoose = require("mongoose"); // Importa o Mongoose para o MongoDB
const express = require("express"); // Importa o Express para criar o servidor
const bodyParser = require("body-parser"); // Importa Body-parser para lidar com JSON
const cors = require("cors"); // Importa o CORS para permitir requisições cruzadas
const feedbackRoutes = require("./routes/feedbackRoutes"); // Importa as rotas de Feedback

const app = express(); // Inicializa o app Express
const PORT = 5001; // Porta para o servidor do MongoDB

// Middlewares
app.use(bodyParser.json());
app.use(cors());

// Rotas
app.use("/api/feedback", feedbackRoutes);

// Conexão com o MongoDB
mongoose
  .connect("mongodb://localhost:27017/feedbackDB") // Sem as opções obsoletas
  .then(() => {
    console.log("Conexão com o MongoDB bem-sucedida.");
    // Inicializa o servidor após a conexão com o MongoDB
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Erro ao conectar ao MongoDB:", error);
  });
