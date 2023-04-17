import React, {useEffect, useRef, useState} from 'react'
import { io } from 'socket.io-client'


export const AppContext = React.createContext()


const AppProvider = ({children}) => {

    const [isAlertOn, setIsAlertOn] = useState(false)
    const [addedAuction, setAddedAuction] = useState('')
    let socket = useRef(null);

    useEffect(() => {
        
        if (localStorage.getItem('access_token')) {
            socket.current = io('http://localhost:8080');
        }
    }, [])


    
    const values = {
        socket,
        isAlertOn,
        addedAuction
    }
  return (
    <AppContext.Provider value={values}>{children}</AppContext.Provider>
  )
}

export default AppProvider