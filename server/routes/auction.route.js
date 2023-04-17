const express = require('express');
const { addAuction, addBid, getAllAuctions, getAuction, getBiddersBids } = require('../controllers/auction.controller');
const verifyToken = require('../middlewares/verifyJwt');

const router = express.Router();


router.post('/', verifyToken, addAuction);
router.get('/', getAllAuctions)
router.post('/bid', addBid);
router.get('/:id', getAuction);
router.get('/user/:id', getBiddersBids);

module.exports = router