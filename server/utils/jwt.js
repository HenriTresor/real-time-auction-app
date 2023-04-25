import jwt from 'jsonwebtoken'

const createToken = async (id) => {
  try {
      return jwt.sign({ id }, process.env.ACCESS_SECRET_TOKEN, {
          expiresIn: '1w'
      })
  } catch (error) {
    console.log('error creating token', err.message);
  }
}

export { createToken }