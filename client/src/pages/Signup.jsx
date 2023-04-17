import { Container, TextField, Box, FormLabel, Checkbox,Alert, Button } from '@mui/material'
import React, { useState } from 'react'
import { serverLink } from '../helpers/server'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'

const Signup = () => {

    const navigate= useNavigate()
    const [inputValues, setInputValues] = useState({
        email: '',
        firstName: '',
        lastName: '',
        password: '',
        about: '',
        role: false
    })

    const [isErr, setIsErr] = useState(false)
    const [errMsg, setErrMsg] = useState('')

    const handleFormChanges = (e) => {
        setInputValues(prev => {
            return {
                ...prev,
                [e.target.name]:e.target.value
            }
        })
    }

    const handleSubmit = async () => {
        try {
        
            const res = await fetch(`${serverLink}/users`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body:JSON.stringify({...inputValues, role : inputValues.role ? 'seller' : 'buyer'})
            })

            const data = await res.json()
            if (!data.status) {
                setIsErr(true)
                setErrMsg(data.message)
            }
            else {
                localStorage.setItem('access_token',data.access_token)
                setIsErr(false)
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
                <h3>Create account</h3>
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
                            onChange={(e)=> handleFormChanges(e)}

                        />
                    </Box>
                    <Box
                        className='input-container'
                    >
                        <FormLabel htmlFor='firstname'>Input your firstname</FormLabel>
                        <TextField
                            name='firstName'
                            onChange={(e) => handleFormChanges(e)}
                            value={inputValues.firstName}
                            id='firstname'
                            label='first name'

                        />
                    </Box>
                    <Box
                        className='input-container'
                    >
                        <FormLabel htmlFor='lastname'>Input your last name:</FormLabel>
                        <TextField
                            onChange={(e) => handleFormChanges(e)}
                            name='lastName'
                            id='lastname'
                            value={inputValues.lastName}
                            label='last name'

                        />
                    </Box>
                    <Box
                        className='input-container'
                    >
                        <FormLabel htmlFor='password'> Create your password:</FormLabel>
                        <TextField
                            onChange={(e) => handleFormChanges(e)}
                            name='password'
                            value={inputValues.password}
                            id='password'
                            label='password'

                        />
                    </Box>
                    <Box
                        className='input-container'
                    >
                        <FormLabel htmlFor='about'>Tell us more about your self:</FormLabel>
                        <TextField
                            value={inputValues.about}
                            name='about'
                            id='about'
                            onChange={(e) => handleFormChanges(e)}
                            label='I am ...'

                        />
                    </Box>

                    <Box
                        className='input-container'
                    >
                        <FormLabel htmlFor='about'>Are you a seller ?</FormLabel>
                        <Checkbox
                            checked={inputValues.seller}
                            onChange={()=>setInputValues(prev => { 
                              return   { ...prev, role : !inputValues.role}
                            })}
                        />
                    </Box>

                    <Button
                        variant='contained'
                        color='primary'
                        onClick={handleSubmit}
                    >
                       create account
                    </Button>

                    <Box className='input-container'>
                        <p>
                            Already have an account ? 

                            <Link to='/login'>
                            Sign in
                            </Link>
                            </p>
                    </Box>
                </Box>
            </Box>
        </Container>
    )
}

export default Signup