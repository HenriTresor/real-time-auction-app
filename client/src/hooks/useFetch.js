import React, { useEffect, useState } from 'react'
import axios from 'axios'

const useFetch = (link) => {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(true)
        axios.get(link).then(res => {
           setData(res?.data)
        }).then(() => {
            setLoading(false)
        })
    }, [])

    return {
        data,
        loading
    }
}

export default useFetch