import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
    const [form, setForm] = useState({ name: '', email: '', password: '' });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/users/register`, form);
            setMessage(response.data.message); // Exibe mensagem de sucesso
            setForm({ name: '', email: '', password: '' }); // Limpa o formulário
            setError(''); // Limpa mensagens de erro
        } catch (err) {
            setError(err.response?.data?.message || 'Erro ao registrar usuário.');
            setMessage(''); // Limpa mensagens de sucesso
        }
    };

    return (
        <div style={{ backgroundColor: '#f4f8fb', minHeight: '100vh', padding: '20px' }}>
            <div className="container">
                <h2 className="text-info text-center mb-4" style={{ fontWeight: 'bold' }}>
                    Cadastro de Usuário
                </h2>
                <form
                    onSubmit={handleSubmit}
                    className="p-4 rounded shadow-sm"
                    style={{ backgroundColor: '#ffffff', maxWidth: '400px', margin: '0 auto' }}
                >
                    {message && <p className="text-success">{message}</p>}
                    {error && <p className="text-danger">{error}</p>}
                    <div className="mb-3">
                        <label className="form-label">Nome</label>
                        <input
                            type="text"
                            className="form-control"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            className="form-control"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Senha</label>
                        <input
                            type="password"
                            className="form-control"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100">
                        Cadastrar
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Register;
