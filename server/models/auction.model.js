const mongoose = require('mongoose')

const auctionShema = new mongoose.Schema({

    itemName: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    startBid: {
        type: Number,
        default: 0,
    },
    image: {
        type: Buffer,
        contetType: String,
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
    bids: [
        {
            bidder: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'users'
            },
            
            bid: Number,
            time: {
                type: Date,
                default: Date.now()
            }
        }
    ]
}, { timestamps: true })

const Auction = mongoose.model('auction', auctionShema);
module.exports = Auction