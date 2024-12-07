import React, { useState, useEffect, useCallback } from "react";
import {
  getDisciplinas,
  createDisciplina,
  updateDisciplina,
  toggleStatusDisciplina,
} from "../../services/disciplinaService";
import "./Disciplina.css"; // Certifique-se de que o caminho está correto

const Disciplina = () => {
  const [disciplinas, setDisciplinas] = useState([]);
  const [filteredDisciplinas, setFilteredDisciplinas] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [formData, setFormData] = useState({
    nome: "",
    codigo: "",
    periodo: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [currentDisciplinaId, setCurrentDisciplinaId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Função para carregar as disciplinas
  const carregarDisciplinas = useCallback(async () => {
    try {
      const disciplinasData = await getDisciplinas();
      const ativos = disciplinasData.filter((disciplina) => disciplina.ativo); // Filtra apenas as disciplinas ativas
      setDisciplinas(ativos);
      setFilteredDisciplinas(ativos); // Inicializa com os dados ativos
    } catch (error) {
      console.error("Erro ao carregar disciplinas:", error);
    }
  }, []);

  useEffect(() => {
    carregarDisciplinas();
  }, [carregarDisciplinas]);

  // Aplicar filtro aos dados conforme o texto digitado
  useEffect(() => {
    if (filterText === "") {
      setFilteredDisciplinas(disciplinas);
    } else {
      const lowerCaseFilter = filterText.toLowerCase();
      const filtered = disciplinas.filter(
        (disciplina) =>
          disciplina.nome.toLowerCase().includes(lowerCaseFilter) ||
          disciplina.codigo.toLowerCase().includes(lowerCaseFilter) ||
          disciplina.periodo.toLowerCase().includes(lowerCaseFilter)
      );
      setFilteredDisciplinas(filtered);
    }
  }, [filterText, disciplinas]);

  const handleFilterChange = (e) => {
    setFilterText(e.target.value);
  };

  const handleToggleStatus = async (id) => {
    try {
      await toggleStatusDisciplina(id);
      carregarDisciplinas();
    } catch (error) {
      console.error("Erro ao alternar status da disciplina:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async () => {
    try {
      if (isEditing) {
        await updateDisciplina(currentDisciplinaId, formData);
      } else {
        await createDisciplina(formData);
      }
      setFormData({
        nome: "",
        codigo: "",
        periodo: "",
      });
      setIsEditing(false);
      setCurrentDisciplinaId(null);
      setShowModal(false);
      carregarDisciplinas();
    } catch (error) {
      console.error("Erro ao salvar disciplina:", error);
    }
  };

  const handleEdit = (disciplina) => {
    setFormData({
      nome: disciplina.nome,
      codigo: disciplina.codigo,
      periodo: disciplina.periodo,
    });
    setIsEditing(true);
    setCurrentDisciplinaId(disciplina.id);
    setShowModal(true);
  };

  const handleNew = () => {
    setFormData({
      nome: "",
      codigo: "",
      periodo: "",
    });
    setIsEditing(false);
    setCurrentDisciplinaId(null);
    setShowModal(true);
  };

  return (
    <div className="disciplina-container">
      <h2 className="titulo">Gerenciamento de Disciplinas</h2>
      <div className="filtro-botoes">
        <input
          type="text"
          className="campo-filtro"
          placeholder="Pesquisar por qualquer informação"
          value={filterText}
          onChange={handleFilterChange}
        />
        <button className="botao-exibir" onClick={handleNew}>
          Nova Disciplina
        </button>
      </div>
      <table className="tabela">
        <thead>
          <tr>
            <th>#</th>
            <th>Nome</th>
            <th>Código</th>
            <th>Período</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {filteredDisciplinas.map((disciplina, index) => (
            <tr key={disciplina.id}>
              <td>{index + 1}</td>
              <td>{disciplina.nome}</td>
              <td>{disciplina.codigo}</td>
              <td>{disciplina.periodo}</td>
              <td>{disciplina.ativo ? "Ativo" : "Inativo"}</td>
              <td>
                <button
                  className="botao-editar"
                  onClick={() => handleEdit(disciplina)}
                >
                  Editar
                </button>
                <button
                  className="botao-ativar"
                  onClick={() => handleToggleStatus(disciplina.id)}
                >
                  {disciplina.ativo ? "Desativar" : "Ativar"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>{isEditing ? "Editar Disciplina" : "Nova Disciplina"}</h3>
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
              name="codigo"
              placeholder="Código"
              className="campo"
              value={formData.codigo}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="periodo"
              placeholder="Período"
              className="campo"
              value={formData.periodo}
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

export default Disciplina;
