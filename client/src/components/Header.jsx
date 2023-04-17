import React, {useContext} from 'react'
import {AppBar, Box, Button } from '@mui/material'
import {NotificationsActiveRounded, MessageRounded, Person} from '@mui/icons-material'
import { Menu } from '@mui/icons-material'
import { AuthData } from '../context/AuthProvider'

const Header = ({ setIsAsideActive, isAsideActive }) => {
    
    let { currentUser, isLoggedIn} = useContext(AuthData)
  return (
      <Box 
         
      className="header">
          
          <Box>
              {
                  isLoggedIn && <>
                      <Button
                          onClick={() => setIsAsideActive(!isAsideActive)}
                          variant='contained'>
                          <Menu />
                      </Button>
                  </>
            }
              <h3>Auct app</h3>
          </Box>

          <Box>
              <Button variant=''>
                  <NotificationsActiveRounded />
            </Button>
              <Button variant=''>
                  <MessageRounded />
              </Button>
              <Box>
                  {
                      isLoggedIn && <>
                          <Person />
                          <h3>{`${currentUser?.lastName} ${currentUser?.firstName}`}</h3>
                      </>
                 }
              </Box>
          </Box>
    </Box>
    
  )
}

export default Header