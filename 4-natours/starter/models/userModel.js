const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'a user must have a name'],
        trim: true,
        minLength: [1, 'a name must have more than one character']
    },
    email: {
        type: String,
        required: [true, 'please provide your email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'please provide a valid email']
    },
    photo: String,
    password: {
        type: String,
        required: [true, 'please provide a password'],
        minLength: 8
    },
    passwordConfirmation: {
        type: String,
        required: [true, 'please confirm your password']
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;