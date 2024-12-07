import React, { useState, useEffect, useCallback } from "react";
import {
  getTurmas,
  createTurma,
  toggleStatusTurma,
} from "../../services/turmaService";
import { getAlunos } from "../../services/alunoService"; // Função para obter alunos ativos
import { getSalas } from "../../services/salaService"; // Função para obter salas
import { getProfessores } from "../../services/professorService"; // Função para obter professores
import { getDisciplinas } from "../../services/disciplinaService"; // Função para obter disciplinas
import "./Turma.css";

const Turma = () => {
  const [turmas, setTurmas] = useState([]);
  const [alunos, setAlunos] = useState([]); // Estado para armazenar alunos
  const [salas, setSalas] = useState([]); // Estado para armazenar salas
  const [professores, setProfessores] = useState([]); // Estado para armazenar professores
  const [disciplinas, setDisciplinas] = useState([]); // Estado para armazenar disciplinas
  const [filterName, setFilterName] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    nome: "",
    dia_semana: "",
    horario_inicio: "",
    horario_termino: "",
    sala: null,
    professor: null,
    disciplina: null,
    alunos: [],
  });
  

  const handleEdit = (turma) => {
    setFormData({
      nome: turma.nome,
      dia_semana: turma.dia_semana,
      horario_inicio: turma.horario_inicio,
      horario_termino: turma.horario_termino,
      sala: turma.sala || null,
      professor: turma.professor || null,
      disciplina: turma.disciplina || null,
      alunos: turma.alunos || [],
    });
    setCurrentStep(1); // Volta ao passo inicial do modal
    setShowModal(true); // Abre o modal
  };
  

  const carregarTurmas = useCallback(async () => {
    try {
      const turmasData = await getTurmas({});
      setTurmas(turmasData);
    } catch (error) {
      console.error("Erro ao carregar turmas:", error);
    }
  }, []);

  const carregarAlunos = useCallback(async () => {
    try {
      const alunosData = await getAlunos({ ativo: true }); // Obter apenas alunos ativos
      setAlunos(alunosData);
    } catch (error) {
      console.error("Erro ao carregar alunos:", error);
    }
  }, []);

  const carregarSalas = useCallback(async () => {
    try {
      const salasData = await getSalas({ ativo: true });
      setSalas(salasData);
    } catch (error) {
      console.error("Erro ao carregar salas:", error);
    }
  }, []);

  const carregarProfessores = useCallback(async () => {
    try {
      const professoresData = await getProfessores({ ativo: true });
      setProfessores(professoresData);
    } catch (error) {
      console.error("Erro ao carregar professores:", error);
    }
  }, []);

  const carregarDisciplinas = useCallback(async () => {
    try {
      const disciplinasData = await getDisciplinas({ ativo: true });
      setDisciplinas(disciplinasData);
    } catch (error) {
      console.error("Erro ao carregar disciplinas:", error);
    }
  }, []);

  useEffect(() => {
    carregarTurmas();
    carregarAlunos();
    carregarSalas();
    carregarProfessores();
    carregarDisciplinas();
  }, [
    carregarTurmas,
    carregarAlunos,
    carregarSalas,
    carregarProfessores,
    carregarDisciplinas,
  ]);

  const handleToggleStatus = async (id) => {
    try {
      await toggleStatusTurma(id);
      carregarTurmas();
    } catch (error) {
      console.error("Erro ao alternar status da turma:", error);
    }
  };

  const handleNovoCadastro = () => {
    setFormData({
      nome: "",
      dia_semana: "",
      horario_inicio: "",
      horario_termino: "",
      sala: null,
      professor: null,
      disciplina: null,
      alunos: [],
    });
    setCurrentStep(1);
    setShowModal(true);
  };

  const handleNextStep = () => setCurrentStep((prev) => prev + 1);
  const handlePrevStep = () => setCurrentStep((prev) => prev - 1);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAlunoToggle = (alunoId) => {
    setFormData((prev) => {
      const isAlreadySelected = prev.alunos.includes(alunoId);
      const updatedAlunos = isAlreadySelected
        ? prev.alunos.filter((id) => id !== alunoId) // Remove aluno se já estiver selecionado
        : [...prev.alunos, alunoId]; // Adiciona aluno se não estiver selecionado

      return { ...prev, alunos: updatedAlunos };
    });
  };

  const handleSave = async () => {
    try {
      // Enviando todos os dados do formulário para criar ou atualizar a turma
      await createTurma({
        ...formData,
        alunos: formData.alunos, // Certifique-se de que os IDs dos alunos estão sendo enviados
      });
  
      setShowModal(false); // Fecha o modal após salvar
      carregarTurmas(); // Recarrega a lista de turmas
    } catch (error) {
      console.error("Erro ao salvar turma:", error);
      alert("Não foi possível salvar a turma. Verifique os dados e tente novamente.");
    }
  };

  const filteredTurmas = turmas.filter((turma) =>
    turma.nome.toLowerCase().includes(filterName.toLowerCase())
  );

  return (
    <div className="turma-container">
      <h1>Gerenciamento de Turmas</h1>
      <div className="turma-actions">
        <input
          type="text"
          placeholder="Pesquisar Turmas"
          value={filterName}
          onChange={(e) => setFilterName(e.target.value)}
          className="turma-search"
        />
        <button className="btn btn-novo-cadastro" onClick={handleNovoCadastro}>
          Novo Cadastro
        </button>
      </div>

      <table className="turma-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Nome</th>
            <th>Dia da Semana</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
  {filteredTurmas.map((turma, index) => (
    <tr key={turma.id}>
      <td>{index + 1}</td>
      <td>{turma.nome}</td>
      <td>{turma.dia_semana}</td>
      <td>{turma.ativo ? "Ativo" : "Inativo"}</td>
      <td className="actions-column">
        {/* Botão de Alterar Status */}
        <button
          className="btn btn-toggle-status"
          onClick={() => handleToggleStatus(turma.id)}
        >
          {turma.ativo ? "Desativar" : "Ativar"}
        </button>

        {/* Botões de Editar e Excluir */}
        <button
          className="btn btn-editar"
          onClick={() => handleEdit(turma)}
        >
          Editar
        </button>
      </td>
    </tr>
  ))}
</tbody>

      </table>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            {currentStep === 1 && (
              <div>
                <h2>Informações Básicas</h2>
                <input
                  type="text"
                  name="nome"
                  placeholder="Nome"
                  value={formData.nome}
                  onChange={handleFormChange}
                />
                <select
                  name="dia_semana"
                  value={formData.dia_semana}
                  onChange={handleFormChange}
                >
                  <option value="">Selecione o Dia da Semana</option>
                  <option value="Segunda">Segunda</option>
                  <option value="Terça">Terça</option>
                  <option value="Quarta">Quarta</option>
                  <option value="Quinta">Quinta</option>
                  <option value="Sexta">Sexta</option>
                </select>
                <input
                  type="time"
                  name="horario_inicio"
                  value={formData.horario_inicio}
                  onChange={handleFormChange}
                />
                <input
                  type="time"
                  name="horario_termino"
                  value={formData.horario_termino}
                  onChange={handleFormChange}
                />
                <div className="modal-actions">
                  <button className="btn btn-cancelar" onClick={() => setShowModal(false)}>
                    Cancelar
                  </button>
                  <button className="btn btn-confirmar" onClick={handleNextStep}>
                    Avançar
                  </button>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div>
                <h2>Associar Recursos</h2>
                <select
                  name="sala"
                  value={formData.sala}
                  onChange={handleFormChange}
                >
                  <option value="">Selecione a Sala</option>
                  {salas.map((sala) => (
                    <option key={sala.id} value={sala.id}>
                      {sala.nome}
                    </option>
                  ))}
                </select>
                <select
                  name="professor"
                  value={formData.professor}
                  onChange={handleFormChange}
                >
                  <option value="">Selecione o Professor</option>
                  {professores.map((professor) => (
                    <option key={professor.id} value={professor.id}>
                      {professor.nome}
                    </option>
                  ))}
                </select>
                <select
                  name="disciplina"
                  value={formData.disciplina}
                  onChange={handleFormChange}
                >
                  <option value="">Selecione a Disciplina</option>
                  {disciplinas.map((disciplina) => (
                    <option key={disciplina.id} value={disciplina.id}>
                      {disciplina.nome}
                    </option>
                  ))}
                </select>
                <div className="modal-actions">
                  <button className="btn btn-cancelar" onClick={handlePrevStep}>
                    Voltar
                  </button>
                  <button className="btn btn-confirmar" onClick={handleNextStep}>
                    Avançar
                  </button>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div>
                <h2>Adicionar Alunos</h2>
                <ul className="aluno-list">
                  {alunos.map((aluno) => (
                    <li key={aluno.id}>
                      <label>
                        <input
                          type="checkbox"
                          checked={formData.alunos.includes(aluno.id)}
                          onChange={() => handleAlunoToggle(aluno.id)}
                        />
                        {aluno.nome}
                      </label>
                    </li>
                  ))}
                </ul>
                <div className="modal-actions">
                  <button className="btn btn-cancelar" onClick={handlePrevStep}>
                    Voltar
                  </button>
                  <button className="btn btn-confirmar" onClick={handleSave}>
                    Finalizar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Turma;
