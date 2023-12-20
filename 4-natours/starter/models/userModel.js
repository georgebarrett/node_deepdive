const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

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
        minLength: 8,
        select: false
    },
    passwordConfirmation: {
        type: String,
        required: [true, 'please confirm your password'],
        // this only works on save and create
        validate: {
            validator: function(el) {
                return el === this.password;
            },
            message: 'passwords do not match'
        }
    },
    passwordChangedAt: {
        type: Date,
        default: Date.now
    }
});

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 12);

    this.passwordConfirmation = undefined;
    next();
});


// instance method - method that available on all documents of a certain collection

userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changePasswordAfterAccountCreation = function(JWTTimestamp) {
    if (this.passwordChangedAt) {
        const passwordChangedTimeStamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
        console.log(passwordChangedTimeStamp, JWTTimestamp);
        
        return JWTTimestamp < passwordChangedTimeStamp;
    }  
    
    
    return false;
};



const User = mongoose.model('User', userSchema);

module.exports = User;