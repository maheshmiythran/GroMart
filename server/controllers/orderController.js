import Order from "../models/Order.js";
import Product from "../models/Product.js";
import Stripe from "stripe";
import User from "../models/User.js"
const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);
// Place Order COD: /api/order/cod
export const placeOrderCOD = async (req, res) => {
    try {
        const { userId, items, address} = req.body;
        if(!address || items.length === 0) {
            return res.json({sucess: false, message: "Invalid Data"});
        }
        // Calculate Amount Using Items
        let amount = await items.reduce(async (acc,item) => {
            const product = await Product.findById(item.product);
            return(await acc) + product.offerPrice * item.quantity;
        },0);

        // Add Tax Charge (2%)
        amount += Math.floor(amount * 0.02);

        await Order.create({
            userId,
            items,
            amount,
            address,
            paymentType: "COD",
        });
        return res.json({success: true, message: "Order Placed Successfully"});
    } catch (error) {       
        console.error("Error placing order:", error);       
        res.json({success: false, message: error.message});
    }
};


// Place Order COD: /api/order/stripe
export const placeOrderStripe = async (req, res) => {
    try {
        const { userId, items, address} = req.body;
        const {origin} = req.headers;
        
        if(!address || items.length === 0) {
            return res.json({success: false, message: "Invalid Data"});
        }

        let productData=[];
        // Calculate Amount Using Items
        let amount = await items.reduce(async (acc,item) => {
            const product = await Product.findById(item.product);
            productData.push({
                name: product.name,
                price: product.offerPrice,
                quantity: item.quantity,
            });
            return(await acc) + product.offerPrice * item.quantity;
        },0);

        // Add Tax Charge (2%)
        amount += Math.floor(amount * 0.02);

        const order = await Order.create({
            userId,
            items,
            amount,
            address,
            paymentType: "Online",
        });
        // Stripe Gateway Integration
        const stripeInstance = Stripe(process.env.STRIPE_SECRET_KEY);

        // Create line items for Stripe
        const line_items = productData.map(item => ({
            price_data: {
                currency: "usd",
                product_data: {
                    name: item.name,
                },
                unit_amount: Math.floor(item.price * 1.02 * 100) // Stripe expects amount in cents
            },
            quantity: item.quantity,
        }
    ));
        const session = await stripeInstance.checkout.sessions.create({
            line_items,
            mode: "payment",
            success_url: `${origin}/loader?next=my-orders`,
            cancel_url: `${origin}/cart`,
            metadata: {
                orderId: order._id.toString(),
                userId: userId.toString(),
            },
        }); 
        return res.json({success: true, url: session.url});
    } catch (error) {       
        console.error("Error placing order:", error);       
        res.json({success: false, message: error.message});
    }
};

// Stripe Webhooks to Verify Payments Action : /stripe

export const stripeWebhook = async (req, res) => {
    //Stripe Gateway initialization
    const stripeInstance= new stripeWebhook(process.env.STRIPE_SECRET_KEY)

    const sign= Request.headers['stripe-signature'];

    try {
        event = stripeInstance.webhooks.constructEvent(
            req.body,
            sign,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (error) {
        Response.status(400).send(`Webhook Error: ${error.message}`);     
    }

    // Handle the event

    switch (event.type) {
        case "payment_intent.succeeded":{
            const paymentIntent = event.data.object;
            const paymentIntentId = paymentIntent.id;

            const session = await stripeInstance.checkout.sessions.list({
                payment_intent: paymentIntentId,
            })

            const {orderId, userId} = session.data[0].metadata;
            //Mark Payment as Paid
            await Order.findByIdAndUpdate(orderId, {isPaid: true})
            //clear Cart Data of the user
            await User.findByIdAndUpdate(userId, {cartItems: {}});
            break;
        }
        case "payment_intent.payment_failed":{
            const paymentIntent = event.data.object;
            const paymentIntentId = paymentIntent.id;

            const session = await stripeInstance.checkout.sessions.list({
                payment_intent: paymentIntentId,
            })

            const {orderId} = session.data[0].metadata;
            await Order.findByIdAndDelete(orderId)
            break;
        }
        default:
            console.error(`UnHandled event type ${event.type}`)
           break; 
    }

    response.json({received: true})

}

// Get Orders by UserId: /api/order/user
export const getUserOrders = async (req, res) => {
    try {
        const userId = req.user.id;
        const orders = await Order.find({ 
            userId, $or: [{paymentType: "COD"}, {isPaid: true}]
        }).populate("items.product address").sort({createdAt: -1});
        res.json({success: true, orders});
    } catch (error) {
        res.json({success: false, message: error.message});
        console.error("Error fetching user orders:", error);
    }
}

// Get All Orders (for seller / admin): /api/order/seller

export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({$or: [{paymentType: "COD"}, {isPaid: true}]}).populate("items.product address").sort({createdAt: -1});
        res.json({success: true, orders});
    } catch (error) {
        res.json({success: false, message: error.message});
        console.error("Error fetching all orders for Delivery:", error);
    }
}