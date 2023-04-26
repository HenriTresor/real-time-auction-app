import { Container, Card, Button, Typography, Box, Stack, Grid } from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'
import useFetch from '../hooks/useFetch'
import { auctionsLink } from '../utils/server.links'
import Loading from '../components/Loading'
import {
    NotificationAddRounded,
    FlagCircleRounded,
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { AppData } from '../context/AppContext'
import addNotification from 'react-push-notification'

const AvailableAuctions = () => {
    const navigate = useNavigate()
    const { data, loading } = useFetch(`${auctionsLink}`)
    const [auctions, setAuctions] = useState([])
    const { socket, setGlobalSnackBarMsg } = useContext(AppData)
    useEffect(() => {
        setAuctions(data?.auctions)
    }, [data])


    return (
        <Container
            sx={{
                marginTop: 2
            }}
        >
            <Typography>
                Explore available auctions
            </Typography>

            <Box
                sx={{
                    marginTop: 3
                }}
            >
                <Grid
                    container
                    spacing={1}
                >
                    {
                        loading && <Loading />
                    }
                    {
                        auctions?.map(auction => {
                            let startDate = auction?.startDate
                            let endDate = auction?.endDate
                            const options = { month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric' }
                            return (
                                <Grid
                                    item
                                    xs={6}
                                    key={auction?._id}
                                >
                                    <Card
                                        variant='outlined'
                                        sx={{
                                            padding: 5,
                                            marginTop: 2,
                                            display: 'grid',

                                        }}
                                    >
                                        <Box>
                                            <Typography>
                                                {auction?.itemName}
                                            </Typography>
                                        </Box>

                                        <Box>
                                            <Typography>
                                                {auction?.itemDescription.slice(0, 10)}...
                                            </Typography>
                                            <Typography
                                                variant='body2'
                                                sx={{
                                                    marginTop: 1,
                                                    fontStyle: 'italic'
                                                }}
                                            >
                                                sold by {`${auction?.seller?.last_name} ${auction?.seller?.first_name}`}
                                            </Typography>
                                            <Stack direction='column'
                                                spacing={2}
                                                sx={{
                                                    marginTop: 3
                                                }}
                                            >
                                                <Typography>
                                                    starting on {new Date(startDate).toLocaleDateString('en-US', options)}
                                                </Typography>
                                                <Typography>
                                                    ending on {new Date(endDate).toLocaleDateString('en-US', options)}
                                                </Typography>
                                            </Stack>
                                            <Typography
                                                variant='body1'
                                                sx={{
                                                    marginTop: 3
                                                }}
                                            >


                                                Start bid ${auction?.startBid}
                                            </Typography>

                                            <Typography
                                                variant='body1'
                                                sx={{
                                                    marginTop: 3
                                                }}
                                            >


                                                bids available {auction?.bids?.length}
                                            </Typography>

                                            <Box
                                                sx={{
                                                    padding: 2
                                                }}
                                            >
                                                {
                                                    new Date(startDate) > new Date(Date.now())
                                                        ? (
                                                            <Button
                                                                startIcon={<NotificationAddRounded />}
                                                            >
                                                                notify me
                                                            </Button>
                                                        )
                                                        : new Date(endDate) < new Date(Date.now())
                                                            ? (
                                                                <h1>ended</h1>
                                                            ) : (
                                                                <Button
                                                                    onClick={() => navigate(`/auctions/${auction?._id}`)}
                                                                    startIcon={<FlagCircleRounded />}
                                                                    variant='contained'
                                                                    color='success'
                                                                >
                                                                    place bid
                                                                </Button>
                                                            )
                                                }
                                            </Box>
                                        </Box>
                                    </Card>
                                </Grid>
                            )
                        })
                    }
                </Grid>
            </Box>
        </Container>
    )
}

export default AvailableAuctions