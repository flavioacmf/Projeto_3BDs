import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Home from './components/Home';
import Aluno from './components/Aluno/Aluno';
import Professor from './components/Professor/Professor';
import Disciplina from './components/Disciplina/Disciplina';
import Sala from './components/Sala/Sala';
import Turma from './components/Turma/Turma';
import Inativo from './components/Inativo/InativoList';
import Feedback from './components/feedback/Feedback'; // Importa o componente de Feedback

function App() {
    return (
        <Router>
            <div className="app-container">
                {/* Menu Lateral */}
                <aside className="sidebar">
                    <h2>Sistema Faculdade</h2>
                    <nav>
                        <ul>
                            <li><Link to="/">Início</Link></li>
                            <li><Link to="/aluno">Alunos</Link></li>
                            <li><Link to="/professor">Professores</Link></li>
                            <li><Link to="/disciplina">Disciplinas</Link></li>
                            <li><Link to="/sala">Salas</Link></li>
                            <li><Link to="/turma">Turmas</Link></li>
                            <li><Link to="/inativo">Inativos</Link></li>
                            <li><Link to="/feedback">Feedback</Link></li> {/* Adiciona o link para Feedback */}
                        </ul>
                    </nav>
                </aside>

                {/* Conteúdo Principal */}
                <main className="main-content">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/aluno" element={<Aluno />} />
                        <Route path="/professor" element={<Professor />} />
                        <Route path="/disciplina" element={<Disciplina />} />
                        <Route path="/sala" element={<Sala />} />
                        <Route path="/turma" element={<Turma />} />
                        <Route path="/inativo" element={<Inativo />} />
                        <Route path="/feedback" element={<Feedback />} /> {/* Rota para Feedback */}
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;
