import express from 'express'
import http from 'http'
import morgan from 'morgan'
import { Server } from 'socket.io'
import cors from 'cors'
import { config } from 'dotenv'
import indexRoute from './routes/index.route.js'
import userRoute from './routes/User.route.js'
import authRoute from './routes/auth.route.js'
import auctionRoute from './routes/auction.route.js'

import { connection } from './configs/db.config.js'

config()
const PORT = process.env.PORT || 7000
const app = express()
const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: '*'
    }
})

const errorHandler = (err, req, res, next) => {
    if (err) {
        let status = err?.status
        let message = err?.message
        return res.status(status).json({ status: false, message })
    }
}

app.use(morgan('dev'))
app.use(cors())
app.use(express.json())

connection.then(() => {
    console.log('connected to db successfully');
}).then(() => {
    server.listen(PORT, () => {
        console.log(`server is live on ${PORT}`);
    })
}).catch((err) => {
    console.log(`error connecting to db ${err.message}`);
})


app.use('/users', userRoute)
app.use('/auth', authRoute)
app.use('/auctions', auctionRoute)
app.use('/', indexRoute)
app.use(errorHandler)

global.interests = []
io.on('connection', socket => {
    console.log(`socket ${socket.id} connected`);

    socket.on('add interest', interest => {
        global.interests.push({
            auctionId: interest.auction,
            userId: interest.userId
        })
    })

    socket.on('add auction', auction => {
        console.log(auction);
        let message = `a new auction '${auction?.itemName}' added, go check it out!`
        socket.emit(`auction added`, {message, auction})
    })

    socket.on('add bid', bid => {

    })
    socket.on('disconnect', () => {
        console.log(`${socket.id} disconnected`)
    })
})