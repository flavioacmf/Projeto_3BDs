const mongoose = require("mongoose");

// Define o esquema para o modelo Feedback
const FeedbackSchema = new mongoose.Schema(
  {
    nome: {
      type: String,
      required: [true, "O nome é obrigatório."],
      trim: true, // Remove espaços extras no início e fim
      maxlength: [100, "O nome deve ter no máximo 100 caracteres."],
    },
    email: {
      type: String,
      required: [true, "O email é obrigatório."],
      trim: true,
      lowercase: true, // Converte o email para minúsculas
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Por favor, insira um email válido.",
      ], // Validação de formato de email
    },
    mensagem: {
      type: String,
      required: [true, "A mensagem é obrigatória."],
      trim: true,
      maxlength: [500, "A mensagem deve ter no máximo 500 caracteres."], // Limite de caracteres para mensagens longas
    },
    anexos: [
      {
        nome: {
          type: String,
          required: [true, "O nome do arquivo é obrigatório."],
          trim: true,
        },
        url: {
          type: String,
          required: [true, "A URL do arquivo é obrigatória."],
          validate: {
            validator: function (v) {
              return /^https?:\/\/.+/.test(v); // Valida URLs que começam com http ou https
            },
            message: "Por favor, insira uma URL válida.",
          },
        },
        tipo: {
          type: String,
          trim: true,
          default: "application/octet-stream", // Define um tipo padrão
        },
      },
    ],
    status: {
      type: String,
      enum: ["pendente", "em análise", "resolvido"], // Status possíveis
      default: "pendente",
    },
    prioridade: {
      type: String,
      enum: ["alta", "média", "baixa"], // Prioridade do feedback
      default: "média",
    },
    data: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // Adiciona campos createdAt e updatedAt automaticamente
  }
);

module.exports = mongoose.model("Feedback", FeedbackSchema);
