const express = require("express");
const {
  createOrder,
  getOrdersList,
  getOrderProduct,
  updateOrder,
  deleteOrder,
} = require("../controllers/order.controller");
const { protect } = require("../controllers/user.controller");

const orderRouter = express.Router();

orderRouter.get('/',protect,getOrdersList);
orderRouter.post('/',protect,createOrder);
orderRouter.patch('/',getOrdersList)
// orderRouter.get("/:id/products",protect ,getOrderProduct);
// orderRouter.patch('/:id',protect,updateOrder)
orderRouter.delete('/:id',protect,deleteOrder)

// productRouter.router("/:id").patch(updateProduct).delete(deleteProduct).get(getById);
module.exports = orderRouter;
