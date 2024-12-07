import React, { useState, useEffect, useCallback } from "react";
import {
  getAlunos,
  createAluno,
  updateAluno,
  toggleStatusAluno,
} from "../../services/alunoService";
import "./Aluno.css"; // Certifique-se de que o caminho está correto

const Aluno = () => {
  const [alunos, setAlunos] = useState([]);
  const [filteredAlunos, setFilteredAlunos] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [formData, setFormData] = useState({
    nome: "",
    cpf: "",
    email: "",
    data_nascimento: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [currentAlunoId, setCurrentAlunoId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Função para carregar alunos ativos
  const carregarAlunos = useCallback(async () => {
    try {
      const alunosData = await getAlunos();
      const ativos = alunosData.filter((aluno) => aluno.ativo); // Filtra apenas os ativos
      setAlunos(ativos);
      setFilteredAlunos(ativos);
    } catch (error) {
      console.error("Erro ao carregar alunos:", error);
    }
  }, []);

  useEffect(() => {
    carregarAlunos();
  }, [carregarAlunos]);

  // Filtro aplicado aos dados conforme o texto digitado
  useEffect(() => {
    if (filterText === "") {
      setFilteredAlunos(alunos);
    } else {
      const lowerCaseFilter = filterText.toLowerCase();
      const filtered = alunos.filter(
        (aluno) =>
          aluno.nome.toLowerCase().includes(lowerCaseFilter) ||
          aluno.cpf.includes(lowerCaseFilter) ||
          aluno.email.toLowerCase().includes(lowerCaseFilter)
      );
      setFilteredAlunos(filtered);
    }
  }, [filterText, alunos]);

  const handleFilterChange = (e) => {
    setFilterText(e.target.value);
  };

  const handleToggleStatus = async (id) => {
    try {
      await toggleStatusAluno(id);
      carregarAlunos();
    } catch (error) {
      console.error("Erro ao alternar status do aluno:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async () => {
    // Validação do formulário
    if (!formData.nome || !formData.cpf || !formData.email || !formData.data_nascimento) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    try {
      if (isEditing) {
        // Atualizar aluno
        await updateAluno(currentAlunoId, formData);
        alert("Aluno atualizado com sucesso!");
      } else {
        // Cadastrar novo aluno
        await createAluno(formData);
        alert("Aluno cadastrado com sucesso!");
      }

      // Resetar formulário
      setFormData({
        nome: "",
        cpf: "",
        email: "",
        data_nascimento: "",
      });
      setIsEditing(false);
      setCurrentAlunoId(null);
      setShowModal(false);
      carregarAlunos();
    } catch (error) {
      console.error("Erro ao salvar aluno:", error);
      alert("Não foi possível salvar o aluno. Verifique os dados e tente novamente.");
    }
  };

  const handleEdit = (aluno) => {
    setFormData({
      nome: aluno.nome,
      cpf: aluno.cpf,
      email: aluno.email,
      data_nascimento: aluno.data_nascimento,
    });
    setIsEditing(true);
    setCurrentAlunoId(aluno.id);
    setShowModal(true);
  };

  const handleNew = () => {
    setFormData({
      nome: "",
      cpf: "",
      email: "",
      data_nascimento: "",
    });
    setIsEditing(false);
    setCurrentAlunoId(null);
    setShowModal(true);
  };

  return (
    <div className="aluno-container">
      <h2 className="titulo">Gerenciamento de Alunos</h2>
      <div className="filtro-botoes">
        <input
          type="text"
          className="campo-filtro"
          placeholder="Pesquisar por qualquer informação"
          value={filterText}
          onChange={handleFilterChange}
        />
        <button className="botao-exibir" onClick={handleNew}>
          Novo Cadastro
        </button>
      </div>
      <table className="tabela">
        <thead>
          <tr>
            <th>#</th>
            <th>Nome</th>
            <th>CPF</th>
            <th>Email</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {filteredAlunos.map((aluno, index) => (
            <tr key={aluno.id}>
              <td>{index + 1}</td>
              <td>{aluno.nome}</td>
              <td>{aluno.cpf}</td>
              <td>{aluno.email}</td>
              <td>{aluno.ativo ? "Ativo" : "Inativo"}</td>
              <td>
                <button
                  className="botao-editar"
                  onClick={() => handleEdit(aluno)}
                >
                  Editar
                </button>
                <button
                  className="botao-ativar"
                  onClick={() => handleToggleStatus(aluno.id)}
                >
                  {aluno.ativo ? "Desativar" : "Ativar"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>{isEditing ? "Editar Aluno" : "Novo Aluno"}</h3>
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
              type="date"
              name="data_nascimento"
              className="campo"
              value={formData.data_nascimento}
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

export default Aluno;
