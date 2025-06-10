const Order = require("../models/order.model");
const User = require("../models/user.model");
const { catchAsync } = require("../utils/catchAsync");





exports.createOrder = catchAsync(async (req, res, next) => {
  // const token = req.headers.authorization.split(" ")[1];
  // const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  // const userr = await User.findById(decoded.id);
  const { products,amount } =req.body;
    const userId=req.user._id
    
  const newOrder= await Order.create({
    products,
    amount,
   userId
  });
console.log(userId)
  res.status(201).json({
    message: "success",
    data: newOrder,
    
  });
});

exports.getOrdersList = async (req, res) => {
  try {
    const newOrder = await Order.find()//.populate("userId").populate("products");
    res.status(201).json({ message: "success", data: newOrder });
  } catch (error) {
    res.status(500).json({ message: "fail", error });
  }
};
exports.getOrderProduct = async (req, res) => {
  try{
  const orderProducts = await Order.findById(req.params.id).select('products')
  res.status(201).json({ message: "success" ,data:orderProducts});
} catch (error) {
  res.status(500).json({ message: "fail", error });
}
};



exports. updateOrder=async(req,res)=>{
  try{
      //const product = await Product.findById(req.body.productId);

    const updatedOrder=await Order.findOneAndUpdate({_id:req.params.id},req.body,{
      new:true
    })
   //await product.save();


    res.status(200).json({ message: "success",data:updatedOrder
  })
   }
   catch(error){
    console.log(error)
     res.status(500).json({ message: "fail",error
     })}
}

exports. deleteOrder=async(req,res)=>{
  try{
    // const result = await Product.updateOne(
    //   { _id:req.body.productId },
    //   { $pull: { review: { _id: req.params.id } } }
    // );
    await Order.findOneAndDelete({_id:req.params.id})

    res.status(200).json({ message: "success"})
   }
   catch(error){
     res.status(500).json({ message: "fail",error
     })}
}
