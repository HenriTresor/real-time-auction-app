import React, {createContext, useEffect, useState} from 'react'
import { serverLink } from '../helpers/server'


export const AuthData = createContext()

const AuthProvider = ({ children }) => {

    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [currentUser, setCurrentUser] = useState({})
    const [token, setToken] = useState(null)
    
    const values = {
        isLoggedIn,
        setIsLoggedIn,
        currentUser,
        setCurrentUser,
        token
    }

    const getUserProfile = async () => {
        try {
            const res = await fetch(`${serverLink}/users/me/profile`, {
                method: 'GET',
                headers: {
                    'authorization': `Bearer ${localStorage.getItem('access_token')}`
                }
            })

            const data = await res.json()
            if (data.status) {
                setIsLoggedIn(true)
                setCurrentUser(data.user)
            }
        } catch (err) {

        }
    }

    useEffect(() => {
        
        if (localStorage.getItem('access_token')) {
            getUserProfile()
            setToken(localStorage.getItem('access_token'))
        } else {
            setCurrentUser(null)
            setIsLoggedIn(false)
        }
    },[])
  return (
    <AuthData.Provider value={values}>{children}</AuthData.Provider >
  )
}

export default AuthProvider