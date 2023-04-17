import { Container, Box, TextField, FormLabel, Button, Alert } from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'
import { AuthData } from '../context/AuthProvider'
import { serverLink } from '../helpers/server'
import { AuctionData } from '../context/Auctions'
import { Link } from 'react-router-dom'
import Breadcrump from '../components/Breadcrump'

const NewAuction = () => {

    let { currentUser, token } = useContext(AuthData)
    let { allAuctions, setAllAuctions } = useContext(AuctionData)
    const [isErr, setIsErr] = useState(false)
    const [errMsg, setErrMsg] = useState(null)

    let [inputValues, setInputValues] = useState({
        itemName: '',
        description: '',
        startBid: '',
        image: '',
        startDate: '',
        endDate: '',
    })

    const handleFormChanges = (e) => {
        setInputValues(prev => {
            return { ...prev, [e.target.name]: e.target.value }
        })
    }

    const handleSubmit = async () => {

        if (new Date(inputValues.startDate) < new Date(Date.now()) || new Date(inputValues.endDate) < new Date(Date.now())) {
            setIsErr(true)
            setErrMsg('starting date and ending date must start from current date');
        }
        else {
            try {

                const res = await fetch(`${serverLink}/auctions`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ ...inputValues, seller: currentUser._id })
                })

                const data = await res.json()

                setIsErr(false)
                setErrMsg(data.message)
                if (!data.status) {
                    setIsErr(true)
                    setErrMsg(data.message)
                }
            } catch (err) {

            }
        }
    }

    return (
        <Container className='body'>

            <Breadcrump>
                <Link to='/'>
                    Home
                </Link>
                <i>{' > '}</i>
                <Link to='#'>
                   {'new auction'}
                </Link>
            </Breadcrump>
            <Box>
                <h3>Hey {currentUser?.lastName}, Add an auction</h3>

                <p>N.B : all fields are required</p>

                {
                    errMsg !== null && isErr ? (
                        <Alert severity='error'>
                            {errMsg}
                        </Alert>
                    ) : (
                        <Alert severity='success'>
                            {errMsg}
                        </Alert>
                    )
                }
            </Box>

            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Box
                    className='input-container'
                >
                    <FormLabel htmlFor='itemName'>Add item name</FormLabel>
                    <TextField
                        label="item name"
                        name='itemName'
                        onChange={(e) => handleFormChanges(e)}
                        id='itemName'
                    />
                </Box>
                <Box
                    className='input-container'
                >
                    <FormLabel htmlFor='description'>Add the item description</FormLabel>
                    <TextField
                        label="item description"
                        onChange={(e) => handleFormChanges(e)}
                        name='description'
                        id='description'
                    />
                </Box>
                <Box
                    className='input-container'
                >
                    <FormLabel htmlFor='startBid'>Add the starting Bid</FormLabel>
                    <TextField
                        onChange={(e) => handleFormChanges(e)}
                        label="item startBid"
                        name='startBid'
                        id='startBid'
                    />
                </Box>
                <Box
                    className='input-container'
                >
                    <FormLabel id='img-label' htmlFor='image'>Add the item image </FormLabel>
                    <input
                        id='image'
                        onChange={(e) => handleFormChanges(e)}
                        name='image'
                        type="file"
                        style={{
                            display: 'none'
                        }}
                    />
                </Box>
                <Box
                    className='input-container'
                >
                    <FormLabel htmlFor='start-date'>When is the starting date? (default: current date)</FormLabel>
                    <input
                        id='start-date'
                        onChange={(e) => handleFormChanges(e)}

                        name='startDate'
                        type="datetime-local"
                    />
                </Box>
                <Box
                    className='input-container'
                >
                    <FormLabel htmlFor='end-date'>When will bidding end date? (default: current date)</FormLabel>
                    <input
                        id='end-date'
                        onChange={(e) => handleFormChanges(e)}
                        name='endDate'
                        type="datetime-local"

                    />
                </Box>

                <Button
                    color='success'
                    variant='contained'
                    onClick={handleSubmit}
                >
                    add auction
                </Button>
            </Box>
        </Container >
    )
}

export default NewAuction