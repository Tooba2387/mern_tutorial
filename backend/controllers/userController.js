const asyncHandler = require('express-async-handler')
const User = require('../model/userModel')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

// @desc Register Users
// @route Post /api/users
// @access Private
const registerUser = asyncHandler(async(req, res) => { 
    const {name, email, password} = req.body
    if (!name || !email || !password){
        res.status(400)
        throw new Error("please add details")
    }
    const userExists = await User.findOne({email})
    if (userExists){
        res.status(400)
        throw new Error ('User already EXists')
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash (password, salt)

    const user = await User.create({
        name, email, password: hashedPassword
    })

    if (user){
        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email, 
            token: generateToken(user.id)
        })
    }
    else {
        res.status(400)
        throw new Error('invalid user data')
    }
})


// @desc Authenticate User
// @route Post /api/users/login
// @access Private
const loginUser = asyncHandler(async(req, res) => { 
    const {email, password} = req.body
    if (!email || !password){
        res.status(400)
        throw new Error("please add details")
    }
    const user = await User.findOne({email})
    
    if(user && (bcrypt.compare(password, user.password))){
        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user.id)
        })
    }
    else{
        res.status(400)
        throw new Error ('invalid credentials ')
    }

})

// @desc get User data
// @route GET /api/users/me
// @access Private
const getMe = asyncHandler(async(req, res) => { 
    const {_id, name, email} =await User.findById(req.user.id)
    
    res.status(200).json({
        id: _id, 
        name, 
        email,
    })

    res.json ({message: 'user data'})
})

//generate token 
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, 
        {
            expiresIn: '30d',
        })
}

module.exports = {
    registerUser, 
    loginUser, 
    getMe,
}