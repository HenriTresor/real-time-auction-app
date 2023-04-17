const jwt = require('jsonwebtoken')

const createToken = (id) => {
    return jwt.sign({ id }, process.env.ACCESS_SECRET_TOKEN, {
        expiresIn: '1w'
    })
}

module.exports = createToken
