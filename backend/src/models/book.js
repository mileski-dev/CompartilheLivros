const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    genre: { type: String },
    city: { type: String, required: true }, // Novo campo obrigatório
    available: { type: Boolean, default: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Relaciona o livro a um usuário
});

module.exports = mongoose.model('Book', bookSchema);
