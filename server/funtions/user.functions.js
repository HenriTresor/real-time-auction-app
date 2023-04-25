import User from "../models/User.model.js"

const checkUser = async (email) => {
    const user = await User.findOne({ email: email }).select('-password')
    if (user) return true
    return false
}

export { checkUser }