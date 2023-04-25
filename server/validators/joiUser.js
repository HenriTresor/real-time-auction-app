import Joi from "joi";

const validateSchema = Joi.object({
    first_name: Joi.string().required('first name is required'),
    last_name: Joi.string().required('last name is required'),
    email: Joi.string().email().min(5).max(100).required('email is required'),
    password: Joi.string().min(6).max(65).required('password is required')
})

export { validateSchema }