import React, { useContext, useEffect, useState } from 'react'
import { AuctionData } from '../context/Auctions'
import { useParams, Link } from 'react-router-dom'
import { Container, Box, Alert, Paper } from '@mui/material'
import { serverLink } from '../helpers/server'
import { AuthData } from '../context/AuthProvider'
import Breadcrump from '../components/Breadcrump'
import Loading from '../components/Loading'


const SingleAuction = () => {

    let { id } = useParams()
    let { sellers } = useContext(AuctionData)
    let [thisAuction, setThisAuction] = useState({});
    let [bids, setBids] = useState([])
    let [bid, setBid] = useState(0)
    let [isErr, setIsErr] = useState(false)
    let [errMsg, setErrMsg] = useState(null)
    let { currentUser, isLoggedIn } = useContext(AuthData)
    let [isLoading, setIsLoading] = useState(true)
    let [seller, setSeller] = useState({})
    let [notfound, setnotfound] = useState(false)

    useEffect(()=>{
        document.title = `${thisAuction?._doc?.itemName} sold by ${seller?.lastName}`
    },[thisAuction])
    const fetchAuction = async () => {
    try {

            setIsLoading(true)
            const res = await fetch(`${serverLink}/auctions/${id}`, {
                method: 'GET',
            })

            const data = await res.json()
            if (!data.status) {
                setnotfound(true)
            }
            setSeller(data?.auction?.seller)
            setIsLoading(false)
            setThisAuction(data?.auction);
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        fetchAuction()
    }, [])

    useEffect(() => {
        setBids(thisAuction?._doc?.bids)
    }, [thisAuction])

    const sendBidToserver = async (e) => {

        e.preventDefault()

        if (bid >= thisAuction?._doc?.startBid) {
            try {
                let body = {
                    bidder: currentUser?._id,
                    bid,
                    time: Date.now(),
                    itemId: thisAuction?._doc?._id
                }

                const res = await fetch(`${serverLink}/auctions/bid`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(body)
                })
                const data = await res.json()
                setErrMsg(data.message)
                if (!data.status) {
                    setIsErr(true)
                } else {
                    setIsErr(false)
                }
            } catch (err) {
                console.log(err);
            }
        } else {
            setIsErr(true)
            if (bids?.length === 0) return setErrMsg('enter bid from the starting bid')
            setErrMsg('Enter bid greater than the last bid')
        }
    }


    if (isLoading) {
        return (
            <Container className='body'>
                <Loading />
            </Container>
        )
    }


    if (notfound) {
        return (
            <Container className='body'>
                <h3>Auction not found</h3>
            </Container>
        )
    }
    return (
        <Container className='body'>
            <Breadcrump>
                <Link to='/'>
                    Home
                </Link>
                <i> {' > '} </i>
                <Link to='/auctions'>
                    auctions
                </Link>
                <i>{' > '}</i>
                <Link>
                    {thisAuction?._doc?.itemName} - {thisAuction?._doc?._id}
                </Link>
            </Breadcrump>
            <Box>
                <h1>{thisAuction?._doc?.itemName}</h1>
                <img src="" alt="item image" />
                <p><i>{thisAuction?._doc?.description}</i></p>
                <p><strong>starting on  </strong> {new Date(thisAuction?._doc?.startDate).toUTCString()}</p>
                <p><strong>ending on  </strong> {new Date(thisAuction?._doc?.endDate).toUTCString()}</p>
                <p>start bid : ${thisAuction?._doc?.startBid} </p>
                <p>
                    sold by {`${thisAuction?.seller?.lastName} ${thisAuction?.seller?.firstName}`}
                </p>
            </Box>

            <Box className='input-box'>
                <h3>Place your bid</h3>

                {
                    isErr && (
                        <Alert severity='error'>
                            {errMsg}
                        </Alert>
                    )
                }

                {
                    (errMsg !== null && !isErr) && (
                        <Alert severity='success'>
                            {errMsg}
                        </Alert>
                    )
                }
                {
                    seller?._id !== currentUser?._id ? (
                        <form action=""
                            onSubmit={(e) => sendBidToserver(e)}
                        >
                            <input
                                value={bid}
                                type='text'
                                onChange={(e) => setBid(e.target.value)}
                            />
                            <button
                            >place bid</button>
                        </form>
                    ) : (
                            <h3>sellers are not allowed to bid</h3>
                    )
             }
            </Box>
            <Box>
                <h4>Recent bids</h4>

                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column-reverse',
                    }}
                >
                    {
                        bids?.map(bid => {
                            return (
                                (
                                    <Paper
                                        className='paper'
                                        key={bid?.bid}>
                                        <h4>{`${bid?.bidder?.lastName} ${bid?.bidder?.firstName}`}</h4>
                                        <Box>
                                            <p><i>bidded</i> {bid?.bid} $</p>
                                        </Box>
                                    </Paper>
                                )
                            )
                        })
                    }
                </Box>
            </Box>
        </Container>
    )
}

export default SingleAuction