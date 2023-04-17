const jwt = require('jsonwebtoken')
const User = require('../models/User.model')

const verifyToken = async (req, res, next) => {
    try {
        
        let authHeader = req.headers['authorization']
        if (!authHeader) return res.status(401).json({ status: false, message: 'authorization required' })

        let token = authHeader.split(' ')[1]
        if (!token) return res.status(401).json({ status: false, message: 'access token missing' })

        let decodedToken = jwt.verify(token, process.env.ACCESS_SECRET_TOKEN)
        
        let user = await User.findById(decodedToken.id).select('-password')
        req.user = user
        next()
    } catch (err) {
        console.log('error verifying token:', err.message);
        return res.status(400).json({ status: false, message: err.message,errName:err.name })
    }
}

module.exports = verifyToken