const User = require("../models/User.model");
const Auction = require("../models/auction.model");

const addAuction = async (req, res) => {
    try {

        let { itemName, description, seller, startBid, startDate, endDate, image } = req.body;
        if (!itemName || !description || !seller || !startDate || !endDate || !image) return res.status(400).json({ status: false, message: 'all fields marked as required must be provided' })

        let newAuction = new Auction({
            itemName,
            description,
            seller,
            startBid,
            image,
            startDate,
            endDate
        })


        await newAuction.save()
        return res.status(201).json({ status: true, message: 'new auction saved', auction: newAuction });
    } catch (err) {

        console.log('error creating new auction:', err.message);
        return res.status(500).json({ status: false, message: "server error" })
    }
}

const getSeller = async (sellerId) => {
    return await User.findById(sellerId).select('-password')
}

const getAllAuctions = async (req, res) => {
    try {

        let allAuctions = await Auction.find().sort({ createdAt: 1 })
        for (let i = 0; i < allAuctions.length; i++){
            let seller = await User.findById(allAuctions[i]?.seller);

            allAuctions[i] = {
                ...allAuctions[i],
                seller
            }
       }
        return res.status(200).json({ status: true, message: 'auctions found', auctions: allAuctions })
    } catch (err) {
        console.log('error getting all auctions', err.message);
        return res.status(500).json({ status: false, message: "server error" })
    }
}

const addBid = async (req, res) => {
    try {
        let { bidder, bid, time, itemId } = req.body
        if (!bidder || !bid || !itemId) return res.status(404).json({ status: false, message: 'bidder and item and bid must be provided' })

        let item = await Auction.findById(itemId)
        if (!item) return res.status(404).json({ status: false, message: "item was not found" })

        let lastBid = item?.bids[item?.bids?.length - 1]?.bid
        if (bid <= lastBid) return res.status(400).json({ status: false, message: 'the bid must be greater than the lastbid' })
        item?.bids?.push({ bidder, bid, time })
        await item.save()

        return res.status(201).json({ status: true, message: 'new bid added' });
    }
    catch (err) {
        console.log('error adding bid:', err.name, err.message);
        return res.status(500).json({ status: false, message: 'server error' })
    }
}


const getBidders = async (bidderId) => {
    return await User.findById(bidderId).select('-password')
}

const getAuction = async (req, res) => {
    try {

        let { id } = req.params

        if (!id) return res.status(404).json({ status: false, message: 'id is required' })

        let auction = await Auction.findById(id)
        for (let i = 0; i < auction?.bids.length; i++) {
            let bidder = await getBidders(auction?.bids[i]?.bidder);
            auction.bids[i] = { ...auction?.bids[i], bidder, bid: auction?.bids[i].bid}
        }

        let seller = await getSeller(auction?.seller)
        if (!auction) return res.status(404).json({ status: false, message: 'auction was not found' })
        return res.status(200).json({ status: true, message: 'auction was found', auction : { ...auction, seller : seller}})

    } catch (err) {

        console.log('error getting an auction', err.message);
        res.status(500).json({ status: false, message: 'server error' })
    }
}


const getBiddersBids = async (req, res) => {
    try {

        let { id } = req.params
        let user = await User.findById(id)
        if (!user) return res.status(404).json({ status: false, message: 'user not found' })

        let usersBids = await Auction.find({ bids: { bidder: user.id } })

        if (!usersBids) return res.status(404).json({ status: false, message: 'user has not bids' })
        return res.status(200).json({ status: true, message: 'bids found', usersBids })
    } catch (err) {
        console.log('error getting a person\'s bids', err.message);
        res.status(500).json({ status: false, message: 'server error' })
    }
}

module.exports = {
    addAuction,
    addBid,
    getAuction,
    getAllAuctions,
    getBiddersBids
}