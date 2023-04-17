const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        lowercase: true,
        unique: true,
        required: true,
        trim: true
    },
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },

    about: {
        type: String,
        default: "bidder"
    },
    password: {
        type: String,
        minlength: 7,
        maxlength: 100,
        required: true
    },
    role: {
        type: String,
        enum: ['seller', 'buyer']
   }
}, { timestamps: true })

userSchema.pre('save', async function () {
    try {
        let hashedPwd = await bcrypt.hash(this.password, 10);
        this.password = hashedPwd

    } catch (err) {
        console.log('error hashing password:', err.message);
    }
})


const User = mongoose.model('users', userSchema)

module.exports = User