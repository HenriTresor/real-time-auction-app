/* eslint-disable no-unused-vars */
import React from 'react'
import { Box, CircularProgress } from '@mui/material'

const Loading = () => {
    return (
        <Box
            sx={{
                width: '100%',
                position: 'fixed',
                height: '100%',
                display: 'grid',
                placeContent: 'center'
            }}
        >
            <CircularProgress

                color='inherit' />
        </Box>
    )
}

export default Loading