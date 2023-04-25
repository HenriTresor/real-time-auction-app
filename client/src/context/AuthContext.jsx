// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react'


export const AuthData = React.createContext({})
const AuthContext = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null)
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    const values = {
        currentUser,
        setCurrentUser,
        isLoggedIn,
        setIsLoggedIn
    }
    return (
        <AuthData.Provider value={values}>{children}</AuthData.Provider>
    )
}

export default AuthContext