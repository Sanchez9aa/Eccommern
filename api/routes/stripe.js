const router = require("express").Router()
const stripe = require("stripe")(process.env.STRIPE_KEY)

router.post("/payment", (req, res) =>{
    stripe.charges.create({
        source: req.body.tokenId,
        amount: req.body.amount,
        currency: "usd"
    }, (stripeErr, stripeRes ) => {
        if(stripeErr) return res.status(500).send({message: `${stripeErr}`, success:false})
        else return res.status(200).send({stripeRes, success:false})
    })
})

module.exports = router