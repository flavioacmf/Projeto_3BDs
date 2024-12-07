import React, { useState, useEffect, useCallback } from "react";
import {
  getSalas,
  createSala,
  updateSala,
  toggleStatusSala,
} from "../../services/salaService";
import "./Sala.css"; // Certifique-se de que o caminho está correto para o CSS

const Sala = () => {
  const [salas, setSalas] = useState([]);
  const [filteredSalas, setFilteredSalas] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [formData, setFormData] = useState({
    nome: "",
    local: "",
    capacidade: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [currentSalaId, setCurrentSalaId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Carregar apenas salas ativas
  const carregarSalas = useCallback(async () => {
    try {
      const salasData = await getSalas();
      const ativos = salasData.filter((sala) => sala.ativo); // Filtrar apenas ativos
      setSalas(ativos);
      setFilteredSalas(ativos);
    } catch (error) {
      console.error("Erro ao carregar salas:", error);
    }
  }, []);

  useEffect(() => {
    carregarSalas();
  }, [carregarSalas]);

  // Filtro aplicado aos dados conforme o texto digitado
  useEffect(() => {
    if (filterText === "") {
      setFilteredSalas(salas);
    } else {
      const lowerCaseFilter = filterText.toLowerCase();
      const filtered = salas.filter(
        (sala) =>
          sala.nome.toLowerCase().includes(lowerCaseFilter) ||
          sala.local.toLowerCase().includes(lowerCaseFilter) ||
          sala.capacidade.toString().includes(lowerCaseFilter)
      );
      setFilteredSalas(filtered);
    }
  }, [filterText, salas]);

  const handleFilterChange = (e) => {
    setFilterText(e.target.value);
  };

  const handleToggleStatus = async (id) => {
    try {
      await toggleStatusSala(id);
      carregarSalas();
    } catch (error) {
      console.error("Erro ao alternar status da sala:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async () => {
    if (!formData.nome || !formData.local || !formData.capacidade) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }
    try {
      if (isEditing) {
        await updateSala(currentSalaId, formData);
      } else {
        await createSala(formData);
      }
      setFormData({
        nome: "",
        local: "",
        capacidade: "",
      });
      setIsEditing(false);
      setCurrentSalaId(null);
      setShowModal(false);
      carregarSalas();
    } catch (error) {
      console.error("Erro ao salvar sala:", error);
      alert("Não foi possível salvar a sala. Tente novamente.");
    }
  };

  const handleEdit = (sala) => {
    setFormData({
      nome: sala.nome,
      local: sala.local,
      capacidade: sala.capacidade,
    });
    setIsEditing(true);
    setCurrentSalaId(sala.id);
    setShowModal(true);
  };

  const handleNew = () => {
    setFormData({
      nome: "",
      local: "",
      capacidade: "",
    });
    setIsEditing(false);
    setCurrentSalaId(null);
    setShowModal(true);
  };

  return (
    <div className="sala-container">
      <h2 className="titulo">Gerenciamento de Salas</h2>
      <div className="filtro-botoes">
        <input
          type="text"
          className="campo-filtro"
          placeholder="Pesquisar por qualquer informação"
          value={filterText}
          onChange={handleFilterChange}
        />
        <button className="botao-exibir" onClick={handleNew}>
          Nova Sala
        </button>
      </div>
      <table className="tabela">
        <thead>
          <tr>
            <th>#</th>
            <th>Nome</th>
            <th>Local</th>
            <th>Capacidade</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {filteredSalas.map((sala, index) => (
            <tr key={sala.id}>
              <td>{index + 1}</td>
              <td>{sala.nome}</td>
              <td>{sala.local}</td>
              <td>{sala.capacidade}</td>
              <td>
                <button
                  className="botao-editar"
                  onClick={() => handleEdit(sala)}
                >
                  Editar
                </button>
                <button
                  className="botao-ativar"
                  onClick={() => handleToggleStatus(sala.id)}
                >
                  "Desativar"
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>{isEditing ? "Editar Sala" : "Nova Sala"}</h3>
            <input
              type="text"
              name="nome"
              placeholder="Nome"
              className="campo"
              value={formData.nome}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="local"
              placeholder="Local"
              className="campo"
              value={formData.local}
              onChange={handleInputChange}
            />
            <input
              type="number"
              name="capacidade"
              placeholder="Capacidade"
              className="campo"
              value={formData.capacidade}
              onChange={handleInputChange}
            />
            <button className="botao-salvar" onClick={handleSave}>
              {isEditing ? "Salvar Alterações" : "Cadastrar"}
            </button>
            <button
              className="botao-exibir"
              onClick={() => setShowModal(false)}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sala;
