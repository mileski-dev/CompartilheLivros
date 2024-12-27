import React, { useState } from 'react';
import axios from 'axios';

const AddBook = () => {
    const [form, setForm] = useState({ title: '', author: '', genre: '', city: '' });
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            const response = await axios.post('http://localhost:5000/books', form, config);
            setMessage('Livro cadastrado com sucesso!');
            setForm({ title: '', author: '', genre: '', city: '' });
        } catch (error) {
            console.error('Erro ao cadastrar livro:', error.response?.data || error.message);
            setMessage('Erro ao cadastrar livro.');
        }
    };

    return (
        <div style={{ backgroundColor: '#f4f8fb', minHeight: '100vh', padding: '20px' }}>
            <div className="container">
                <h2 className="text-info text-center mb-4" style={{ fontWeight: 'bold' }}>
                    Adicionar Livro
                </h2>
                <form
                    onSubmit={handleSubmit}
                    className="p-4 rounded shadow-sm"
                    style={{ backgroundColor: '#ffffff', maxWidth: '400px', margin: '0 auto' }}
                >
                    {message && <p className={message.includes('sucesso') ? 'text-success' : 'text-danger'}>{message}</p>}
                    <div className="mb-3">
                        <label className="form-label">Título</label>
                        <input
                            type="text"
                            className="form-control"
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Autor</label>
                        <input
                            type="text"
                            className="form-control"
                            name="author"
                            value={form.author}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Gênero</label>
                        <input
                            type="text"
                            className="form-control"
                            name="genre"
                            value={form.genre}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Cidade</label>
                        <input
                            type="text"
                            className="form-control"
                            name="city"
                            value={form.city}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100">
                        Cadastrar Livro
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddBook;
