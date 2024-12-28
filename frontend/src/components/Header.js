import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook } from '@fortawesome/free-solid-svg-icons';

const Header = ({ isAuthenticated, handleLogout }) => {
    
    const handleUserLogout = () => {
        localStorage.removeItem('userEmail'); // Limpa o email do usuário
        localStorage.removeItem('token');    // Limpa o token
        alert('Você saiu da sua conta.');
        window.location.reload();            // Recarrega a página
    };
    
          
    return (
        <header className="bg-dark text-light py-4">
            <div className="container text-center">
                {/* Nome da Página com Ícone */}
                <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>
                    <FontAwesomeIcon icon={faBook} className="me-2" />
                    Compartilhe Livros
                </h1>
                <p className="lead" style={{ color: '#d1d1d1' }}>
                Compartilhe Livros: Dividindo Conhecimento
                </p>
                
                {/* Navegação */}
                <nav className="mt-4">
                    <a href="/books" className="btn btn-outline-light mx-2">
                        Livros
                    </a>
                    {isAuthenticated ? (
                        <>
                            <a href="/my-books" className="btn btn-outline-light mx-2">
                                Meus Livros
                            </a>
                            <a href="/add-book" className="btn btn-outline-light mx-2">
                                Adicionar Livro
                            </a>
                            <button
                                className="btn btn-danger mx-2"
                                onClick={handleUserLogout}
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <a href="/login" className="btn btn-outline-light mx-2">
                            Login
                        </a>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default Header;



