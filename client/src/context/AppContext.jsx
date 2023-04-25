/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useRef } from 'react'

export const AppData = React.createContext({})
const AppContext = ({ children }) => {

    const socket = useRef()
    const [token, setToken] = useState(localStorage.getItem('access_token'))
    const [globalSnackBarMsg, setGlobalSnackBarMsg] = useState(null)
    
    const values = {
        globalSnackBarMsg,
        setGlobalSnackBarMsg,
        token,
        socket
    }
    return (
        <AppData.Provider value={values}>{children}</AppData.Provider>
    )
}

export default AppContext