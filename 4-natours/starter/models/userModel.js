const mongoose = require('mongoose');
const crypto = require('crypto');
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
    role: {
        type: String,
        enum: ['user', 'guide', 'lead-guide', 'admin'],
        default: 'user'
    },
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
    },
    passwordResetToken: String,
    passwordResetTokenExpires: Date
});

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 12);

    this.passwordConfirmation = undefined;
    next();
});

userSchema.pre('save', function(next) {
    if (!this.isModified('password') || this.isNew) return next();

    this.passwordChangedAt = Date.now() - 1000;
    next();
});


// instance method - method that is available on all documents of a certain collection

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

userSchema.methods.createPasswordResetToken = function() {
    // using node's own crypto library
    const resetToken = crypto.randomBytes(32).toString('hex');
    // this reset token needs to be encrypted as it is stored in the db. it is low level (attack vector)
    this.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

        // logged as an object so i will the see the variable anme and the value
        console.log({ resetToken }, this.passwordResetToken);

    this.passwordResetTokenExpires = Date.now() + 10 * 60 * 1000;

    return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;