import { Container, TextField, Box, FormLabel, Checkbox, Alert, Button } from '@mui/material'
import React, { useState, useContext, useEffect } from 'react'
import { serverLink } from '../helpers/server'
import { useNavigate } from 'react-router-dom'
import {Link} from 'react-router-dom'
import { AuthData } from '../context/AuthProvider'

const Login = () => {

  let { isLoggedIn, setIsLoggedIn, setCurrentUser } = useContext(AuthData)


  const navigate =useNavigate()
  const [inputValues, setInputValues] = useState({
    email: '',
    password: '',
  })

  const [isErr, setIsErr] = useState(false)
  const [errMsg, setErrMsg] = useState('')

  useEffect(() => {

    if (isLoggedIn) {
      navigate('/')
    }
  }, [isLoggedIn])
  const handleFormChanges = (e) => {
    setInputValues(prev => {
      return {
        ...prev,
        [e.target.name]: e.target.value
      }
    })
  }

  const handleSubmit = async () => {
    console.log(inputValues);
    try {

      const res = await fetch(`${serverLink}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(inputValues)
      })

      const data = await res.json()
      if (!data.status) {
        setIsErr(true)
        setErrMsg(data.message)
      }
      else {
        console.log(data);
        localStorage.setItem('access_token', data.access_token)
        setIsErr(false)
        setIsLoggedIn(true)
        setCurrentUser(data.user)
        location.assign('/')
      }
    } catch (err) {
      setIsErr(true)
      setErrMsg(err.message)
    }
  }
  return (
    <Container className='body'>
      <Box>
        <h3>Sign in</h3>
        {
          isErr && <Alert severity='error'>
            {errMsg}
          </Alert>
        }
        <Box className='underline'>
        </Box>

        <Box>
          <Box
            className='input-container'
          >
            <FormLabel htmlFor='email'>Enter your email:</FormLabel>
            <TextField
              name='email'
              id='email'
              label='Email'
              value={inputValues.email}
              onChange={(e) => handleFormChanges(e)}

            />
          </Box>
         
          <Box
            className='input-container'
          >
            <FormLabel htmlFor='password'> Input your password:</FormLabel>
            <TextField
              onChange={(e) => handleFormChanges(e)}
              name='password'
              value={inputValues.password}
              id='password'
              label='password'

            />
          </Box>
         

          <Button
            variant='contained'
            color='primary'
            onClick={handleSubmit}
          >
            sign in
          </Button>

          <Box
          className='input-container'
          >
            <p>
              Don't have an account yet? 

              <Link to='/signup'>
                  Create one!
              </Link>
            </p>
          </Box>
        </Box>
      </Box>
    </Container>
  )
}

export default Login