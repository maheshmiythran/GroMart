import React, { useEffect, useState } from 'react'
import { toast } from "react-hot-toast";
import { useAppContext } from '../context/AppContext'
import CancelOrders from '../components/CancelOrders.jsx';

const MyOrders = () => {
  const [myOrders, setMyOrders] = useState([])
  const { currency, axios, user } = useAppContext()
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const fetchMyOrders = async () => {
    try {
      const { data } = await axios.get('/api/order/user')
      if (data.success) {
        setMyOrders(data.orders)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (user) {
      fetchMyOrders()
    }
  }, [user])

  const statusStages = ["Pending", "Processing", "Shipped", "Delivered"];

  const renderCancelModal = () => {
    return (
      <CancelOrders
        id="cancel-order-modal"
        isOpen={showCancelModal}
        orderId={selectedOrderId}
        onClose={() => setShowCancelModal(false)}
        onCancelConfirmed={async () => {
          try {
            const { data } = await axios.post('/api/order/update-status', {
              orderId: selectedOrderId,
              status: 'Cancelled',
            });

            if (data.success) {
              toast.success("Order cancelled successfully");
              fetchMyOrders();
            } else {
              toast.error(data.message || "Failed to cancel order");
            }
          } catch (error) {
            toast.error(error.message || "Something went wrong");
          } finally {
            setShowCancelModal(false);
          }
        }}
      />
    );
  };

  return (
    <div id="my-orders-page" className='mt-2 pb-16 px-4'>
      <div className='flex flex-col items-end w-max mb-8'>
        <p id="my-orders-title" className='text-2xl font-medium uppercase'>My Orders</p>
        <div id="my-orders-title-underline" className='w-16 h-0.5 bg-primary rounded-full'></div>
      </div>

      {myOrders.length === 0 ? (
        <div id="no-orders-message" className="text-center text-gray-500 mt-10 text-lg">
          🛒 You have no orders yet.
        </div>
      ) : (
        myOrders.map((order, index) => (
          <div key={index} id={`order-${order._id}`} className='border border-gray-300 rounded-lg mb-10 p-4 py-5 max-w-4xl'>
            <p id={`order-summary-${order._id}`} className='flex justify-between items-center text-gray-400 md:font-medium max-md:flex-col'>
              <span id={`order-id-${order._id}`}> OrderId : {order._id} </span>
              <span id={`order-payment-${order._id}`}> Payment : {order.paymentType} </span>
              <span id={`order-total-${order._id}`}> Total Amount : {currency}{order.amount} </span>
            </p>

            {order.items.map((item, itemIndex) => {
              const product = item.product;
              if (!product) return null;

              return (
                <div
                  key={itemIndex}
                  id={`order-item-${order._id}-${itemIndex}`}
                  className={`relative bg-white text-gray-500/700 ${order.items.length !== index + 1 && "border-b"} border-gray-300 flex flex-col md:flex-row md:items-center justify-between p-4 py-5 md:gap-16 w-full max-w-4xl`}
                >
                  <div className='flex items-center mb-4 md:mb-0'>
                    <div id={`order-item-image-${order._id}-${itemIndex}`} className='bg-primary/10 p-4 rounded-lg'>
                      <img src={product.image?.[0] || "/placeholder.jpg"} alt={product.name} className='w-16 h-16' />
                    </div>
                    <div className='ml-4'>
                      <h2 id={`order-item-name-${order._id}-${itemIndex}`} className='text-lg font-medium text-gray-800'>{product.name}</h2>
                      <p id={`order-item-category-${order._id}-${itemIndex}`}>Category: {product.category}</p>
                    </div>
                  </div>

                  <div className='flex flex-col justify-center md:ml-8 mb-4 md:mb-0'>
                    <p id={`order-item-qty-${order._id}-${itemIndex}`} className="text-gray-700">Quantity: {item.quantity || "1"}</p>
                    <p id={`order-item-status-${order._id}-${itemIndex}`} className="text-gray-700">Status: {order.status}</p>
                    <p id={`order-item-date-${order._id}-${itemIndex}`} className="text-gray-700">Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <p id={`order-item-amount-${order._id}-${itemIndex}`} className='text-primary text-medium font-medium'>
                    Amount: {currency}{product.offerPrice * item.quantity}
                  </p>
                </div>
              );
            })}

            <div id={`order-progress-${order._id}`} className="mt-4">
              <div id={`order-stages-${order._id}`} className="flex items-center justify-between text-xs text-gray-500 mb-1">
                {statusStages.map((stage, idx) => (
                  <span
                    id={`order-stage-${order._id}-${stage}`}
                    key={idx}
                    className={`${order.status === stage ? 'text-primary font-semibold' : ''}`}
                  >
                    {stage}
                  </span>
                ))}
              </div>
              <div className="relative h-2 bg-gray-200 rounded-full">
                <div
                  id={`order-progress-bar-${order._id}`}
                  className="h-full bg-green-500 rounded-full transition-all duration-500"
                  style={{ width: `${(statusStages.indexOf(order.status) / (statusStages.length - 1)) * 100}%` }}
                ></div>
              </div>
            </div>

            {["Pending", "Processing"].includes(order.status) && (
              <div className="mt-4 text-right">
                <button
                  id={`cancel-order-btn-${order._id}`}
                  onClick={() => {
                    setSelectedOrderId(order._id);
                    setShowCancelModal(true);
                  }}
                  className="text-sm px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded transition"
                >
                  Cancel Order
                </button>
              </div>
            )}

            {order.status === "Cancelled" && (
              <div id={`order-cancelled-${order._id}`} className="mt-4 text-center text-red-500 font-semibold">
                🚫 This order has been cancelled, Refund will be iniated shortly.
              </div>
            )}
            {order.status === "Delivered" && (
              <div id={`order-delivered-${order._id}`} className="mt-4 text-center text-primary font-semibold">
                This order has been Delivered.
              </div>
            )}
          </div>
        ))
      )}

      {renderCancelModal()}
    </div>
  );
}

export default MyOrders
