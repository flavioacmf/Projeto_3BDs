// services/turmaService.js
import axios from "axios";

const API_URL = "http://localhost:5000/api/turmas";

export const getTurmas = async (params) => {
  const response = await axios.get(API_URL, { params });
  return response.data;
};

export const getTurmaById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

export const createTurma = async (turmaData) => {
  const response = await axios.post(API_URL, turmaData);
  return response.data;
};

export const updateTurma = async (id, turmaData) => {
  const response = await axios.put(`${API_URL}/${id}`, turmaData);
  return response.data;
};

export const deleteTurma = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};

export const toggleStatusTurma = async (id) => {
  const response = await axios.patch(`${API_URL}/${id}/toggle-status`);
  return response.data;
};
