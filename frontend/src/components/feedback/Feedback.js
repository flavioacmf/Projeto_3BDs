import React, { useState, useEffect } from "react";
import { getFeedbacks, createFeedback } from "../../services/feedbackService";
import "./Feedback.css";

const Feedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    mensagem: "",
    anexos: [], // Array para armazenar os anexos
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Carregar feedbacks existentes
  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const data = await getFeedbacks();
        setFeedbacks(data);
      } catch (err) {
        setError("Erro ao carregar feedbacks.");
      }
    };

    fetchFeedbacks();
  }, []);

  // Lidar com as mudanças no formulário
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Lidar com a adição de múltiplos anexos
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files); // Converte FileList em array
    setFormData((prev) => ({ ...prev, anexos: files }));
  };

  // Enviar feedback
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Prepara os dados para envio
      const data = new FormData();
      data.append("nome", formData.nome);
      data.append("email", formData.email);
      data.append("mensagem", formData.mensagem);
      formData.anexos.forEach((file) => {
        data.append("anexos", file); // Adiciona cada arquivo ao FormData
      });

      const response = await createFeedback(data);
      setFeedbacks((prev) => [response.feedback, ...prev]); // Atualiza a lista
      setFormData({ nome: "", email: "", mensagem: "", anexos: [] }); // Limpa o formulário
    } catch (err) {
      setError("Erro ao enviar feedback.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="feedback-container">
      <h1>Feedback</h1>

      <form onSubmit={handleSubmit} className="feedback-form">
        <input
          type="text"
          name="nome"
          placeholder="Seu nome"
          value={formData.nome}
          onChange={handleInputChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Seu email"
          value={formData.email}
          onChange={handleInputChange}
          required
        />
        <textarea
          name="mensagem"
          placeholder="Sua mensagem"
          value={formData.mensagem}
          onChange={handleInputChange}
          required
        />
        <input
          type="file"
          name="anexos"
          onChange={handleFileChange}
          multiple // Permite selecionar múltiplos anexos
          accept="image/*,application/pdf"
        />
        <button type="submit" disabled={loading}>
          {loading ? "Enviando..." : "Enviar"}
        </button>
      </form>

      {error && <p className="error">{error}</p>}

      <h2>Feedbacks Recebidos</h2>
      {feedbacks.length === 0 ? (
        <p>Nenhum feedback ainda.</p>
      ) : (
        <ul className="feedback-list">
          {feedbacks.map((feedback) => (
            <li key={feedback._id}>
              <h3>{feedback.nome}</h3>
              <p>{feedback.mensagem}</p>
              <small>{feedback.email}</small>
              {feedback.anexos &&
                feedback.anexos.map((arquivo, index) => (
                  <a
                    key={index}
                    href={arquivo}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Arquivo {index + 1}
                  </a>
                ))}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Feedback;
