import { Container, Box } from '@mui/material'
import React, { useContext, useState, useEffect, useReducer } from 'react'
import { AuthData } from '../context/AuthProvider'
import { useParams } from 'react-router-dom'
import { serverLink } from '../helpers/server'
import Loading from '../components/Loading'

const reducer = (state, action) => {
  switch (action.type) {
    case 'IS_FETCHING':
      return { ...state, loading: true }
    case 'FETCHED':
      return { ...state, loading: false, thisUser: action.payload }
    case 'USER_AUCTIONS_FETCHED':
      return { ...state, loading: false, auctions: action.payload }
    case 'IS_ERROR':
      return { ...state, error: action.payload }
  }
}
const Profile = () => {
  let { userId } = useParams()
  let { currentUser, isLoggedIn } = useContext(AuthData)

  let [{ loading, error, thisUser }, dispatch] = useReducer(reducer, {
    thisUser: {},
    loading: true,
    error: false
  })

  const fetchUser = async () => {
    try {
      dispatch({ type: 'IS_FETCHING' })
      const res = await fetch(`${serverLink}/users/${userId}`, {
        method: 'GET',
      })

      const data = await res.json()
      dispatch({ type: 'FETCHED', payload: data.user })
    } catch (err) {
      dispatch({ type: 'IS_ERROR', payload: err.message })
    }
  }

  const fetchUserAuctions = async () => {
    try {
      dispatch({ type: 'IS_FETCHING' })
      const res = await fetch(`${serverLink}/auctions/user/auct/${id}`, {
        method:'GET'
      })

      const data = await res.json()
      console.log(data);
      dispatch({type:'USER_AUCTIONS_FETCHED', payload: data.auctions})
    } catch (err) {
      
    }
  }
  useEffect(async () => {
     fetchUser()
    fetchUserAuctions()

  }, [])
  return (
    <Container className='body'>
      {
        loading ? <Loading /> : (
          <>
            <h1>{thisUser?.lastName} {thisUser?.firstName}</h1>
            <h5>{thisUser?.email}</h5>
            <p>Bio : {thisUser?.about}</p>
            <p>Joined : {new Date(thisUser?.createdAt).toLocaleDateString()}</p>
            <p>  initial role : {thisUser?.role}</p>
          </>
        )
      }
      <Box>
        <h1>User's Auctions</h1>

        {
          loading ? <Loading /> : (
            <h1></h1>
          )
        }
      </Box>
    </Container >
  )
}

export default Profile