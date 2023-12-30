const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: { type: String, default: 'user' },
    address: {
        type: String, default: 'Shop No 1, Lala Compound, Mahakalicave Rd, Near Holy Street Hospital, Andheri (west)'
    },
    img: { type: String, default: '' }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
