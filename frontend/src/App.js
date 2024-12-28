import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Login from './pages/Login';
import BooksList from './pages/BooksList';
import AddBook from './pages/AddBook';
import Register from './pages/Register';
import MyBooks from './pages/MyBooks';
import AdminPanel from './pages/AdminPanel';

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Verificar o token no localStorage ao carregar a página
    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsAuthenticated(!!token); // Atualiza o estado com base no token
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token'); // Remove o token ao deslogar
        setIsAuthenticated(false); // Atualiza o estado de autenticação
    };

    return (
        <Router>
            <Header isAuthenticated={isAuthenticated} handleLogout={handleLogout} />
            <main className="container mt-4">
                <Routes>
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login setAuth={setIsAuthenticated} />} />
                    <Route path="/books" element={<BooksList />} />
                    <Route path="/add-book" element={<AddBook />} />
                    <Route path="/admin" element={<AdminPanel />} />
                    <Route path="/my-books" element={<MyBooks />} />;
                </Routes>
            </main>
        </Router>
    );
};

export default App;
