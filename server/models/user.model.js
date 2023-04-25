import mongoose from "mongoose";
import { hash } from "bcrypt";
const userSchema = new mongoose.Schema(
    {
        first_name: { type: String, required: true },
        last_name: { type: String, required: true },
        email: { type: String, lowercase: true, required: true, unique: true },
        password: { type: String, required: true, minlength: 6 }

    },
    {
        timestamps: true
    }
)

userSchema.pre('save', async function(){
    try {
        const hashedPwd = await hash(this.password, 10)
        this.password = hashedPwd
    } catch (error) {
        console.log('error hashing password', err.message);
    }
})


const User = mongoose.model('users', userSchema)

export default User