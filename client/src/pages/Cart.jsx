import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext.jsx";
import { assets } from "../assets/assets";
import toast from "react-hot-toast";
const Cart = () => {
  const {
    user,
    axios,
    products,
    currency,
    cartItems,
    removeCartItem,
    getCartCount,
    updateCartItem,
    navigate,
    getCartAmount,
    setCartItems,
    setShowUserLogin,
  } = useAppContext();
  const [cartArray, setCartArray] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [showAddress, setShowAddress] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentOption, setPaymentOption] = useState("COD");

  const handleDeleteAddress = async (address) => {
    try {
      const { data } = await axios.delete(`/api/address/delete/${address._id}`);

      if (data.success) {
        toast.success("Address deleted");
        setAddresses((prev) => prev.filter((a) => a._id !== address._id));
      } else {
        toast.error(data.message || "Failed to delete address");
      }
    } catch (error) {
      console.error("Delete address error:", error);
      toast.error("Something went wrong");
    }
  };


  const getCart = () => {
    let tempArray = [];
    for (const key in cartItems) {
      if (cartItems[key] > 0) {
        // Only add if quantity > 0
        const product = products.find((item) => item._id === key);
        if (product) {
          product.quantity = cartItems[key];
          tempArray.push(product);
        }
      }
    }
    setCartArray(tempArray);
  };

  const getUserAddress = async () => {
    try {
      if (!user?._id) return;
      const { data } = await axios.get(`/api/address/get?userId=${user._id}`, {
        withCredentials: true,
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });

      if (data.success) {
        setAddresses(data.addresses);
        if (data.addresses.length > 0) {
          setSelectedAddress(data.addresses[0]);
        }
      }
    } catch (error) {
      // Handle 401 silently
      if (error.response?.status === 401) {
        return;
      }
      toast.error("Failed to fetch addresses");
    }
  };

  useEffect(() => {
    if (products.length > 0 && cartItems) {
      getCart();
    }
  }, [products, cartItems]);

  const placeOrder = async () => {
    try {
      // Check authentication first
      if (!user?._id) {
          setShowUserLogin(true);
          return;
      }

      if (!selectedAddress) {
        toast.error("Please select a delivery address");
        return;
      }

      const orderData = {
        items: cartArray.map((item) => ({
          product: item._id,
          quantity: item.quantity,
        })),
        address: selectedAddress._id,
      };

      const config = {
        withCredentials: true,
        headers: {
          withCredentials: true,
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      };

      if (paymentOption === "COD") {
        const { data } = await axios.post("/api/order/cod", orderData, config);

        if (data.success) {
          toast.success("Order placed successfully");
          setCartItems({});
          navigate("/my-orders");
        } else {
          toast.error(data.message || "Failed to place order");
        }
      } else {
        const { data } = await axios.post("/api/order/stripe", orderData, config);
        if (data.success) {
          window.location.replace(data.url);
        } else {
          toast.error(data.message || "Failed to place order");
        }
      }
    } catch (error) {
      if (error.response?.status === 401) {
        setShowUserLogin(true);
      } else {
        toast.error(error.response?.data?.message || "Failed to place order");
      }
    }
  };

  useEffect(() => {
  // Only fetch addresses if user is authenticated
  if (user?._id) {
      getUserAddress();
    } else {
      setAddresses([]);
      setSelectedAddress(null);
  }
  }, [user]);

  

  return products.length > 0 && cartItems ? (
    <div id="cart-page" className="flex flex-col md:flex-row mt-16">
      <div id="cart-items-section" className="flex-1 max-w-4xl">
        <h1 id="cart-title" className="text-3xl font-medium mb-6">
          Shopping Cart{" "}
          <span id="cart-items-count" className="text-sm text-primary">
            {cartArray.length} Items
          </span>
        </h1>

        <div
          id="cart-header-row"
          className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 text-base font-medium pb-3"
        >
          <p className="text-left">Product Details</p>
          <p className="text-center">Subtotal</p>
          <p className="text-center">Action</p>
        </div>

        {cartArray.map((product) => (
          <div
            key={product._id}
            id={`cart-item-${product._id}`}
            className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 items-center text-sm md:text-base font-medium pt-3"
          >
            <div className="flex items-center md:gap-6 gap-3">
              <div
                id={`cart-item-image-${product._id}`}
                onClick={() => {
                  navigate(
                    `/products/${product.category.toLowerCase()}/${product._id}`
                  );
                  scrollTo(0, 0);
                }}
                className="cursor-pointer w-24 h-24 flex items-center justify-center border border-gray-300 rounded"
              >
                <img
                  className="max-w-full h-full object-cover"
                  src={product.image[0]}
                  alt={product.name}
                />
              </div>
              <div>
                <p
                  id={`cart-item-name-${product._id}`}
                  className="hidden md:block font-semibold"
                >
                  {product.name}
                </p>
                <div className="font-normal text-gray-500/70">
                  <p>
                    Weight:{" "}
                    <span id={`cart-item-weight-${product._id}`}>
                      {product.weight || "N/A"}
                    </span>
                  </p>
                  <div className="flex items-center">
                    <p>Qty:</p>
                    <select
                      id={`cart-item-qty-${product._id}`}
                      className="outline-none"
                      value={cartItems[product._id]}
                      onChange={(e) =>
                        updateCartItem(product._id, Number(e.target.value))
                      }
                    >
                      {Array.from({
                        length:
                          cartItems[product._id] > 9
                            ? cartItems[product._id]
                            : 9,
                      }).map((_, index) => {
                        const value = index + 1;
                        return (
                          <option
                            id={`cart-item-qty-option-${product._id}-${value}`}
                            key={`${product._id}-${value}`}
                            value={value}
                          >
                            {value}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <p id={`cart-item-subtotal-${product._id}`} className="text-center">
              {currency}
              {product.offerPrice * product.quantity}
            </p>
            <button
              id={`cart-item-remove-${product._id}`}
              onClick={() => removeCartItem(product._id)}
              className="cursor-pointer mx-auto"
            >
              <img
                src={assets.remove_icon}
                alt="remove"
                className="inline-block w-6 h-6"
              />
            </button>
          </div>
        ))}

        <button
          id="continue-shopping-btn"
          onClick={() => {
            navigate("/products");
            scrollTo(0, 0);
          }}
          className="group cursor-pointer flex items-center mt-8 gap-2 text-primary font-medium"
        >
          <img
            src={assets.arrow_right_icon_colored}
            alt="arrow"
            className="group-hover:translate-x-1 transition"
          />
          Continue Shopping
        </button>
      </div>

      {/* Order Summary Section */}
      <div
        id="order-summary"
        className="max-w-[360px] w-full bg-gray-100/40 p-5 max-md:mt-16 border border-gray-300/70"
      >
        <h2 id="order-summary-title" className="text-xl md:text-xl font-medium">
          Order Summary
        </h2>
        <hr className="border-gray-300 my-5" />

        <div id="delivery-section" className="mb-6">
          <p className="text-sm font-medium uppercase">Delivery Address</p>
          <div className="relative flex justify-between items-start mt-2">
            <p id="selected-address" className="text-gray-500">
              {selectedAddress
                ? `${selectedAddress.street}, ${selectedAddress.city}, ${selectedAddress.state}, ${selectedAddress.country}`
                : "No address found"}
            </p>
            <button
              id="change-address-btn"
              onClick={() => setShowAddress(!showAddress)}
              className="text-primary hover:underline cursor-pointer"
            >
              Change
            </button>
            {showAddress && (
              <div
                id="address-list"
                className="absolute top-12 py-1 bg-white border border-gray-300 text-sm w-full z-10 max-h-[200px] overflow-y-auto"
              >
                {addresses.map((address) => (
                  <div
                    key={address._id}
                    id={`address-${address._id}`}
                    className="flex justify-between items-start p-2 border-b hover:bg-gray-50"
                  >
                    <p
                      id={`select-address-${address._id}`}
                      onClick={() => {
                        setSelectedAddress(address);
                        setShowAddress(false);
                      }}
                      className="text-gray-500 cursor-pointer text-sm"
                    >
                      {address.street}, {address.city}, {address.state},{" "}
                      {address.country}
                    </p>
                    <div className="flex flex-col gap-1 text-xs ml-4">
                      <button
                        id={`edit-address-${address._id}`}
                        className="text-blue-600 hover:underline"
                        onClick={() =>
                          navigate(`/edit-address/${address._id}`)
                        }
                      >
                        Edit
                      </button>
                      <button
                        id={`delete-address-${address._id}`}
                        className="text-red-600 hover:underline"
                        onClick={() => handleDeleteAddress(address)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
                <p
                  id="add-new-address-btn"
                  onClick={() => navigate("/add-address")}
                  className="text-primary text-center cursor-pointer p-2 hover:bg-indigo-500/10"
                >
                  Add address
                </p>
              </div>
            )}
          </div>

          <p className="text-sm font-medium uppercase mt-6">Payment Method</p>

          <select
            id="payment-method-select"
            onChange={(e) => setPaymentOption(e.target.value)}
            className="w-full border border-gray-300 bg-white px-3 py-2 mt-2 outline-none"
          >
            <option id="payment-option-cod" value="COD">
              Cash On Delivery
            </option>
            <option id="payment-option-online" value="Online">
              Online Payment
            </option>
          </select>
        </div>

        <hr className="border-gray-300" />

        <div id="cart-summary" className="text-gray-500 mt-4 space-y-2">
          <p className="flex justify-between">
            <span>Price</span>
            <span id="cart-total-price">
              {currency}
              {getCartAmount()}
            </span>
          </p>
          <p className="flex justify-between">
            <span>Shipping Fee</span>
            <span id="shipping-fee" className="text-green-600">
              Free
            </span>
          </p>
          <p className="flex justify-between">
            <span>Tax (2%)</span>
            <span id="cart-tax">
              {currency}
              {(getCartAmount() * 2) / 100}
            </span>
          </p>
          <p
            id="cart-grand-total"
            className="flex justify-between text-lg font-medium mt-3"
          >
            <span>Total Amount:</span>
            <span>
              {currency}
              {getCartAmount() + (getCartAmount() * 2) / 100}
            </span>
          </p>
        </div>

        <button
          id="place-order-btn"
          onClick={placeOrder}
          className="w-full py-3 mt-6 cursor-pointer bg-primary text-white font-medium hover:primary-dull transition"
        >
          {paymentOption === "COD" ? "Place Order" : "Proceed to Checkout"}
        </button>
      </div>
    </div>
  ) : null;
};

export default Cart;