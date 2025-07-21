import React, { useEffect } from 'react'
import { toast } from "react-hot-toast";
import { useState } from 'react'
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
                isOpen={showCancelModal}           // ✅ add this line
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
        <div className='mt-2 pb-16 px-4'>
            <div className='flex flex-col items-end w-max mb-8'>
                <p className='text-2xl font-medium uppercase'>My Orders</p>
                <div className='w-16 h-0.5 bg-primary rounded-full'></div>
            </div>

            {myOrders.length === 0 ? (
                <div className="text-center text-gray-500 mt-10 text-lg">
                    🛒 You have no orders yet.
                </div>
            ) : (
                myOrders.map((order, index) => (
                    <div key={index} className='border border-gray-300 rounded-lg mb-10 p-4 py-5 max-w-4xl'>
                        <p className='flex justify-between items-center text-gray-400 md:font-medium max-md:flex-col'>
                            <span> OrderId : {order._id} </span>
                            <span> Payment : {order.paymentType} </span>
                            <span> Total Amount : {currency}{order.amount} </span>
                        </p>

                        {order.items.map((item, itemIndex) => {
                            const product = item.product;
                            if (!product) return null; // Skip if product is missing

                            return (
                                <div key={itemIndex} className={`relative bg-white text-gray-500/700 ${order.items.length !== index + 1 && "border-b"} border-gray-300 flex flex-col md:flex-row md:items-center justify-between p-4 py-5 md:gap-16 w-full max-w-4xl`}>
                                    <div className='flex items-center mb-4 md:mb-0'>
                                        <div className='bg-primary/10 p-4 rounded-lg'>
                                            <img src={product.image?.[0] || "/placeholder.jpg"} alt={product.name} className='w-16 h-16' />
                                        </div>
                                        <div className='ml-4'>
                                            <h2 className='text-lg font-medium text-gray-800'>{product.name}</h2>
                                            <p>Category: {product.category}</p>
                                        </div>
                                    </div>

                                    <div className='flex flex-col justify-center md:ml-8 mb-4 md:mb-0'>
                                        <p className="text-gray-700">Quantity: {item.quantity || "1"}</p>
                                        <p className="text-gray-700">Status: {order.status}</p>
                                        <p className="text-gray-700">Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <p className='text-primary text-medium font-medium'>
                                        Amount: {currency}{product.offerPrice * item.quantity}
                                    </p>
                                </div>
                            );
                        })}

                        <div className="mt-4">
                            <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                                {statusStages.map((stage, idx) => (
                                    <span key={idx} className={`${order.status === stage ? 'text-primary font-semibold' : ''}`}>
                                        {stage}
                                    </span>
                                ))}
                            </div>
                            <div className="relative h-2 bg-gray-200 rounded-full">
                                <div className="h-full bg-green-500 rounded-full transition-all duration-500" style={{ width: `${(statusStages.indexOf(order.status) / (statusStages.length - 1)) * 100}%`, }}></div>
                            </div>
                        </div>
                        {["Pending", "Processing"].includes(order.status) && (
                            <div className="mt-4 text-right">
                                <button
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
                            <div className="mt-4 text-center text-red-500 font-semibold">
                                🚫 This order has been cancelled, Refund will be iniated shortly.
                            </div>
                        )}
                        {order.status === "Delivered" && (
                            <div className="mt-4 text-center text-primary font-semibold">
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
