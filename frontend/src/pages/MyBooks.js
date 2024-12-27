import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MyBooks = () => {
  const [books, setBooks] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMyBooks = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Token JWT não encontrado.');
        setError('Você precisa estar logado para acessar seus livros.');
        return;
      }

      try {
        const response = await axios.get('/books/my-books', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBooks(response.data);
      } catch (error) {
        console.error('Erro ao buscar os livros:', error.message);
        setError('Erro ao buscar os livros. Verifique sua conexão.');
      }
    };

    fetchMyBooks();
  }, []);

  const handleDelete = async (bookId) => {
    const confirmDelete = window.confirm('Tem certeza de que deseja excluir este livro?');
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/books/${bookId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBooks(books.filter((book) => book._id !== bookId)); // Atualiza a lista após a exclusão
      alert('Livro excluído com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir o livro:', error.message);
      alert('Erro ao excluir o livro. Tente novamente.');
    }
  };

  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Meus Livros</h1>
      {books.length === 0 ? (
        <p>Você ainda não cadastrou nenhum livro.</p>
      ) : (
        <ul>
          {books.map((book) => (
            <li key={book._id}>
              <strong>{book.title}</strong> - {book.author}
              <button
                onClick={() => handleDelete(book._id)}
                style={{
                  marginLeft: '10px',
                  padding: '5px 10px',
                  color: 'white',
                  backgroundColor: 'red',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                Excluir
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyBooks;
