const router = require("express").Router()
const { tokenVerify, authVerify } = require("../models/middlewares/tokenVerify")
const User = require("../models/User")


router.put("/:id", tokenVerify, async (req, res) => {
  if(req.body.password){
    req.body.password = CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SK).toString()
  }
  try{
    const updatedUser = await User.findByIdAndUpdate(req.params.id, {
      $set: req.body
    }, {new:true})
    res.status(200).json(updatedUser)
  }catch(err){
    res.status(500).json(err)
  }
})

/* Delete an user */

router.delete("/:id", tokenVerify, async (req, res) => {
  console.log("Deleting")
  const userId = req.params.id
  try{
    const user = await User.findByIdAndDelete({_id: userId})
    console.log(user)
    res.status(200).json("Se ha borrado el usuario")
  }catch(err){
    res.status(500).json(err)
  }
})

/* Get an user */
router.get("/:id", async (req, res) => {
  const userId = req.params.id
  try{
  const user = await User.findOne({_id : userId})
  res.status(200).json(user)
  }catch(err){
  res.status(500).json(err)
}
})

/* Get all users */
router.get("/", authVerify, async (req, res) => {
  const num = req.query.new
  try{
    const users = num 
    ? await User.find().sort({_id: -1}).limit(5)
    : await User.find()
    res.status(200).json(users)
  }catch(err){
    res.status(500).json(err)
  }
})

/* Get user stats */

router.get('/stats', authVerify, async (req,res) => {
  const date = new Date();
  const lastYear = new Date(date.setFullYear(date.getFullYear() - 1))
  try{
    const data = await User.aggregate([
      { $match: {createdAt: {$gte: lastYear } } },
      {
        $project: {
          month: { $month: "createdAt"}
        }
      },
      {
        $group: {
          _id: "$month",
          total: { $sum : 1}
        }
      }
    ])
    res.status(200).json(data)
  }catch(err){
    res.status(500).json(`${err}`)
  }
})

module.exports = router