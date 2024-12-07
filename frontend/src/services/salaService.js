import axios from "axios";

const API_URL = "http://localhost:5000/api/salas";

// Buscar todas as salas com filtros opcionais
export const getSalas = async (params) => {
  try {
    const response = await axios.get(API_URL, { params });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar salas:", error.response?.data || error.message);
    throw new Error("Não foi possível buscar as salas.");
  }
};

// Criar uma nova sala
export const createSala = async (salaData) => {
  try {
    const response = await axios.post(API_URL, salaData);
    return response.data;
  } catch (error) {
    console.error("Erro ao criar sala:", error.response?.data || error.message);
    throw new Error("Não foi possível criar a sala. Verifique os dados e tente novamente.");
  }
};

// Atualizar uma sala existente
export const updateSala = async (id, salaData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, salaData);
    return response.data;
  } catch (error) {
    console.error(
      `Erro ao atualizar a sala com ID ${id}:`,
      error.response?.data || error.message
    );
    throw new Error("Não foi possível atualizar a sala. Verifique os dados e tente novamente.");
  }
};

// Alternar o status (ativo/inativo) de uma sala
export const toggleStatusSala = async (id) => {
  try {
    const response = await axios.patch(`${API_URL}/${id}/toggle-status`);
    return response.data;
  } catch (error) {
    console.error(
      `Erro ao alternar o status da sala com ID ${id}:`,
      error.response?.data || error.message
    );
    throw new Error("Não foi possível alterar o status da sala.");
  }
};

// Excluir uma sala
export const deleteSala = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(
      `Erro ao excluir a sala com ID ${id}:`,
      error.response?.data || error.message
    );
    throw new Error("Não foi possível excluir a sala.");
  }
};
