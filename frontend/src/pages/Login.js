import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = ({ setAuth }) => {
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/users/login`, form);
            const { token, email } = response.data;

            // Salvar o token no localStorage e autenticar
            localStorage.setItem('token', token);
            localStorage.setItem('userEmail', email);
            setAuth(true); // Atualizar estado de autenticação
            setError('');
            navigate('/books'); // Redirecionar para a lista de livros
        } catch (err) {
            setError('Credenciais inválidas. Tente novamente.');
        }
    };

    return (
        <div style={{ backgroundColor: '#f4f8fb', minHeight: '100vh', padding: '20px' }}>
            <div className="container">
                <h2 className="text-info text-center mb-4" style={{ fontWeight: 'bold' }}>
                    Login
                </h2>
                <form
                    onSubmit={handleSubmit}
                    className="p-4 rounded shadow-sm"
                    style={{ backgroundColor: '#ffffff', maxWidth: '400px', margin: '0 auto' }}
                >
                    {error && <p className="text-danger">{error}</p>}
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
                        Entrar
                    </button>
                </form>

                {/* Link para a página de registro */}
                <p className="text-center mt-3">
                    Não tem uma conta?{' '}
                    <a href="/register" className="text-info">
                        Cadastre-se aqui
                    </a>
                </p>
            </div>
        </div>
    );
};

export default Login;
