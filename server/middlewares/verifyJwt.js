import jwt from 'jsonwebtoken'

export const verifyToken = async (req, res, next) => { 
    try {
        let authHeader = req?.headers['authorization']
        if (!authHeader) {
            let err = new Error('Authorization header is required')
            err.status = 403
            next(err)
            return
        }
        let token = authHeader?.split(' ')[1]
        if (!token) {
            let err = new Error('token is missing')
            err.status = 403
            next(err)
            return
        }

        let decodedToken = jwt.verify(token, process.env.ACCESS_SECRET_TOKEN)
        req.id = decodedToken.id
        return next()
    } catch (err) {
        let error = new Error(err.message)
        error.status = 401
        next(error)
    }
}