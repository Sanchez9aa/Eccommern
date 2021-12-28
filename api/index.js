const express = require("express")
const cors = require("cors")
const morgan = require("morgan")
require("dotenv").config()

//Getting Db connection
const DbConnect = require("./connect")

//Getting routes
const userRouter = require("./routes/user")
const authRouter = require("./routes/auth")
const productRouter = require("./routes/product")
const cartRouter = require("./routes/cart")
const orderRouter = require("./routes/order")

//Getting env
const PORT = process.env.PORT
const PATH = process.env.MONGO_DB

const app = express()

//Conection to MONGODB
DbConnect(PATH)

//Middlewares
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors())
app.use(morgan("combined"))

//Routes
app.use("/api/users", userRouter)
app.use("/api/auth", authRouter)
app.use("/api/products", productRouter)
app.use("/api/carts", cartRouter)
app.use("/api/orders", orderRouter)

//Server initialize
app.listen(PORT || 8801, ()  => {
  console.log(`Server running on PORT ${PORT}`)
})