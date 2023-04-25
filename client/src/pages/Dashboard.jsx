/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import { AuthData } from '../context/AuthContext'
import {
    Container,
    Paper,
    Button,
    Typography,
    Box
} from '@mui/material'
import { Link } from 'react-router-dom'
import Loading from '../components/Loading'
import { ChevronRightRounded } from '@mui/icons-material'

const Dashboard = () => {
    const { currentUser } = React.useContext(AuthData)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (currentUser) setLoading(false)
    }, [currentUser])
    return (
        <Container
            sx={{
                marginTop: 0
            }}
        >
            {
                loading ? <Loading /> : (
                    <>
                        <Typography
                            variant='h5'
                        >
                            Hey, {currentUser?.last_name} 👌
                        </Typography>
                        <Typography>
                            Check out ...
                        </Typography>

                        <Box
                            sx={{
                                marginTop: 5
                            }}
                        >
                            <Link
                            to='/auctions'
                            >
                                <Paper
                                    elevation={4}
                                    sx={{
                                        padding: 4,
                                        cursor: 'pointer',
                                        marginTop: 3,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-evenly'
                                    }}
                                >
                                    <Typography>
                                        explore available auctions
                                    </Typography>
                                    <ChevronRightRounded />
                                </Paper>
                            </Link>
                            <Link
                            to='/add-auction'
                            >
                                <Paper
                                    elevation={4}
                                    sx={{
                                        padding: 4,
                                        marginTop: 3,
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-evenly'
                                    }}
                                >
                                    <Typography>
                                        add new auction
                                    </Typography>
                                    <ChevronRightRounded />
                                </Paper>
                            </Link>
                            <Paper
                                elevation={4}
                                sx={{
                                    padding: 4,
                                    marginTop:3,
                                    cursor:'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-evenly'
                                }}
                            >
                                <Typography>
                                  view your profile
                                </Typography>
                                <ChevronRightRounded />
                            </Paper>
                            <Paper
                                elevation={4}
                                sx={{
                                    padding: 4,
                                    marginTop:3,
                                    cursor:'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-evenly'
                                }}
                            >
                                <Typography>
                                  view your recent biddings
                                </Typography>
                                <ChevronRightRounded />
                            </Paper>
                        </Box>
                    </>
                )
            }
        </Container>
    )
}

export default Dashboard