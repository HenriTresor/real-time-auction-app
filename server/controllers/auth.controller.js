const createToken = require("../helpers/createToken");
const User = require("../models/User.model");
const { compare } = require('bcrypt');

const loginUser = async (req, res) => {
    try {

        let { email, password } = req.body

        if(!email || !password) return res.status(400).json({status:false, message:"email and password are required"})

        let user = await User.findOne({ email })
        if (!user) return res.status(404).json({ status: false, message: 'invalid email address' })

        let comparedPwd = await compare(password, user.password)
        if (comparedPwd) {
            let token = createToken(user._id)
            return res.status(200).json({
                status: true, message: 'user logged in successfully', access_token: token, user})
        }
        return res.status(400).json({ status: false, message: 'invalid email or password' })
    } catch (err) {
        console.error('error logging in user', err.message);
        return res.status(500).json({ status: false, message: 'server error' })
    }
}

module.exports = { loginUser }