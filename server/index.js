// require modules
const express = require('express')
const cookieParser = require('cookie-parser')
const morgan = require('morgan')
const cors = require('cors')

//declare constants

const app = express()
const PORT = process.env.PORT || 8080

// decalare middlewares


app.use(cors())
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: false }))

// configure environment variables and morgan

if (process.env.NODE_ENV !== 'production') {

    require('dotenv').config()
    app.use(morgan('dev'))
}


// call mongodb connection function

require('./configs/db.config')

// require external routes

const userRoute = require('./routes/User.route')
const auctionRoute = require('./routes/auction.route')
const authRoute = require('./routes/auth.route')

// routes

const root = '/api/v1'
app.use(`/api/v1/users`, userRoute)
app.use(`${root}/auctions`, auctionRoute)
app.use(`${root}/auth`, authRoute)

app.all('*', (req, res) => {
    res.status(404).json({ status: false, message: 'invalid request' })
})

// listen for requests
const server = app.listen(PORT, () => {
    console.log(`server listening on port ${PORT}`);
})

const io = require('socket.io')(server, {
    cors: {
        origin: '*',
        credentials: true
    }
})

global.onlineUsers = new Map()

io.on('connection', socket => {
    console.log(`${socket.id} connected`);
  
    socket.on('add-user', userId => {
        onlineUsers.set(userId, socket.id)
    })
    socket.on('add-auction', auction => {
        socket.emit('auction-added', auction)
    })

    socket.on('add-bid', bid => {
        socket.emit('bid-added', bid)
    })
    socket.on("disconnect", () => console.log(`${socket.id} disconnected`))
})