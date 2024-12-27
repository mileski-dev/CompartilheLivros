import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BooksList = () => {
    const [books, setBooks] = useState([]);
    const [search, setSearch] = useState({ title: '', author: '', city: '' });
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [userEmail, setUserEmail] = useState(localStorage.getItem('userEmail'));

    // Buscar livros ao carregar a página e configurar escutadores
    useEffect(() => {
        fetchBooks();

        // Atualiza o estado de login com base no localStorage
        const updateLoginStatus = () => {
            const email = localStorage.getItem('userEmail');
            setUserEmail(email);
        };

        // Escutador para mudanças no localStorage
        window.addEventListener('storage', updateLoginStatus);

        return () => {
            window.removeEventListener('storage', updateLoginStatus);
        };
    }, []);

    const fetchBooks = async () => {
        try {
            const params = {};
            if (search.title) params.title = search.title;
            if (search.author) params.author = search.author;
            if (search.city) params.city = search.city;

            const response = await axios.get('http://localhost:5000/books', { params });
            setBooks(response.data);
        } catch (err) {
            console.error('Erro ao buscar livros:', err.response?.data || err.message);
            setError('Erro ao buscar livros.');
        }
    };

    const handleChange = (e) => {
        setSearch({ ...search, [e.target.name]: e.target.value });
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchBooks();
    };

    const handleSendMessage = async (bookId) => {
        if (!userEmail) {
            alert('Por favor, faça login para enviar mensagens.');
            return;
        }

        const message = prompt('Digite sua mensagem para o proprietário do livro:');
        if (!message) {
            alert('Por favor, insira uma mensagem.');
            return;
        }

        try {
            const response = await axios.post(`http://localhost:5000/books/${bookId}/message`, {
                email: userEmail,
                message,
            });
            setMessage(response.data.message);
        } catch (err) {
            console.error('Erro ao enviar mensagem:', err.response?.data || err.message);
            setMessage('Erro ao enviar mensagem.');
        }
    };

    return (
        <div className="container mt-4">
            <h2 className="text-center mb-4">Lista de Livros</h2>

            {/* Formulário de Busca e Filtro */}
            <form onSubmit={handleSearch} className="mb-4">
                <div className="row">
                    <div className="col-md-4">
                        <input
                            type="text"
                            name="title"
                            className="form-control"
                            placeholder="Buscar por Título"
                            value={search.title}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="col-md-4">
                        <input
                            type="text"
                            name="author"
                            className="form-control"
                            placeholder="Buscar por Autor"
                            value={search.author}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="col-md-4">
                        <input
                            type="text"
                            name="city"
                            className="form-control"
                            placeholder="Filtrar por Cidade"
                            value={search.city}
                            onChange={handleChange}
                        />
                    </div>
                </div>
                <button type="submit" className="btn btn-primary mt-3">
                    Buscar
                </button>
            </form>

            {/* Mensagem de Erro ou Sucesso */}
            {message && <p className={message.includes('sucesso') ? 'text-success' : 'text-danger'}>{message}</p>}
            {error && <p className="text-danger">{error}</p>}

            {/* Lista de Livros */}
            <ul className="list-group">
                {books.map((book) => (
                    <li key={book._id} className="list-group-item d-flex justify-content-between align-items-center">
                        <div>
                            <strong>{book.title}</strong> - {book.author} ({book.genre}) - {book.city}
                        </div>
                        {userEmail ? (
                            <button
                                className="btn btn-primary"
                                onClick={() => handleSendMessage(book._id)}
                            >
                                Enviar Mensagem
                            </button>
                        ) : (
                            <p style={{ color: 'red', marginBottom: 0 }}>
                                Faça login para enviar mensagens.
                            </p>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default BooksList;
