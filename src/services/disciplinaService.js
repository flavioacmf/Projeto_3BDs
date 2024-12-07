import axios from "axios";

const API_URL = "http://localhost:5000/api/disciplinas";

// Buscar todas as disciplinas com filtros opcionais
export const getDisciplinas = async (params) => {
  try {
    const response = await axios.get(API_URL, { params });
    return response.data;
  } catch (error) {
    console.error(
      "Erro ao buscar disciplinas:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Criar uma nova disciplina
export const createDisciplina = async (disciplinaData) => {
  try {
    const response = await axios.post(API_URL, disciplinaData);
    return response.data;
  } catch (error) {
    console.error(
      "Erro ao criar disciplina:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Atualizar uma disciplina existente
export const updateDisciplina = async (id, disciplinaData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, disciplinaData);
    return response.data;
  } catch (error) {
    console.error(
      `Erro ao atualizar a disciplina com ID ${id}:`,
      error.response?.data || error.message
    );
    throw error;
  }
};

// Alternar o status (ativo/inativo) de uma disciplina
export const toggleStatusDisciplina = async (id) => {
  try {
    const response = await axios.patch(`${API_URL}/${id}/toggle-status`);
    return response.data;
  } catch (error) {
    console.error(
      `Erro ao alternar o status da disciplina com ID ${id}:`,
      error.response?.data || error.message
    );
    throw error;
  }
};

// Excluir uma disciplina
export const deleteDisciplina = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(
      `Erro ao excluir a disciplina com ID ${id}:`,
      error.response?.data || error.message
    );
    throw error;
  }
};
