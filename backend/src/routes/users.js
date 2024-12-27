const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Modelo de Usuário
const User = require('../models/user');

// Cadastro de Usuário
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Verificar se o e-mail já está cadastrado
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Usuário já cadastrado!' });
        }

        // Criptografar a senha
        const hashedPassword = await bcrypt.hash(password, 10);

        // Criar o usuário
        const user = new User({ name, email, password: hashedPassword });
        await user.save();

        res.status(201).json({ message: 'Usuário registrado com sucesso!' });
    } catch (error) {
        console.error(error); // Para exibir o erro no terminal
        res.status(500).json({ message: 'Erro no servidor.', error: error.message });
    }
});

// Login de Usuário
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('Tentando login com:', { email });

        // Verificar se o usuário existe
        const user = await User.findOne({ email });
        if (!user) {
            console.log('Usuário não encontrado:', email);
            return res.status(400).json({ message: 'Usuário não encontrado!' });
        }

        // Verificar a senha
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            console.log('Senha inválida para o usuário:', email);
            return res.status(401).json({ message: 'Credenciais inválidas!' });
        }

        // Gerar o token JWT
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        console.log('Login bem-sucedido para:', email);

        // Enviar o token e o e-mail do usuário no login
        res.status(200).json({ message: 'Login bem-sucedido!', token, email });
    } catch (error) {
        console.error('Erro durante o login:', error); // Log detalhado no console
        res.status(500).json({ message: 'Erro no servidor.', error: error.message });
    }
});

module.exports = router;
