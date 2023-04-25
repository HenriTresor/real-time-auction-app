import { Container, Box, Button, TextField, Typography, Snackbar } from '@mui/material'
import React, { useContext, useReducer, useState } from 'react'
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DateTimePicker } from '@mui/x-date-pickers';
import { LoadingButton } from '@mui/lab'
import { AuthData } from '../context/AuthContext';
import { auctionsLink } from '../utils/server.links';
import { AppData } from '../context/AppContext';

const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCHING':
            return { ...state, loading: true }
        case 'DONE_FETCHING':
            return { ...state, loading: false, message: action.payload }
        case 'ERROR':
            return { ...state, loading: false, error: action.payload }
    }
}
const NewAuction = () => {
    const { currentUser } = useContext(AuthData)
    const [isOpen, setIsOpen] = useState(false)
    const { setGlobalSnackBarMsg, socket } = useContext(AppData)
    const [{ loading, message, error }, dispatch] = useReducer(reducer, {
        loading: false,
        message: null,
        error: null
    })

    const [inputValues, setInputValues] = useState({
        itemName: '',
        itemDescription: '',
        startBid: 0,
        seller: currentUser?._id,
        endDate: '',
        startDate: ''
    })

    const [startDate, setStartDate] = useState(dayjs(Date.now()))
    const [endDate, setEndDate] = useState(dayjs(Date.now()))

    const handleChange = (e) => {
        console.log(inputValues);
        setInputValues(prev => {
            return {
                ...prev,
                [e.target?.name]: e.target?.value
            }
        })
    }
    const handleSubmit = async () => {
        try {
            dispatch({ type: 'FETCHING' })
            const res = await fetch(`${auctionsLink}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ ...inputValues, endDate: endDate, startDate: startDate })
            })

            const data = await res.json()
            socket.current.emit('add auction', {
                ...inputValues, endDate: endDate, startDate: startDate
            })
            setIsOpen(true)
            dispatch({ type: 'DONE_FETCHING', payload: data.message })
        } catch (err) {
            setIsOpen(true)
            dispatch({ type: 'ERROR', payload: err.message })
        }
    }
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Container
                sx={{
                    marginTop: 5,
                    display: 'grid',
                    placeContent: 'center'
                }}
            >
                <Snackbar
                    open={(error || message) && isOpen}
                    autoHideDuration={1000}
                    onClose={() => setIsOpen(false)}
                    message={error ? error : message ? message : null}
                />
                <Box
                    sx={{
                        width: '50dvw',
                        padding: 2,
                        border: '1px solid grey'
                    }}
                >
                    <Box>
                        <Typography
                            variant='h5'
                            component='h1'
                        >
                            Add new Auction
                        </Typography>

                        <Box
                            sx={{
                                marginTop: 5
                            }}
                        >
                            <Box
                                xs={{
                                    marginTop: 3
                                }}
                            >
                                <TextField
                                    label='enter the item name'
                                    onChange={(e) => handleChange(e)}
                                    name='itemName'
                                    fullWidth
                                />
                            </Box>
                            <Box
                                sx={{
                                    marginTop: 4
                                }}
                            >
                                <TextField
                                    label='enter the item description'
                                    name='itemDescription'
                                    multiline
                                    placeholder='this is a multline input...'
                                    fullWidth
                                    onChange={(e) => handleChange(e)}
                                />
                            </Box>
                            <Box
                                sx={{
                                    marginTop: 4
                                }}
                            >
                                <TextField
                                    label='what is the starting bid?'
                                    onChange={(e) => handleChange(e)}
                                    name='startBid'
                                    placeholder='default is 0'
                                    fullWidth
                                />
                            </Box>
                            <Box
                                sx={{
                                    marginTop: 3
                                }}
                            >
                                <DateTimePicker
                                    value={startDate}
                                    name='endDate'
                                    onChange={(e) => setStartDate(e)}
                                    label='when is the starting date?'
                                />
                            </Box>
                            <Box
                                sx={{
                                    marginTop: 3
                                }}
                            >
                                <DateTimePicker
                                    name='endDate'
                                    onChange={(e) => setEndDate(e)}
                                    value={endDate}
                                    label='when is the ending date?'
                                />
                            </Box>
                            <Box
                                sx={{
                                    marginTop: 3
                                }}
                            >
                                <Button
                                    onClick={() => handleSubmit()}
                                    variant='contained'
                                >
                                    add auction
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Container>
        </LocalizationProvider>
    )
}

export default NewAuction