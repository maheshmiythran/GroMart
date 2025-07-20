import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const TrackOrder = () => {
  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);

  const trackOrder = async () => {
    if (!orderId.trim()) {
      toast.error("Please enter a valid Order ID");
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.get(`/api/order/track/${orderId}`);
      if (data.success) {
        setOrder(data.order);
      } else {
        setOrder(null);
        toast.error(data.message || "Order not found");
      }
    } catch (error) {
      setOrder(null);
      toast.error("Failed to fetch order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Track Your Order</h1>

      <div className="flex items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Enter Order ID"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          className="border border-gray-300 px-4 py-2 rounded w-full"
        />
        <button
          onClick={trackOrder}
          disabled={loading}
          className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark disabled:opacity-50"
        >
          {loading ? "Searching..." : "Track"}
        </button>
      </div>

      {order && (
        <div className="border border-gray-300 p-4 rounded shadow bg-white">
          <h2 className="text-xl font-semibold mb-2">Order Details</h2>
          <p><strong>Status:</strong> {order.status}</p>
          <p><strong>Payment:</strong> {order.paymentType} {order.isPaid ? "(Paid)" : "(Unpaid)"}</p>
          <p><strong>Total:</strong> ${order.amount}</p>
          <p><strong>Items:</strong></p>
          <ul className="list-disc pl-5 text-sm text-gray-600">
            {order.items.map((item) => (
              <li key={item.product._id}>
                {item.product.name} × {item.quantity}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TrackOrder;
