import {
    Container,
    Box,
    Typography,
    Button,
    InputLabel,
    TextField,
    Snackbar
} from '@mui/material'
import  { useContext, useEffect, useReducer, useState } from 'react'
import { Link } from 'react-router-dom'
import { LoadingButton } from '@mui/lab'
import { loginLink } from '../utils/server.links'
import { useNavigate } from 'react-router-dom'
import { AuthData } from '../context/AuthContext'

const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCHING':
            return { ...state, loading: true }
        case 'DONE_FETCHING':
            return { ...state, loading: false }
        case 'ERROR':
            return { ...state, loading: false, error: action.payload }
        default:
            return state
    }
}

const Login = () => {
    const navigate = useNavigate()
    const { isLoggedIn ,setCurrentUser ,setIsLoggedIn } = useContext(AuthData)
    useEffect(() => {
        isLoggedIn && navigate('/')
    },[isLoggedIn, navigate])
    const [{ error, loading }, dispatch] = useReducer(reducer,
        {
            loading: false,
            error: null
        })
    const [inputValues, setInputValues] = useState({
        email: '',
        password: ''
    })

    const handleChange = (e) => {
        setInputValues(prev => {
            return {
                ...prev,
                [e.target.name]: e.target.value
            }
        })
    }

    const [isOpen, setIsOpen] = useState(true)

    const handleSubmit = async () => {
        try {
            dispatch({ type: 'FETCHING' })
            const res = await fetch(`${loginLink}`, {
                method: 'POST',
                headers: {
                    'Content-Type':'application/json'
                },
                body: JSON.stringify(inputValues )
            })
            const data = await res.json()
            console.log(data);
            if (!data.status) {
                setIsOpen(true)
                return dispatch({ type: 'ERROR', payload: data.message })
            }
            setIsLoggedIn(true)
            setCurrentUser(data?.user)
            localStorage.setItem('access_token', data?.access_token)
            navigate('/')
        } catch (error) {
            dispatch({type:'ERROR', payload:error?.message})
        }
    }
    return (
        <Container
            sx={{
                display: 'grid',
                placeContent: 'center',
                height: '100dvh'
            }}
        >
            <Snackbar
                open={isOpen && error}
                message={error}
                autoHideDuration={7000}
                onClose={() => setIsOpen(false)}
            />

            <Box

                sx={{
                    width: '65dvw',
                    boxShadow: '0px 0px 30px rgb(0,0,0,0.07)',
                    padding: 2
                }}>
                <Box>
                    <Typography>
                        Sign in
                    </Typography>
                </Box>

                <Box
                    sx={{
                        marginTop: 2
                    }}
                >
                    <Box
                        sx={{
                            marginTop: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2
                        }}
                    >
                        <InputLabel htmlFor="email">Enter your email:</InputLabel>
                        <TextField
                            name='email'
                            variant='filled'
                            id='email'
                            value={inputValues.email}
                            label="email"
                            onChange={(e) => handleChange(e)}
                            fullWidth
                        />
                    </Box>
                    <Box
                        sx={{
                            marginTop: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2
                        }}
                    >
                        <InputLabel htmlFor="password">Enter your password:</InputLabel>
                        <TextField
                            value={inputValues.password}
                            name='password'
                            id='password'
                            label="password"
                            onChange={(e) => handleChange(e)}
                            fullWidth
                            variant='filled'
                        />
                    </Box>
                    <Box
                        sx={{
                            marginTop: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2
                        }}
                    >
                        {
                            loading ? (
                                <LoadingButton
                                    color='success'
                                    loadingPosition='left'
                                    loadingIndicator='checking info...'
                                    loading
                                    sx={{
                                        padding: 1
                                    }}
                                >

                                </LoadingButton>
                            ) : (

                                <Button
                                    variant='contained'
                                    color='info'
                                    onClick={() => handleSubmit()}
                                >
                                    Sign in
                                </Button>
                            )
                        }
                        <Typography>
                            Don&apos;t have an account yet?

                            <Link to='/signup'>
                                create one
                            </Link>
                        </Typography>
                    </Box>


                </Box>
            </Box>
        </Container>
    )
}

export default Login