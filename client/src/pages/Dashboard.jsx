import React, { useContext, useEffect } from 'react'
import { Container, Box, Paper } from '@mui/material'
import { ChevronRight } from '@mui/icons-material'
import { Link, useNavigate } from 'react-router-dom'
import { AuthData } from '../context/AuthProvider'
import Breadcrump from '../components/Breadcrump'

const Dashboard = () => {
    const navigate = useNavigate()
    let { isLoggedIn, currentUser } = useContext(AuthData)
    return (
        <Container
            className='body'
        >
            {
                isLoggedIn ? (
                    <>
                        <Breadcrump>
                            <Link to='#'>
                            Home
                            </Link>
                        </Breadcrump>
                        <h2>Hello {`${currentUser?.lastName} ${currentUser?.firstName}`}, welcome again!</h2>

                        <Box>
                            <h3>Choose Below to continue ...</h3>

                            <Box className='container'>
                                <Link to='auctions'>
                                    <Paper
                                        className='paper'
                                        sx={{
                                            padding: 1
                                        }}
                                        elevation={4}>

                                        <h4>Explore available auctions</h4>

                                        <ChevronRight />
                                    </Paper></Link>
                                <Link to='/new-auction'>
                                    <Paper
                                        className='paper'
                                        sx={{
                                            padding: 1
                                        }}
                                        elevation={4}>
                                        <h4>Add a new auction</h4>

                                        <ChevronRight />
                                    </Paper>
                                </Link>
                                <Paper
                                    className='paper'
                                    sx={{
                                        padding: 1
                                    }}
                                    elevation={4}>
                                    <h4>view your auctions</h4>

                                    <ChevronRight />
                                </Paper>
                                <Paper
                                    className='paper'
                                    sx={{
                                        padding: 1
                                    }}
                                    elevation={4}>
                                    <h4>view your recent biddings</h4>

                                    <ChevronRight />
                                </Paper>
                                <Paper
                                    className='paper'
                                    sx={{
                                        padding: 1
                                    }}
                                    elevation={4}>
                                    <h4>view your profile</h4>

                                    <ChevronRight />
                                </Paper>
                            </Box>
                        </Box>
                    </>
                )  : navigate('/login')
           }
        </Container>
    )
}

export default Dashboard