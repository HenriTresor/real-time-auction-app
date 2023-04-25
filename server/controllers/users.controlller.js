import Joi from "joi"
import { validateSchema } from "../validators/joiUser.js"
import User from "../models/User.model.js"
import { createToken } from "../utils/jwt.js"
import { checkUser } from "../funtions/user.functions.js"
import _ from 'lodash'

export const createUser = async (req, res, next) => {
    try {
        let { email, first_name, last_name, password } = req.body
        const { error, value } = validateSchema.validate({ email, first_name, last_name, password })

        if (error) {
            let err = new Error(error.details[0].message)
            err.status = 400
            next(err)
            return
        }

        // check if user exists
        let user = await checkUser(value?.email)
        if (user) {
            let err = new Error('user already exists')
            err.status = 409
            next(err)
            return
        }
        let newUser = new User({
            first_name: value.first_name,
            last_name: value.last_name,
            email: value.email,
            password: value.password
        })

        await newUser.save()
        const token = await createToken(newUser?._id)
        res.status(201).json({
            status: true,
            message: 'new user saved ',
            access_token: token,
            user: _.pick(newUser, ['email', '_id', 'first_name', 'last_name'])
        })
    } catch (err) {
        err.status = 500
        err.message = err.message
        next(err)
    }
}
export const getAllUsers = async (req, res, next) => { }
export const getSingleUser = async (req, res, next) => {
    try {

    } catch (err) {

    }
}

export const getUserProfile = async (req, res, next) => {
    try {
        let { id } = req

        let user = await User.findById(id).select('-password')
        if (!user) {
            let err = new Error('user was not found')
            err.status = 404
            return next(err)
        }
        return res.status(200).json({ status: true, user })
    } catch (error) {
        let err = new Error(error.message)
        err.code = 500
        next(err)
    }
}
