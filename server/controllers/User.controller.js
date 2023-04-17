const createToken = require("../helpers/createToken");
const User = require("../models/User.model");

// add a new user

const addUser = async (req, res) => {
    try {
        let { firstName, lastName, email, password, about, role } = req.body
        console.log(req.body);

        // check if all required fields are present
        if (!firstName || !lastName || !email || !password) return res.status(400).json({ status: false, message: "firstname or lastname or email or password is missing" });

        // check if user already exists

        let user = await User.findOne({ email })
        if (user) return res.status(409).json({ status: false, message: "user already exists" });

        // save the new user
        let newUser = new User({
            email,
            firstName,
            lastName,
            about,
            password,
            role
        })

        await newUser.save()

        delete newUser.password

        let token = createToken(newUser._id)
        return res.status(200).json(
            {
                status: true,
                message: `${email} has been added`,
                access_token: token
            }
        )
    } catch (err) {
        console.log(`error creating user ${err.message}`);
        return res.status(500).json({ status: false, message: 'server error ' })
    }
}

// get all users

const getUsers = async (req, res) => {
    try {

        let users = await User.find().select('-password')
        res.status(200).json({ staus: true, message: "users found", users })
    } catch (err) {
        console.log(`error getting users ${err.message}`);
        return res.status(500).json({ status: false, message: 'server error ' })
    }
}

// get a specific user

const getUser = async (req, res) => {
    try {

        let { id } = req.params
        if (!id) return res.status(400).json({ status: false, message: 'id is required' })
        
        let user = await User.findById(id).select('-password')
        if (!user) return res.status(400).json({ status: false, message: 'user was not found' })
        res.status(200).json({status: true, message:'user was found', user})
     } catch (err) {
        console.log(`error getting user ${err.message}`);
        return res.status(500).json({ status: false, message: 'server error ' })
    }
}

// get profile

const getProfile = async (req, res) => {
    try {

        return res.status(200).json({ status: true, message: 'profile found', user: req.user })
    } catch (err) {
        console.log('error getting profile', err.message);
        res.status(500).json({ status: false, message: 'server error ' })
    }
}

// delete a user


const deleteUser = async (req, res) => {
    try {

        let { id } = req.params
        if (!id) return res.status(400).json({ status: 'false', message: "id is required" })

        let user = await User.findById(id).select('-password')
        if (!user) return res.status(404).json({ status: false, message: 'user not found' })

        await User.deleteOne({ email: user.email })

        res.status(200).json({ status: true, message: 'user deleted successfully' })
    } catch (err) {
        console.log(`error deleting user ${err.message}`);
        return res.status(500).json({ status: false, message: 'server error ' })
    }
}

// update a user

const updateUser = async (req, res) => {
    try {
        let updateData = { ...req.body }

        let { id } = req.params
        if (!id) return res.status(400).json({ status: 'false', message: "id is required" })

        let user = await User.findByIdAndUpdate(id, { $set: { ...updateData } })
        return res.status(200).json({ status: true, message: 'user updated successfully' })
    } catch (err) {
        console.log(`error updating user ${err.message}`);
        return res.status(500).json({ status: false, message: 'server error ' })
    }
}


module.exports = { addUser, updateUser, deleteUser, getUser, getUsers, getProfile };