// eslint-disable-next-line no-unused-vars
import React, { useContext, useEffect, lazy, Suspense } from 'react'
import Header from './components/Header'
import { Routes, Route, useNavigate, useLocation, Link } from 'react-router-dom'
import { AuthData } from './context/AuthContext'
import { AppData } from './context/AppContext'
import {
  Snackbar,
  Button
} from '@mui/material'
import { ChevronLeftOutlined } from '@mui/icons-material'
import { rootLink } from './utils/server.links'
import { io } from 'socket.io-client'
import addNotification from 'react-push-notification'
import Loading from './components/Loading'


const Login = lazy(() => import('./pages/Login'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const SingleAuction = lazy(() => import('./pages/SingleAuction'))
const NewAuction = lazy(() => import('./pages/NewAuction'))
const AvailableAuctions = lazy(() => import('./pages/AvailableAuctions'))
const Signup = lazy(() => import('./pages/Signup'))
const App = () => {
  const location = useLocation()
  const { isLoggedIn, currentUser, setCurrentUser, setIsLoggedIn } = useContext(AuthData)
  const { globalSnackBarMsg, setGlobalSnackBarMsg, token, socket } = useContext(AppData)
  const navigate = useNavigate()

  const getUser = async () => {

    try {
      const res = await fetch(`${rootLink}/users/me`, {
        headers: {
          'authorization': `Bearer ${token}`
        },
        method: 'GET'
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
  }, [isLoggedIn])


  useEffect(() => {
    if (socket.current) {
      socket.current.on('auction added', res => {
        setGlobalSnackBarMsg(res.msg)
        console.log(res.auction);
        addNotification({
          title: 'new auction - Bidify',
          message: res.message,
          duration: 5000,
          native: true,
          icon: '',
          onClick: function () {
            navigate(`/auctions/${res?.auction?.auction?._id}`)
          }
          
        })
      })
  }
},[socket.current])
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
          onClick={() => navigate(-1)}
        >
          back
        </Button>

      )}
      <Suspense
      fallback={<Loading />}
      >
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
     </Suspense>
    </>
  )
}

export default App