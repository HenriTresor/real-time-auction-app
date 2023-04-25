import {
    Container,
    Box,
    Typography,
    Button,
    InputLabel,
    TextField,
    Grid,
    Snackbar
} from '@mui/material'
import  { useContext, useEffect, useReducer, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { LoadingButton } from '@mui/lab'
import { usersLink } from '../utils/server.links'
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
const Signup = () => {
    const navigate = useNavigate()
    const { setCurrentUser, setIsLoggedIn, isLoggedIn } = useContext(AuthData)
    useEffect(() => { 
        isLoggedIn && navigate('/')
    }, [isLoggedIn, navigate])  
    const [{ error, loading }, dispatch] = useReducer(reducer,
        {
            loading: false,
            error: null
        })
    const [inputValues, setInputValues] = useState({
        email:'',
        first_name: '',
        last_name: '',
        password:''
    })
    const [isOpen, setIsOpen] = useState(true)

    const handleChange = (e) => {
        setInputValues(prev => {
            return {
                ...prev,
                [e.target.name]: e.target.value
            }
        })
    }

    const handleSubmit = async () => {
        try {
            dispatch({ type: 'FETCHING' })
            const res = await fetch(`${usersLink}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(inputValues)
            })
            const data = await res.json()
            console.log(data);
            if (!data.status) {
                setIsOpen(true)
                return dispatch({ type: 'ERROR', payload: data.message })
            }
            setCurrentUser(data?.user)
            setIsLoggedIn(true)
            localStorage.setItem('access_token', data?.access_token)
            navigate('/')
        } catch (error) {
            dispatch({ type: 'ERROR', payload: error?.message })
        }
    }
    return (
        <Container
            sx={{
                display: 'grid',
                placeContent: 'center',
                height: '100dvh'
            }}
        >  <Snackbar
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
                        Create account
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
                    <Grid
                        container
                        spacing={3}
                    >
                        <Grid
                            item
                            xs={6}
                        >
                            <Box
                                sx={{
                                    marginTop: 2,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 2
                                }}
                            >
                                <InputLabel htmlFor="first_name">Enter your first_name:</InputLabel>
                                <TextField
                                    name='first_name'
                                    variant='filled'
                                    onChange={(e) => handleChange(e)}
                                    id='first_name'
                                    label="first_name"
                                    value={inputValues.first_name}
                                    fullWidth
                                />
                            </Box>
                        </Grid>
                        <Grid
                            item
                            xs={6}
                        >
                            <Box
                                sx={{
                                    marginTop: 2,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 2
                                }}
                            >
                                <InputLabel htmlFor="last_name">Enter your last_name:</InputLabel>
                                <TextField
                                    onChange={(e) => handleChange(e)}
                                    name='last_name'
                                    variant='filled'
                                    id='last_name'
                                    value={inputValues.last_name}
                                    label="last_name"
                                    fullWidth
                                />
                            </Box>
                        </Grid>
                    </Grid>
                    <Box
                        sx={{
                            marginTop: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2
                        }}
                    >
                        <InputLabel htmlFor="password">create your password:</InputLabel>
                        <TextField
                            name='password'
                            onChange={(e) => handleChange(e)}
                            id='password'
                            label="password"
                            value={inputValues.password}
                            fullWidth
                            type='password'
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
                                loading
                                >
                                
                            </LoadingButton>
                            ): (
                                <Button
                        onClick = { handleSubmit }
                            variant = 'contained'
                            color = 'info'
                                >
                            create account
                        </Button>
                            )
                       }
                        <Typography>
                            already have an account?

                            <Link to='/login'>
                                login
                            </Link>
                        </Typography>
                    </Box>


                </Box>
            </Box>
        </Container>
    )
}

export default Signup