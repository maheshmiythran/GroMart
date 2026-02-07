import express from "express";
import authUser from "../middlewares/authUser.js";
import { getAllOrders, getUserOrders, placeOrderCOD, placeOrderStripe, getSellerAnalytics } from "../controllers/orderController.js";
import authSeller from "../middlewares/authSeller.js";
import { updateOrderStatus } from "../controllers/productController.js"

const orderRouter = express.Router();

orderRouter.post('/cod', authUser, placeOrderCOD);
orderRouter.get('/user', authUser, getUserOrders);
orderRouter.get('/seller', authSeller, getAllOrders);
orderRouter.post('/stripe', authUser, placeOrderStripe);
orderRouter.post('/update-status', updateOrderStatus);
orderRouter.get('/seller-analytics', authSeller, getSellerAnalytics);

export default orderRouter;