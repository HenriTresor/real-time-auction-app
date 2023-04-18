import React, {useContext, useState, useEffect} from 'react'
import { Box, Paper, Container, Button } from '@mui/material'
import { AuctionData } from '../context/Auctions'
import { NotificationAddRounded, FlagCircleRounded} from '@mui/icons-material'
import { Link } from 'react-router-dom'
import Breadcrump from '../components/Breadcrump'
import Loading from '../components/Loading'

const AvailableAuctions = () => {

    useEffect(() => {
        document.title = 'auctions'
    },[])
    let { allAuctions, sellers, isLoading, setIsLoading } = useContext(AuctionData)


    if (isLoading) {
        return (
            <Container className='body'>
                <Loading />
            </Container>
        )
    }


  return (
      <Box className='body'>
          <Breadcrump>
              <Link to='/'>
                  Home
              </Link>
               <i> {'>'} </i>
              <Link to='#'> 
               auctions
              </Link>
          </Breadcrump>
          <h3>Available Auctions</h3>
          <Box className="underline"></Box>

          <Container>
    
              {
                  allAuctions?.length === 0 && (
                      <h3>no auctions found</h3>
                  )
              }
              {
                  allAuctions?.map(auction => {
                      return (
                          <Link to={(new Date(auction?._doc?.startDate) > new Date(Date.now())) || new Date(auction?._doc?.endDate) < new Date(Date.now()) ? '#' : `/auctions/auction/${auction?._doc?._id}`}>
                              <Paper
                                  elevation={5}
                                  key={auction?._doc?._id}
                                  className='paper auction'
                              >
                                  <Box>
                                      img
                                  </Box>
                                  <Box
                                      className='auction-details'
                                  >
                                      <h3>{auction?._doc?.itemName}</h3>
                                      <p>{auction?._doc?.description}</p>
                                      <i>Sold by  {`${auction?.seller?.lastName} ${auction?.seller?.firstName}`}
                                      </i>
                                      <p>start bid : { auction?._doc?.startBid}</p>
                                      <p>recent bids : {auction?._doc?.bids?.length}</p>
                                      <p><strong>starting</strong>  {new Date(auction?._doc?.startDate).toUTCString()}</p>
                                      <p><strong>ending</strong>  {new Date(auction?._doc?.endDate).toUTCString()}</p>

                                      <Box

                                      >
                                          {
                                              new Date(auction?._doc?.startDate) > new Date(Date.now()) ? (
                                                  <Box

                                                  >
                                                      <Button

                                                          startIcon={<FlagCircleRounded />}
                                                          disabled
                                                          variant='contained'>
                                                          place bid
                                                      </Button>

                                                      <Button
                                                          variant='contained'
                                                          startIcon={<NotificationAddRounded />}
                                                      >
                                                          notify me
                                                      </Button>
                                                  </Box>
                                              ) : (
                                                  <Box
                                                      sx={{

                                                          display: 'flex',
                                                          marginBottom: 2
                                                      }}
                                                  >

                                                      {
                                                          new Date(auction?._doc?.endDate) < new Date(Date.now()) ? (
                                                              <>
                                                                  <Button disabled variant='contained'>
                                                                      ended
                                                                  </Button>
                                                              </>
                                                          )
                                                              : (
                                                                  <Button
                                                                      startIcon={<FlagCircleRounded />}
                                                                      variant='contained'
                                                                      color='success'
                                                                  >
                                                                      place bid
                                                                  </Button>
                                                              )
                                                      }


                                                  </Box>
                                              )
                                          }
                                      </Box>
                                  </Box>
                              </Paper>
                          </Link>
                      )
                  })
              }
          </Container>
    </Box>
  )
}

export default AvailableAuctions