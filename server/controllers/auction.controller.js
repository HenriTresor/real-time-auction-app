import Auction from "../models/Auctions.model.js"
import User from "../models/user.model.js"
import { auctionValidObject } from "../validators/joiAuction.js"

export const getAllAuctions = async (req, res, next) => {
    try {
        let auctions = await Auction.find()
            .populate('seller')
            .populate({
                path: 'bids',
                populate: {
                    path: 'bidder',
                    model: 'users'
                }
            }).sort({ createdAt: -1 })

        res.status(200).json({ status: true, message: 'auctions found', auctions })
    } catch (error) {
        console.log(error.message)
        let err = new Error(error.message)
        err.status = 500
        next(err)
    }
}

export const createAuction = async (req, res, next) => {
    try {
        const { error, value } = auctionValidObject.validate(req.body)
        if (error) {
            let err = new Error(error.details[0].message)
            err.status = 400
            next(err)
            return
        }

        let newAuction = new Auction({
            itemName: value.itemName,
            itemDescription: value.itemDescription,
            itemImage: value?.itemImage,
            seller: value.seller,
            startBid: value.startBid,
            startDate: value.startDate,
            endDate: value.endDate
        })

        await newAuction.save()
        return res.status(201).json({ status: true, message: 'new auction saved!', auction: newAuction })
    } catch (error) {
        console.log(error.message)
        let err = new Error(error.message)
        err.status = 500
        next(err)
    }
}


export const getSingleAuction = async (req, res, next) => {
    try {
        let { id } = req.params
        let auction = await Auction.findById(id)
            .populate('seller')
            .populate({
                path: 'bids',
                populate: {
                    path: 'bidder',
                    model: 'users'
                }
            })
        if (!auction) {
            return res.status(404).json({ status: false, message: 'auction was not found' })
        }

        return res.status(200).json({ status: true, auction })
    } catch (error) {
        console.log(error.message)
        let err = new Error(error.message)
        err.status = 500
        next(err)
    }
}

export const placeBid = async (req, res, next) => {
    try {
        const { userId, auctionId, bid } = req.body
        console.log(req.body);
        if (!userId || !auctionId || !bid) {

            let err = new Error('user, auction and bid are all required')
            err.status = 400
            next(err)
            return
        }

        let user = await User.findById(userId)
        if (!user) {
            let err = new Error('user id not found')
            err.status = 400
            next(err)
            return
        }

        // check if auction exists

        let auction = await Auction.findById(auctionId)
        if (!auction) {

            let err = new Error('auction not found')
            err.status = 400
            next(err)
            return
        }

        // check if bid is higher than the last bid

        if (bid <= auction?.startBid || bid <= auction?.bids[auction?.bids?.length - 1]?.bid) {

            let err = new Error('bid must be greater the the last bid')
            err.status = 400
            next(err)
            return
        }

        await Auction.updateOne({ _id: auction?._id }, {
            $push: {
                bids: {
                    bidder: userId,
                    bid,
                    time: new Date(Date.now())
                }
            }
        })

        return res.status(201).json({ status: true, message: 'bid added!' })
    } catch (error) {
        console.log(error.message)
        let err = new Error(error.message)
        err.status = 500
        next(err)
    }
}

export const addInterest = async (req, res, next) => {
    try {
        let { auctionId, userId } = req.body
        if (!auctionId || !userId) {
            let err = new Error('auction id and user id are both required')
            err.status = 400
            next(err)
            return
        }

        let user = await User.findById(userId)
        if (!user) {
            let err = new Error('user id not found')
            err.status = 400
            next(err)
            return
        }

        // check if auction exists

        let auction = await Auction.findById(auctionId)
        if (!auction) {

            let err = new Error('auction not found')
            err.status = 400
            next(err)
            return
        }

        if (auction?.interests?.includes(user?._id)) {
            let err = new Error('interest already on')
            err.status = 400
            next(err)
            return
        }
        await Auction.updateOne({ _id: auction?._id }, {
            $push: {
                interests: user?._id
            }
        })


        return res.status(201).json({ status: false, message: 'interest added' })
    } catch (error) {
        console.log(error.message)
        let err = new Error(error.message)
        err.status = 500
        next(err)
    }
}