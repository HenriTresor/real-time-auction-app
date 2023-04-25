// eslint-disable-next-line no-unused-vars
import React, { useContext, useEffect, useRef } from 'react'
import Header from './components/Header'
import { Routes, Route, useNavigate, useLocation, Link } from 'react-router-dom'
import { AuthData } from './context/AuthContext'
import Login from './pages/login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import { AppData } from './context/AppContext'
import {
  Snackbar,
  Button
} from '@mui/material'
import { ChevronLeftOutlined } from '@mui/icons-material'
import { rootLink } from './utils/server.links'
import AvailableAuctions from './pages/AvailableAuctions'
import NewAuction from './pages/NewAuction'
import SingleAuction from './pages/SingleAuction'
import { io } from 'socket.io-client'


const App = () => {
  const location = useLocation()
  const { isLoggedIn, currentUser, setCurrentUser, setIsLoggedIn } = useContext(AuthData)
  const { globalSnackBarMsg, setGlobalSnackBarMsg, token, socket } = useContext(AppData)
  const navigate = useNavigate()

  useEffect(() => {
    if (socket.current) {
      socket.current.on('auction added', msg => {
        console.log(msg);
        setGlobalSnackBarMsg(msg)
      })
    }
  },[socket.current])
  const getUser = async () => {

    try {
      const res = await fetch(`${rootLink}/users/me`, {
        headers: {
          'authorization':`Bearer ${token}`
        },
        method:'GET'
      })
      const data = await res.json()
      setCurrentUser(data?.user)
      setIsLoggedIn(true)
      setGlobalSnackBarMsg(data?.message)
    } catch (error) {
      setGlobalSnackBarMsg(error.message)
    }
  }


  useEffect(() => {
    if (localStorage.getItem('access_token')) {
      getUser()
    } else {
      navigate('/login')
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (isLoggedIn) {
      socket.current = io(`${rootLink}`)
    }
  },[isLoggedIn])
  return (
    <>
      <Snackbar
        open={globalSnackBarMsg ? true : false}
        message={globalSnackBarMsg}
        onClose={() => setGlobalSnackBarMsg(null)}
      />
      {isLoggedIn && <Header />}
      {isLoggedIn && location.pathname !== '/' && (
        <Button
          variant='contained'
          sx={{
            marginTop: 12
          }}
          startIcon={<ChevronLeftOutlined />}
          onClick={()=>navigate(-1)}
        >
          back
        </Button>
     )}
      <Routes>
        <Route exact />
        <Route exact path='/' element={<Dashboard />} />
        <Route exact path='/login' element={<Login />} />
        <Route exact path='/signup' element={<Signup />} />
        <Route exact path='/auctions/:id' element={<SingleAuction />} />
        <Route exact path='/auctions' element={<AvailableAuctions />} />
        <Route exact path='/add-auction' element={<NewAuction />} />
        <Route />
      </Routes>
    </>
  )
}

export default App