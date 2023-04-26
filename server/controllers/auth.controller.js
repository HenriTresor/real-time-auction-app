import User from "../models/user.model.js"
import bcrypt from 'bcrypt'
import { createToken } from "../utils/jwt.js"
import _ from 'lodash'

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            let err = new Error('email and password is required')
            err.status = 400
            next(err)
            return
        }

        let user = await User.findOne({ email })
        if (!user) {
            let err = new Error('invalid email or password')
            err.status = 404
            next(err)
            return
        }
        let pwd = await bcrypt.compare(password, user?.password)
        if (!pwd) {
            let err = new Error('invalid email or password')
            err.status = 404
            next(err)
            return
        }

        const token = await createToken(user?._id)
        res.status(200).json({
            status: true,
            user: _.pick(user, ['email', '_id', 'first_name', 'last_name']),
            access_token: token
        })
    } catch (error) {
        let err = new Error(error.message)
        err.status = 500
        next(err)
    }
}