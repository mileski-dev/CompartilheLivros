import React, { useEffect, useState } from 'react';

const AdminPanel = () => {
    const [books, setBooks] = useState([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetch('/api/books')
            .then((response) => response.json())
            .then((data) => setBooks(data))
            .catch((error) => console.error('Erro ao carregar livros:', error));
    }, []);

    const deleteBook = (id) => {
        fetch(`/api/admin/books/${id}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then((response) => {
                if (response.ok) {
                    setMessage('Livro deletado com sucesso!');
                    setBooks(books.filter((book) => book._id !== id));
                } else {
                    setMessage('Erro ao deletar livro');
                }
            })
            .catch((error) => {
                console.error('Erro ao deletar livro:', error);
                setMessage('Erro ao deletar livro');
            });
    };

    return (
        <div>
            <h1>Painel Administrativo</h1>
            {message && <p>{message}</p>}
            <ul>
                {books.map((book) => (
                    <li key={book._id}>
                        {book.title} - {book.author}
                        <button onClick={() => deleteBook(book._id)}>Deletar</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AdminPanel;
