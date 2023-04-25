// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react'
import {
    AppBar,
    Container,
    Menu,
    Typography,
    Box,
    Avatar,
    MenuItem,
    IconButton
} from '@mui/material'
import { AuthData } from '../context/AuthContext'

import {
    Menu as MenuIcon,
    MenuOpen
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'


const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const { currentUser, setCurrentUser, setIsLoggedIn } = React.useContext(AuthData)
    const navigate = useNavigate()
    return (
        <AppBar
            position='fixed'
            sx={{
                padding: 1
            }}

        >
            <Container
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}
            >
                <IconButton
                    color='inherit'
                    size='large'
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    {!isMenuOpen ? <MenuIcon /> : <MenuOpen />}
                </IconButton>
                <Menu
                    sx={{
                        position: 'fixed',
                        top: '-27em',
                        left: 0
                    }}
                    open={isMenuOpen}
                    keepMounted
                    onClose={() => setIsMenuOpen(false)}
                >
                    <MenuItem>
                        Home
                    </MenuItem>
                    <MenuItem>
                        Auctions
                    </MenuItem>
                    <MenuItem>
                        Profile
                    </MenuItem>
                    <MenuItem
                        onClick={() => {
                            setIsLoggedIn(false)
                            setCurrentUser(null)
                            localStorage.removeItem('access_token')
                            location.assign('/login')
                        }}
                    >
                        Logout
                    </MenuItem>
                </Menu>
                <Box>
                    <Typography
                        variant='h4'
                        component='h1'
                    >
                        Bidify
                    </Typography>
                </Box>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1,
                        placeContent: 'center',
                        alignItems: 'center'
                    }}
                >
                    <Avatar />
                    <Typography>
                        {`${currentUser?.last_name} ${currentUser?.first_name}`}
                    </Typography>
                </Box>
            </Container>
        </AppBar>
    )
}

export default Header