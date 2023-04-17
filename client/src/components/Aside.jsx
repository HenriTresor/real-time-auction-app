import React, {useContext} from 'react'
import { Box, Button } from '@mui/material'
import { AuthData } from '../context/AuthProvider'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { CloseRounded} from "@mui/icons-material"

const Aside = ({setIsAsideActive}) => {
    const navigate = useNavigate()
    let { currentUser, setIsLoggedIn, setCurrentUser} = useContext(AuthData)
  return (
      <Box
      className='aside-container'
      >
          <Box
              sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
          }}
          >
              <h2>Hey, {`${currentUser?.lastName}`} !</h2>
              <Button variant='contained'
              onClick={()=>setIsAsideActive(false)}
              >
                  <CloseRounded />
              </Button>
          </Box>
          
          <Box className="list-items">
              <Link to='/auctions'
              onClick={()=>setIsAsideActive(false)}
              >
                  <li>
                      Auctions
                  </li>
              </Link>

              <li>
                  My auctions
              </li>

              <li>
                  My bids
              </li>

              <Button
                  onClick={() => {
                      localStorage.clear()
                      setCurrentUser(null)
                      setIsLoggedIn(false)
                      location.assign('/login')
              }}
                  color='warning'
                  variant='contained'>
                  Logout
              </Button>
          </Box>
      </Box>
  )
}

export default Aside