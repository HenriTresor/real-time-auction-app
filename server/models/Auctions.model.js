import mongoose from 'mongoose'

const auctionSchema = new mongoose.Schema({
    itemName: { type: String, required: true },
    itemDescription: { type: String, required: true },
    itemImage: { type: String, },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    startBid: { type: Number, default: 0 },
    startDate: { type: Date, default: Date.now() },
    endDate: { type: Date, default: Date.now() },
    bids: [
        {
            bidder: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'users'
            },
            bid: {
                type: Number,
                required: true
            },
            time: Date
        }
    ],
    interests: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users'
        }
    ]
}, {
    timestamps: true
})

const Auction = mongoose.model('auctions', auctionSchema)
export default Auction