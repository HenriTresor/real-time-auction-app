import { Container, Card, TextField, Button, Typography, List, ListItem, ListItemAvatar, ListItemText, Box, Stack, Avatar } from '@mui/material'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import useFetch from '../hooks/useFetch'
import { auctionsLink, rootLink } from '../utils/server.links'
import Loading from '../components/Loading'
import { LoadingButton } from '@mui/lab'
import {
    FlagCircleRounded
} from '@mui/icons-material'
import { AppData } from '../context/AppContext'
import { AuthData } from '../context/AuthContext'

const options = { month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric' }

const SingleAuction = () => {
    let { id } = useParams()
    const inputRef = useRef(null)
    let { data, loading } = useFetch(`${rootLink}/auctions/${id}`)
    const [auction, setAuction] = useState({})
    const { setGlobalSnackBarMsg, socket } = useContext(AppData)
    const { currentUser } = useContext(AuthData)

    const [bids, setBids] = useState(auction?.bids)
    useEffect(() => {
        setBids(auction?.bids)
    }, [auction?.bids])
    useEffect(() => {
        setAuction(data?.auction)
    }, [data])

    const placeBid = async () => {
        try {
            setGlobalSnackBarMsg('placing your bid...')
            const res = await fetch(`${auctionsLink}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userId: currentUser?._id, auctionId: auction?._id, bid: inputRef.current.value })
            })
            const data = await res.json()
            if (data.status) {
                socket.current.emit('add bid', { userId: currentUser?._id, auctionId: auction?._id, bid: inputRef.current.value })
            }
            setGlobalSnackBarMsg(data?.message)
            if (data.status) {
                setBids(prev => {
                    return [
                        ...prev,
                        {
                            bidder: currentUser,
                            time: new Date(Date.now()),
                            bid: inputRef.current.value
                        }
                    ]
                })
            }
        } catch (error) {
            setGlobalSnackBarMsg(error.message)
        }
    }
    return (
        <Container
            sx={{
                marginTop: 3
            }}
        >

            {
                loading ? <Loading />
                    : (
                        <>
                            <Card
                                elevation={4}
                                variant='outlined'
                                sx={{
                                    padding: 2,
                                    textAlign: 'center'
                                }}
                            >
                                <Typography
                                    variant='h3'
                                >
                                    {auction?.itemName}
                                </Typography>

                                <Typography
                                    variant='body1'
                                    sx={{
                                        marginTop: 3,
                                        fontStyle: 'italic'
                                    }}
                                >
                                    sold by {`${auction?.seller?.last_name} ${auction?.seller?.first_name}`}
                                </Typography>
                                <Typography
                                    variant='body1'
                                    sx={{
                                        marginTop: 3,
                                        fontStyle: 'italic'
                                    }}
                                >
                                    start bid {`$${auction?.startBid}`}
                                </Typography>

                                <Typography
                                    variant='h6'
                                    sx={{
                                        marginTop: 4
                                    }}
                                >
                                    {auction?.itemDescription}
                                </Typography>
                                <Stack direction='column'
                                    spacing={2}
                                    sx={{
                                        marginTop: 3
                                    }}
                                >
                                    <Typography>
                                        starting on {new Date(auction?.startDate).toLocaleDateString('en-US', options)}
                                    </Typography>
                                    <Typography>
                                        ending on {new Date(auction?.endDate).toLocaleDateString('en-US', options)}
                                    </Typography>
                                </Stack>

                                <Typography
                                    variant='h6'
                                    sx={{
                                        marginTop: 3
                                    }}
                                >
                                    available bids: {auction?.bids?.length}
                                </Typography>
                            </Card>

                            <Card
                                sx={{
                                    marginTop: 3,
                                    padding: 3,
                                    textAlign: 'center'
                                }}
                            >
                                <Box>
                                    <Typography
                                        variant='h5'
                                    >
                                        Place your bid
                                    </Typography>
                                    <Box
                                        sx={{
                                            marginTop: 3
                                        }}
                                    >
                                        <TextField
                                            fullWidth
                                            inputRef={inputRef}
                                            label='enter your bid'
                                            type='number'
                                            min={auction?.bids?.length > 0 ? auction?.bids[auction?.bids?.length - 1]?.bid : auction?.startBid}
                                        />

                                        <Button
                                            onClick={placeBid}
                                            startIcon={<FlagCircleRounded />}
                                            variant='contained'
                                            color='success'
                                            sx={{
                                                marginTop: 3
                                            }}
                                        >
                                            place bid
                                        </Button>
                                    </Box>
                                </Box>
                            </Card>

                            <Card
                                sx={{
                                    padding: 3,
                                    marginTop: 3,
                                    textAlign: 'center'

                                }}
                                variant='outlined'
                            >
                                <Typography
                                    variant='h6'
                                >
                                    Recent bids
                                </Typography>

                                <Box
                                    sx={{
                                        marginTop: 3
                                    }}
                                >
                                    <List
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'column-reverse',

                                        }}
                                    >
                                        {
                                            bids?.map(bid => {
                                                return (
                                                    <ListItem
                                                        key={bid?.time}
                                                    >
                                                        <ListItemAvatar>
                                                            <Avatar />
                                                        </ListItemAvatar>
                                                        <ListItemText>
                                                            {`${bid?.bidder?.last_name} ${bid?.bidder?.first_name}`}
                                                        </ListItemText>
                                                        <ListItemText>
                                                            bidded {bid?.bid}
                                                        </ListItemText>
                                                        <ListItemText>
                                                            on {new Date(bid?.time).toDateString()}
                                                        </ListItemText>

                                                    </ListItem>
                                                )
                                            })
                                        }
                                    </List>
                                </Box>
                            </Card>
                        </>
                    )
            }
        </Container>
    )
}

export default SingleAuction