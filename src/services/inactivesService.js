import api from "./api"; // Importação da exportação padrão

const API_BASE_URL = "/common"; // Base URL para rotas comuns

/**
 * Buscar itens inativos de uma categoria específica
 * @param {string} category - Nome da categoria (e.g., 'alunos', 'salas')
 * @returns {Promise<Array>} - Lista de itens inativos
 */
export const fetchInactives = async (category) => {
  try {
    const response = await api.get(`${API_BASE_URL}/${category}/inativos`);
    return response.data;
  } catch (error) {
    console.error(
      `Erro ao buscar itens inativos para a categoria "${category}":`,
      error.response?.data || error.message
    );
    throw error;
  }
};

/**
 * Reativar um item inativo
 * @param {string} category - Nome da categoria (e.g., 'alunos', 'salas')
 * @param {number|string} id - ID do item a ser reativado
 * @returns {Promise<Object>} - Dados do item atualizado
 */
export const reactivateItem = async (category, id) => {
  try {
    console.log(`Reativando item com ID ${id} na categoria: ${category}`);
    const response = await api.patch(
      `${API_BASE_URL}/${category}/${id}/toggle-status`
    );
    console.log("Item reativado com sucesso:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      `Erro ao reativar o item com ID "${id}" na categoria "${category}":`,
      error.response?.data || error.message
    );
    throw error;
  }
};
