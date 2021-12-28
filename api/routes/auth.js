const router = require("express").Router()
const User = require("../models/User")
const CryptoJS = require("crypto-js")
require("dotenv").config()
const jwt = require("jsonwebtoken")

const key = process.env.PASS_SK


//Register an user
router.post("/register", async (req, res) => {

  //We check if the email is already created
  const checkEmail = await User.find({$email: req.body.email})
  if (checkEmail) return res.status(400).send({message: "Email already exists", success: false})

  //If do not exist we proceed to create a new User
  const newUser = new User({
      username:req.body.username,
      email:req.body.email,
      password:CryptoJS.AES.encrypt(req.body.password, key).toString()
    })

  try{
    const savedUser = await newUser.save()
    console.log(savedUser)
    res.status(201).send({message: "User created", success: true})
  }catch(err){
    res.status(500).send({message:`Err: ${err}`, success: false})
  }
})


//Login an user

router.post("/login", async (req, res) => {
  try {
    //We got the user
    const user = await User.findOne({username: req.body.username})
    //Check if user exist
    if (!user) return res.status(404).json("Usuario no existe")

    //Check if password are same
    const hashedPassword = CryptoJS.AES.decrypt(user.password, key)
    const currentPassword = hashedPassword.toString(CryptoJS.enc.Utf8)
    
    //Return only insteredted things
    const {password, ...others } = user._doc

    //Making web token

    const accessToken = jwt.sign({
      id:user._id,
      isAdmin: user.isAdmin
    }, process.env.JWT_SK,
      {expiresIn:"7d"}
      )
    
    req.body.password === currentPassword
    ?  res.status(200).json({...others, accessToken})
    :  res.status(400).json("Contraseña incorrecta")
    
  }catch(err){
    res.status(500).json(err)
  }
})

module.exports = router