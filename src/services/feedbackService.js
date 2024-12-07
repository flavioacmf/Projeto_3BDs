import axios from "axios";

const API_URL = "http://localhost:5001/api/feedback";

// Obter feedbacks
export const getFeedbacks = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar feedbacks:", error);
    throw error;
  }
};

// Enviar feedback
export const createFeedback = async (feedbackData) => {
  try {
    const response = await axios.post(API_URL, feedbackData);
    return response.data;
  } catch (error) {
    console.error("Erro ao enviar feedback:", error);
    throw error;
  }
};
