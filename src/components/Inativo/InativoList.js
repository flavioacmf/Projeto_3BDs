import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchInactives, reactivateItem } from "../../services/inactivesService";
import "./Inactives.css";

const Inactives = () => {
  const [selectedSection, setSelectedSection] = useState("disciplinas");
  const [inactiveData, setInactiveData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const sections = [
    { label: "Disciplinas", value: "disciplinas" },
    { label: "Professores", value: "professores" },
    { label: "Salas", value: "salas" },
    { label: "Alunos", value: "alunos" },
    { label: "Turmas", value: "turmas" },
  ];

  // Função para carregar itens inativos
  useEffect(() => {
    const loadInactives = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchInactives(selectedSection);
        console.log(`Itens inativos carregados para ${selectedSection}:`, data);
        setInactiveData(data);
      } catch (err) {
        console.error("Erro ao carregar itens inativos:", err);
        setError("Não foi possível carregar os itens inativos.");
      } finally {
        setIsLoading(false);
      }
    };

    loadInactives();
  }, [selectedSection]);

  // Função para reativar itens
  const handleReactivate = async (id) => {
    try {
      console.log(`Tentando reativar item com ID ${id} na seção ${selectedSection}`);
      const updatedItem = await reactivateItem(selectedSection, id);
      console.log(`Item reativado com sucesso:`, updatedItem);

      // Remove o item da lista local após reativar
      setInactiveData((prevData) =>
        prevData.filter((item) => item.id !== id)
      );
      alert("Item reativado com sucesso!");
    } catch (err) {
      console.error("Erro ao reativar o item:", err.response?.data || err.message);
      alert("Não foi possível reativar o item. Verifique o console para mais detalhes.");
    }
  };

  const handleBack = () => {
    navigate("/");
  };

  return (
    <div className="inactives-page">
      <button className="back-button" onClick={handleBack}>
        Voltar
      </button>
      <h1>Itens Inativos</h1>
      <div className="menu">
        {sections.map((section) => (
          <button
            key={section.value}
            className={`menu-button ${
              selectedSection === section.value ? "active" : ""
            }`}
            onClick={() => setSelectedSection(section.value)}
          >
            {section.label}
          </button>
        ))}
      </div>
      {isLoading ? (
        <p>Carregando...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : inactiveData.length === 0 ? (
        <p>Nenhum item inativo nesta categoria.</p>
      ) : (
        <ul className="inactive-list">
          {inactiveData.map((item) => (
            <li key={item.id}>
              <div>
                <strong>{item.nome || "Sem nome"}</strong>
                <p>{item.descricao || "Sem descrição"}</p>
              </div>
              <button onClick={() => handleReactivate(item.id)}>Reativar</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Inactives;
