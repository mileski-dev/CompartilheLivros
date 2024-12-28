const express = require('express');
const router = express.Router();
const Book = require('../models/book'); // Modelo de Livro
const authenticateToken = require('../middleware/auth'); // Middleware de autenticação opcional
const mailgun = require('mailgun-js');
const User = require('../models/user'); // Modelo do Usuário

// Configuração do Mailgun
const DOMAIN = process.env.MAILGUN_DOMAIN;
const apiKey = process.env.MAILGUN_API_KEY; 
const mg = mailgun({ apiKey, domain: DOMAIN });

// Middleware de configuração para evitar crashes por erro não tratado
router.use((req, res, next) => {
    try {
        next();
    } catch (error) {
        console.error('Erro não tratado:', error.message);
        res.status(500).json({ message: 'Erro no servidor.' });
    }
});

// Rota para listar livros (GET /books)
router.get('/', async (req, res) => {
    try {
        const { title, author, city } = req.query; // Parâmetros de busca e filtro
        const query = {};

        if (title) {
            query.title = { $regex: title, $options: 'i' }; // Busca parcial por título
        }
        if (author) {
            query.author = { $regex: author, $options: 'i' }; // Busca parcial por autor
        }
        if (city) {
            query.city = city; // Filtro exato por cidade
        }

        const books = await Book.find(query); // Busca os livros no banco de dados
        res.status(200).json(books);
    } catch (error) {
        console.error('Erro ao listar livros:', error.message);
        res.status(500).json({ message: 'Erro ao listar livros.' });
    }
});

// Rota para cadastrar um novo livro
router.post('/', authenticateToken, async (req, res) => {
    try {
        const { title, author, genre, city } = req.body;

        // Validação dos campos obrigatórios
        if (!title || !author || !city) {
            return res.status(400).json({ message: 'Os campos "Título", "Autor" e "Cidade" são obrigatórios.' });
        }

        const book = new Book({
            title,
            author,
            genre,
            city,
            userId: req.user.userId, // Obtido do token JWT
        });

        await book.save();
        res.status(201).json({ message: 'Livro cadastrado com sucesso!', book });
    } catch (error) {
        console.error('Erro ao cadastrar livro:', error.message);
        res.status(500).json({ message: 'Erro ao cadastrar livro.' });
    }
});

// Rota para envio de mensagem ao proprietário do livro
router.post('/:id/message', async (req, res) => {
    try {
        const { email, message } = req.body; // E-mail do interessado e mensagem enviada
        const bookId = req.params.id;

        // Buscar o livro pelo ID
        const book = await Book.findById(bookId).populate('userId');
        if (!book) {
            return res.status(404).json({ message: 'Livro não encontrado.' });
        }

        // Buscar o proprietário do livro
        const bookOwner = book.userId;
        if (!bookOwner || !bookOwner.email) {
            return res.status(404).json({ message: 'Proprietário do livro não encontrado.' });
        }

        // Configurar o conteúdo do e-mail
        const mailData = {
            from: `Contato Livros <contato@${DOMAIN}>`,
            to: bookOwner.email, // E-mail do proprietário do livro
            subject: `Interesse no livro: ${book.title}`,
            text: `
                Olá ${bookOwner.name},

                O usuário com o e-mail ${email} demonstrou interesse no livro "${book.title}".
                Mensagem: "${message}"

                Entre em contato com o interessado para mais detalhes.
            `,
        };

        // Enviar o e-mail com o Mailgun
        mg.messages().send(mailData, (error, body) => {
            if (error) {
                console.error('Erro ao enviar mensagem:', error);
                return res.status(500).json({ message: 'Erro ao enviar mensagem.' });
            }
            res.status(200).json({ message: 'Mensagem enviada com sucesso!', body });
        });
    } catch (error) {
        console.error('Erro ao enviar mensagem:', error.message);
        res.status(500).json({ message: 'Erro ao enviar mensagem.', error: error.message });
    }
});

// Rota para listar os livros do usuário logado
router.get('/my-books', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId; // Obtido do token JWT
        console.log('Usuário logado:', userId); // Log para verificar o ID do usuário
        const books = await Book.find({ userId });
        console.log('Livros encontrados:', books); // Log para verificar os livros retornados
        res.status(200).json(books);
    } catch (error) {
        console.error('Erro ao buscar os livros do usuário:', error.message);
        res.status(500).json({ message: 'Erro ao buscar os livros do usuário.' });
    }
});

  
// Rota para excluir um livro do usuário logado
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.userId; // Obtido do token JWT

        // Verifica se o livro pertence ao usuário logado
        const book = await Book.findOne({ _id: id, userId });
        if (!book) {
            return res.status(404).json({ message: 'Livro não encontrado ou não pertence ao usuário.' });
        }

        await Book.deleteOne({ _id: id });
        res.status(200).json({ message: 'Livro excluído com sucesso.' });
    } catch (error) {
        console.error('Erro ao excluir o livro:', error.message);
        res.status(500).json({ message: 'Erro ao excluir o livro.' });
    }
});

// Rota para exclusão de livros por um administrador
router.delete('/admin/books/:id', authenticateToken, async (req, res) => {
    try {
        // Verificar se o usuário é administrador
        const user = await User.findById(req.user.id);
        if (!user || !user.isAdmin) {
            return res.status(403).send({ message: 'Acesso negado' });
        }

        const book = await Book.findByIdAndDelete(req.params.id);
        if (!book) {
            return res.status(404).send({ message: 'Livro não encontrado' });
        }
        res.status(200).send({ message: 'Livro deletado com sucesso!' });
    } catch (error) {
        res.status(500).send({ error: 'Erro ao deletar o livro' });
    }
});

module.exports = router;
