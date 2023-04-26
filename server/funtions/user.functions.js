import User from "../models/user.model.js"

const checkUser = async (email) => {
    const user = await User.findOne({ email: email }).select('-password')
    if (user) return true
    return false
}

export { checkUser }