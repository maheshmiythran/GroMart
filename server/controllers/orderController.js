import Order from "../models/Order.js";
import Product from "../models/Product.js";
import Stripe from "stripe";
import User from "../models/User.js";

const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

// Place Order - COD: /api/order/cod
export const placeOrderCOD = async (req, res) => {
  try {
    const { items, address } = req.body;
    const userId = req.user.id;
    if (!address || items.length === 0) {
      return res.json({ success: false, message: "Invalid Data" });
    }

    // Calculate total amount
    let amount = await items.reduce(async (acc, item) => {
      const product = await Product.findById(item.product);
      return (await acc) + product.offerPrice * item.quantity;
    }, 0);

    // Add 2% tax
    amount += Math.floor(amount * 0.02);

    await Order.create({
      userId,
      items,
      amount,
      address,
      paymentType: "COD",
    });
    await User.findByIdAndUpdate(userId, { cartItems: {} });
    return res.json({ success: true, message: "Order Placed Successfully" });
  } catch (error) {
    console.error("Error placing COD order:", error);
    res.json({ success: false, message: error.message });
  }
};

// Place Order - Stripe: /api/order/stripe
export const placeOrderStripe = async (req, res) => {
  try {
    const { userId, items, address } = req.body;
    const { origin } = req.headers;

    if (!address || items.length === 0) {
      return res.json({ success: false, message: "Invalid Data" });
    }

    let productData = [];
    let amount = await items.reduce(async (acc, item) => {
      const product = await Product.findById(item.product);
      productData.push({
        name: product.name,
        price: product.offerPrice,
        quantity: item.quantity,
      });
      return (await acc) + product.offerPrice * item.quantity;
    }, 0);

    amount += Math.floor(amount * 0.02);

    // Create order in DB first
    const order = await Order.create({
      userId,
      items,
      amount,
      address,
      paymentType: "Online",
      isPaid: false,
      status: "Pending Payment",
    });

    const line_items = productData.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
        },
        unit_amount: Math.floor(item.price * 1.02 * 100), // in cents
      },
      quantity: item.quantity,
    }));

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

    return res.json({ success: true, url: session.url });
  } catch (error) {
    console.error("Error placing Stripe order:", error);
    res.json({ success: false, message: error.message });
  }
};

export const stripeWebhook = async (req, res) => {
  const signature = req.headers["stripe-signature"];
  let event;

  try {
    event = stripeInstance.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    console.error("❌ Stripe Webhook Signature Error:", error.message);
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }

  console.log("✅ Webhook received:", event.type);

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      const metadata = session.metadata;

      console.log("📦 Metadata received:", metadata);

      if (!metadata?.orderId || !metadata?.userId) {
        console.error("❌ Missing metadata in session");
        break;
      }

      try {
        await Order.findByIdAndUpdate(metadata.orderId, {
          isPaid: true,
          status: "Paid",
        });

        await User.findByIdAndUpdate(metadata.userId, {
          cartItems: {},
        });

        console.log(`✅ Order ${metadata.orderId} marked as paid`);
      } catch (err) {
        console.error("❌ Error updating order:", err);
      }

      break;
    }

    case "payment_intent.payment_failed": {
      try {
        const sessionList = await stripeInstance.checkout.sessions.list({
          payment_intent: event.data.object.id,
        });

        const failedMetadata = sessionList.data[0]?.metadata;

        if (failedMetadata?.orderId) {
          await Order.findByIdAndDelete(failedMetadata.orderId);
          console.log(`🗑️ Deleted unpaid order ${failedMetadata.orderId}`);
        } else {
          console.warn("⚠️ No orderId in failed session metadata");
        }
      } catch (err) {
        console.error("❌ Failed to delete failed payment order:", err);
      }

      break;
    }

    default:
      console.warn(`⚠️ Unhandled event type: ${event.type}`);
  }

  res.status(200).json({ received: true });
};

// Get Orders by User: /api/order/user
export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await Order.find({
      userId,
      $or: [{ paymentType: "COD" }, { isPaid: false }],
    })
      .populate("items.product address")
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.json({ success: false, message: error.message });
  }
};

// Get All Orders (for sellers/admins): /api/order/seller
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      $or: [{ paymentType: "COD" }, { isPaid: true }],
    })
      .populate("items.product address")
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (error) {
    console.error("Error fetching all orders:", error);
    res.json({ success: false, message: error.message });
  }
};
// Seller Analytics : /api/order/seller-analytics
export const getSellerAnalytics = async (req, res) => {
  try {
    const orders = await Order.find({
      $or: [{ paymentType: "COD" }, { isPaid: true }],
    }).populate("items.product");

    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((acc, order) => acc + order.amount, 0);
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Monthly Revenue
    const monthlyRevenue = {};
    orders.forEach((order) => {
      const date = new Date(order.createdAt);
      const month = date.toLocaleString('default', { month: 'short' });
      monthlyRevenue[month] = (monthlyRevenue[month] || 0) + order.amount;
    });

    const monthlyRevenueData = Object.keys(monthlyRevenue).map((key) => ({
      name: key,
      revenue: monthlyRevenue[key],
    }));

    // Top Selling Products
    const productSales = {};
    orders.forEach((order) => {
      order.items.forEach((item) => {
        if (item.product) {
          const productName = item.product.name;
          productSales[productName] = (productSales[productName] || 0) + item.quantity;
        }
      });
    });

    const topProducts = Object.keys(productSales)
      .map((key) => ({ name: key, sales: productSales[key] }))
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5);

    // Category Distribution (Mock or Derived if category exists in product)
    // Since we populated product, we might access category, but let's stick to status for now or simple category if available
    const categoryDist = {};
    orders.forEach(order => {
      order.items.forEach(item => {
        if (item.product && item.product.category) {
          categoryDist[item.product.category] = (categoryDist[item.product.category] || 0) + 1
        }
      })
    })

    const categoryData = Object.keys(categoryDist).map(key => ({
      name: key,
      value: categoryDist[key]
    }))


    res.json({
      success: true,
      analytics: {
        totalOrders,
        totalRevenue,
        avgOrderValue,
        monthlyRevenueData,
        topProducts,
        categoryData
      },
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    res.json({ success: false, message: error.message });
  }
};
