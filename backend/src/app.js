const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares globais
app.use(cors());
app.use(express.json());

// Conexão com o MongoDB
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB conectado'))
    .catch((err) => console.error('Erro ao conectar ao MongoDB:', err));

// Rotas de usuários
const userRoutes = require('./routes/users');
app.use('/users', userRoutes);

// Rotas de livros
const bookRoutes = require('./routes/books');
app.use('/books', bookRoutes);

// Inicializar o servidor
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));




