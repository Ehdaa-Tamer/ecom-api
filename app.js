const { Console } = require('console');
const express=require('express')
const fs=require('fs');
const mongoose=require('mongoose')
const dotenv=require('dotenv')
const userRouter=require('./routers/user.router')
const productRouter=require('./routers/product.router')
const reviewRouter = require("./routers/review.router");
const categoryRouter = require("./routers/category.router");
const orderRouter = require("./routers/order.router");
const cartRouter = require("./routers/cart.router");
const cartItemRouter= require("./routers/cartItem.router");

dotenv.config({path:'config.env'})
const app=express()
app.use(express.json())

app.use('/users',userRouter)
app.use('/products',productRouter)
app.use("/reviews", reviewRouter);
app.use("/categories", categoryRouter);
app.use("/orders", orderRouter);
app.use("/carts", cartRouter);
app.use("/cartItems", cartItemRouter);

app.use ("*" , (req, res, next) => {
    res. status (404). json({
    message: `Cannot find ${req.originalUrl} on this server`,
    });      })
    
    app.use((err, req, res,next)=>{
 err.statusCode = err.statfsCode || 500;
    err. status = err. status ||"error";
    res. status(err.statusCode).json({ status: err.status, err: err.message });})

console.log(process.env.PORT)
const DBString = process.env.DB.replace("<db_password>", process.env.DB_PASSWORD);
mongoose
  .connect(DBString)
  .then(() => console.log(`✅ MongoDB Connected Successfully`))
  .catch((err) => console.error(`❌ MongoDB Connection Error: ${err.message}`));

mongoose.connect(DBString)



const PORT = process.env.PORT || 6000;
app.listen(PORT, () => console.log(`Running on port ${PORT}`));