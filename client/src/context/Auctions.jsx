import React, {useState, createContext, useEffect} from 'react'
import { serverLink } from '../helpers/server'

export const AuctionData = createContext()

const AuctionContext = ({ children }) => {
    
    let [allAuctions, setAllAuctions] = useState([])
    let [sellers, setSellers] = useState([])
    let [isLoading, setIsLoading] = useState(true)

    const fetchAllAuctions = async () => {
        try {
            
            const res = await fetch(`${serverLink}/auctions`, {
                method:'GET'
            })

            const data = await res.json()
            console.log(data);
            if (data.status) {
                setAllAuctions(data?.auctions)
                setIsLoading(false)
            }
        } catch (err) {
            
            console.log(err);
        }
    }


    const fetchAllSellers = async () => {
        try {
            allAuctions?.forEach(async auction => {
                const res = await fetch(`${serverLink}/users/${auction?.seller}`, {
                    method:'GET'
                })

                const data = await res.json()
                setSellers(prev => [...prev, data?.user])
            })
        } catch (err) {
            console.log(err);
        }
    }
    useEffect(() => {
    
        fetchAllAuctions();
    }, [])

    useEffect(() => {
        fetchAllSellers();
    },[allAuctions])
    
    let values = {
        allAuctions,
        sellers,
        isLoading,
        setIsLoading
    }
  return (
      <AuctionData.Provider value={values}>
          {children}
      </AuctionData.Provider>
  )
}

export default AuctionContext