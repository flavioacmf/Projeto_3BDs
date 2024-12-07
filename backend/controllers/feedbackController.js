const Feedback = require("../models/Feedback");
const AWS = require("aws-sdk");
const multer = require("multer");
const logger = require("../utils/logger"); // Importa o logger configurado

// Configuração do AWS S3
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

// Upload de arquivos com multer
const upload = multer({
  storage: multer.memoryStorage(), // Armazena em memória antes de enviar ao S3
  limits: { fileSize: 10 * 1024 * 1024 }, // Limite de 10MB por arquivo
});

// Função auxiliar para validar se o bucket está configurado
const validateBucket = () => {
  if (!process.env.AWS_BUCKET_NAME) {
    throw new Error("Bucket não configurado. Verifique a variável de ambiente AWS_BUCKET_NAME.");
  }
};

// Criação de feedback
const createFeedback = async (req, res) => {
  try {
    const { nome, email, mensagem } = req.body;
    const arquivos = [];

    // Validação do bucket
    validateBucket();

    logger.info("Iniciando criação de feedback.");

    // Enviar arquivos ao S3 se existirem
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const params = {
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: `feedbacks/${Date.now()}_${file.originalname}`, // Nome único para o arquivo
          Body: file.buffer,
          ContentType: file.mimetype,
        };

        logger.info(`Parâmetros do upload no S3: ${JSON.stringify(params)}`);

        // Faz o upload para o S3
        const uploadResult = await s3.upload(params).promise();
        arquivos.push({ nome: file.originalname, url: uploadResult.Location });
        logger.info(`Arquivo salvo no S3: ${file.originalname}, URL: ${uploadResult.Location}`);
      }
    }

    // Salva o feedback no MongoDB
    const feedback = new Feedback({ nome, email, mensagem, anexos: arquivos });
    const savedFeedback = await feedback.save();

    logger.info(`Feedback salvo no MongoDB: ${savedFeedback._id}`);

    res.status(201).json({
      message: "Feedback enviado com sucesso!",
      feedback: savedFeedback,
    });
  } catch (error) {
    logger.error(`Erro ao salvar feedback: ${error.message}`);
    res.status(500).json({ error: "Erro ao salvar feedback: " + error.message });
  }
};

// Listar todos os feedbacks
const getAllFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    logger.info(`Feedbacks encontrados no MongoDB: ${feedbacks.length}`);
    res.status(200).json(feedbacks);
  } catch (error) {
    logger.error(`Erro ao buscar feedbacks: ${error.message}`);
    res.status(500).json({ error: "Erro ao buscar feedbacks: " + error.message });
  }
};

// Buscar feedback por ID
const getFeedbackById = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) {
      logger.warn(`Feedback com ID ${req.params.id} não encontrado.`);
      return res.status(404).json({ error: "Feedback não encontrado." });
    }
    logger.info(`Feedback encontrado: ${feedback._id}`);
    res.status(200).json(feedback);
  } catch (error) {
    logger.error(`Erro ao buscar feedback por ID: ${error.message}`);
    res.status(500).json({ error: "Erro ao buscar feedback: " + error.message });
  }
};

// Atualizar status de um feedback
const updateFeedbackStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const feedback = await Feedback.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true } // Retorna o documento atualizado
    );
    if (!feedback) {
      logger.warn(`Feedback com ID ${req.params.id} não encontrado.`);
      return res.status(404).json({ error: "Feedback não encontrado." });
    }
    logger.info(`Status do feedback atualizado para ${status}: ${feedback._id}`);
    res.status(200).json({
      message: "Status do feedback atualizado com sucesso!",
      feedback,
    });
  } catch (error) {
    logger.error(`Erro ao atualizar status do feedback: ${error.message}`);
    res.status(500).json({ error: "Erro ao atualizar status: " + error.message });
  }
};

// Deletar feedback
const deleteFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findByIdAndDelete(req.params.id);
    if (!feedback) {
      logger.warn(`Feedback com ID ${req.params.id} não encontrado.`);
      return res.status(404).json({ error: "Feedback não encontrado." });
    }
    logger.info(`Feedback deletado com sucesso: ${feedback._id}`);
    res.status(200).json({ message: "Feedback deletado com sucesso!" });
  } catch (error) {
    logger.error(`Erro ao deletar feedback: ${error.message}`);
    res.status(500).json({ error: "Erro ao deletar feedback: " + error.message });
  }
};

module.exports = {
  createFeedback,
  getAllFeedbacks,
  getFeedbackById,
  updateFeedbackStatus,
  deleteFeedback,
  upload, // Exporta o middleware de upload
};
