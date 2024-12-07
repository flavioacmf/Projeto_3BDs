import axios from "axios";

const API_URL = "http://localhost:5000/api/alunos";

export const getAlunos = async (params) => {
  const response = await axios.get(API_URL, { params });
  return response.data;
};

export const createAluno = async (alunoData) => {
  try {
    const response = await axios.post(API_URL, alunoData);
    return response.data;
  } catch (error) {
    console.error("Erro ao criar aluno:", error.response?.data || error.message);
    throw error;
  }};

export const updateAluno = async (id, data) => {
  const response = await axios.put(`${API_URL}/${id}`, data);
  return response.data;
};

export const deleteAluno = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};

export const toggleStatusAluno = async (id) => {
  const response = await axios.patch(`${API_URL}/${id}/toggle-status`);
  return response.data;
};
