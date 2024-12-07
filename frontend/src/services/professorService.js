import axios from "axios";

const API_URL = "http://localhost:5000/api/professores";

// Buscar todos os professores com filtros (se necessário)
export const getProfessores = async (params) => {
  const response = await axios.get(API_URL, { params });
  return response.data;
};

// Criar um novo professor
export const createProfessor = async (professorData) => {
  try {
    const response = await axios.post(API_URL, professorData);
    return response.data;
  } catch (error) {
    console.error(
      "Erro ao criar professor:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Atualizar um professor existente
export const updateProfessor = async (id, professorData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, professorData);
    return response.data;
  } catch (error) {
    console.error(
      `Erro ao atualizar o professor com ID ${id}:`,
      error.response?.data || error.message
    );
    throw error;
  }
};

// Excluir um professor
export const deleteProfessor = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(
      `Erro ao excluir o professor com ID ${id}:`,
      error.response?.data || error.message
    );
    throw error;
  }
};

// Alternar o status (ativo/inativo) de um professor
export const toggleStatusProfessor = async (id) => {
  try {
    const response = await axios.patch(`${API_URL}/${id}/toggle-status`);
    return response.data;
  } catch (error) {
    console.error(
      `Erro ao alternar o status do professor com ID ${id}:`,
      error.response?.data || error.message
    );
    throw error;
  }
};
