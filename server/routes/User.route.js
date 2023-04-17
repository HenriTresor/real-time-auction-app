const { addUser, getUser, getUsers, deleteUser, updateUser, getProfile } = require("../controllers/User.controller");
const express = require('express');
const verifyToken = require("../middlewares/verifyJwt");
const router = express.Router()

router.post('/', addUser)
router.get('/', getUsers)
router.get('/me/profile', verifyToken, getProfile)
router.get('/:id', getUser)
router.delete('/:id', deleteUser)
router.patch('/:id', updateUser)

module.exports = router

