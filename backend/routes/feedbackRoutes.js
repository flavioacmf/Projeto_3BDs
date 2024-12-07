const express = require("express");
const { 
  createFeedback, 
  getAllFeedbacks, 
  getFeedbackById, 
  deleteFeedback, 
  updateFeedbackStatus 
} = require("../controllers/feedbackController"); // Importa os métodos do controlador
const multer = require("multer");

const router = express.Router();

// Configuração do Multer para upload de arquivos
const storage = multer.memoryStorage(); // Armazena os arquivos na memória
const upload = multer({ 
  storage, 
  limits: { fileSize: 10 * 1024 * 1024 } // Limite de 10 MB por arquivo
}).array("anexos", 5); // Permite até 5 arquivos por feedback

// Rota para criar um feedback com suporte a anexos
router.post("/", upload, createFeedback);

// Rota para listar todos os feedbacks
router.get("/", getAllFeedbacks);

// Rota para buscar um feedback por ID
router.get("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: "ID inválido." });
    }
    next(); // Continua para o controlador se o ID for válido
  } catch (error) {
    res.status(500).json({ error: "Erro ao validar ID." });
  }
}, getFeedbackById);

// Rota para atualizar o status de um feedback por ID
router.patch("/:id/status", async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: "ID inválido." });
    }
    next(); // Continua para o controlador se o ID for válido
  } catch (error) {
    res.status(500).json({ error: "Erro ao validar ID." });
  }
}, updateFeedbackStatus);

// Rota para deletar um feedback por ID
router.delete("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: "ID inválido." });
    }
    next(); // Continua para o controlador se o ID for válido
  } catch (error) {
    res.status(500).json({ error: "Erro ao validar ID." });
  }
}, deleteFeedback);

module.exports = router;
