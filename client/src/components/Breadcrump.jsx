import { Container } from '@mui/material'
import React from 'react'

const Breadcrump = ({children}) => {
  return (
      <Container
          sx={{
          padding:3
      }}
      >{children}</Container>
  )
}

export default Breadcrump