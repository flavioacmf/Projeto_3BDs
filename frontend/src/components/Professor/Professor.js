import React, { useState, useEffect, useCallback } from "react";
import {
  getProfessores,
  createProfessor,
  updateProfessor,
  toggleStatusProfessor,
} from "../../services/professorService";
import "./Professor.css"; // Certifique-se de que o caminho está correto para o CSS

const Professor = () => {
  const [professores, setProfessores] = useState([]);
  const [filteredProfessores, setFilteredProfessores] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [formData, setFormData] = useState({
    nome: "",
    cpf: "",
    email: "",
    titulacao: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [currentProfessorId, setCurrentProfessorId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Carregar apenas professores ativos
  const carregarProfessores = useCallback(async () => {
    try {
      const professoresData = await getProfessores();
      const ativos = professoresData.filter((professor) => professor.ativo); // Filtrar apenas ativos
      setProfessores(ativos);
      setFilteredProfessores(ativos);
    } catch (error) {
      console.error("Erro ao carregar professores:", error);
    }
  }, []);

  useEffect(() => {
    carregarProfessores();
  }, [carregarProfessores]);

  // Filtro aplicado aos dados conforme o texto digitado
  useEffect(() => {
    if (filterText === "") {
      setFilteredProfessores(professores);
    } else {
      const lowerCaseFilter = filterText.toLowerCase();
      const filtered = professores.filter(
        (professor) =>
          professor.nome.toLowerCase().includes(lowerCaseFilter) ||
          professor.cpf.includes(lowerCaseFilter) ||
          professor.email.toLowerCase().includes(lowerCaseFilter) ||
          professor.titulacao.toLowerCase().includes(lowerCaseFilter)
      );
      setFilteredProfessores(filtered);
    }
  }, [filterText, professores]);

  const handleFilterChange = (e) => {
    setFilterText(e.target.value);
  };

  const handleToggleStatus = async (id) => {
    try {
      await toggleStatusProfessor(id);
      carregarProfessores();
    } catch (error) {
      console.error("Erro ao alternar status do professor:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async () => {
    try {
      if (isEditing) {
        await updateProfessor(currentProfessorId, formData);
      } else {
        await createProfessor(formData);
      }
      setFormData({
        nome: "",
        cpf: "",
        email: "",
        titulacao: "",
      });
      setIsEditing(false);
      setCurrentProfessorId(null);
      setShowModal(false);
      carregarProfessores();
    } catch (error) {
      console.error("Erro ao salvar professor:", error);
    }
  };

  const handleEdit = (professor) => {
    setFormData({
      nome: professor.nome,
      cpf: professor.cpf,
      email: professor.email,
      titulacao: professor.titulacao,
    });
    setIsEditing(true);
    setCurrentProfessorId(professor.id);
    setShowModal(true);
  };

  const handleNew = () => {
    setFormData({
      nome: "",
      cpf: "",
      email: "",
      titulacao: "",
    });
    setIsEditing(false);
    setCurrentProfessorId(null);
    setShowModal(true);
  };

  return (
    <div className="professor-container">
      <h2 className="titulo">Gerenciamento de Professores</h2>
      <div className="filtro-botoes">
        <input
          type="text"
          className="campo-filtro"
          placeholder="Pesquisar por qualquer informação"
          value={filterText}
          onChange={handleFilterChange}
        />
        <button className="botao-exibir" onClick={handleNew}>
          Novo Professor
        </button>
      </div>
      <table className="tabela">
        <thead>
          <tr>
            <th>#</th>
            <th>Nome</th>
            <th>CPF</th>
            <th>Email</th>
            <th>Titulação</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {filteredProfessores.map((professor, index) => (
            <tr key={professor.id}>
              <td>{index + 1}</td>
              <td>{professor.nome}</td>
              <td>{professor.cpf}</td>
              <td>{professor.email}</td>
              <td>{professor.titulacao}</td>
              <td>{professor.ativo ? "Ativo" : "Inativo"}</td>
              <td>
                <button
                  className="botao-editar"
                  onClick={() => handleEdit(professor)}
                >
                  Editar
                </button>
                <button
                  className="botao-ativar"
                  onClick={() => handleToggleStatus(professor.id)}
                >
                  {professor.ativo ? "Desativar" : "Ativar"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>{isEditing ? "Editar Professor" : "Novo Professor"}</h3>
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
              name="cpf"
              placeholder="CPF"
              className="campo"
              value={formData.cpf}
              onChange={handleInputChange}
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="campo"
              value={formData.email}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="titulacao"
              placeholder="Titulação"
              className="campo"
              value={formData.titulacao}
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

export default Professor;
