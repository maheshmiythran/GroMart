import { createContext, use, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { dummyProducts } from "../assets/assets";
import toast from "react-hot-toast";
export const AppContext = createContext();
import axios from "axios";

axios.defaults.withCredentials = true; // Enable sending cookies with requests
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

export const AppContextProvider = ({ children }) => {
  const currency = import.meta.env.VITE_CURRENCY;

  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isSeller, setIsSeller] = useState(false);
  const [showUserLogin, setShowUserLogin] = useState(false);
  const [products, setProducts] = useState([]);


  const [cartItems, setCartItems] = useState({});
  const [searchQuery, setSearchQuery] = useState("");

  //Fetch Seller Status
  const fetchSeller = async () => {
    try {
      const {data} = await axios.get("/api/seller/is-auth");
      if (data.success) {
        setIsSeller(true);
      }
      else {
        setIsSeller(false);
      }
    } catch (error) {
        setIsSeller(false);
    }
  };

  // Fetch User Auth Status, User Data and Cart Items
  const fetchUser = async () => {
    try {
      const { data } = await axios.get('/api/user/is-auth', { withCredentials: true });
      if (data.success) {
        setUser(data.user);
        // Convert array to object for frontend
        const cartObj = {};
        if (Array.isArray(data.user.cartItems)) {
          data.user.cartItems.forEach(item => {
            cartObj[item.productId] = item.quantity;
          });
          setCartItems(cartObj);
        } else {
          setCartItems(data.user.cartItems || {});
        }
      }
    } catch (error) {
      setUser(null);
    }
  }


  // Fetch All Products
  const fetchProducts = async () => {
    try {
      const { data } = await axios.get("/api/product/list");
      if (data.success) {
        setProducts(data.products);
      }
      else {
        toast.error(error.message || "Failed to fetch products");
      }
    } catch (error) {
      
    }
  };

  const addToCart = (itemId) => {
    let cartData = structuredClone(cartItems);
    if (cartData[itemId]) {
      cartData[itemId] += 1;
    } else {
      cartData[itemId] = 1;
    }
    setCartItems(cartData);
    toast.success("Added to cart");
  };

  // Remove Product from Cart
  const removeCartItem = (itemId) => {
    let cartData = structuredClone(cartItems);
    if (cartData[itemId]) {
      cartData[itemId] -= cartData[itemId]; //Incase if you want to remove each item quantiy just add -=1
      if (cartData[itemId] === 0) {
        delete cartData[itemId];
      }
    }
    setCartItems(cartData);
    toast.success("Removed from cart");
  };
  
  //Update Cart Item Quantity
  const updateCartItem = async (itemId, quantity) => {
    let cartData = structuredClone(cartItems);

    if (quantity <= 0) {
      delete cartData[itemId];
      toast.info("Item removed from cart");
    } else {
      cartData[itemId] = quantity;
      toast.success("Cart updated successfully");
    }

    setCartItems(cartData);

    // Send update to backend
    try {
      await axios.post("/api/cart/update", {
        productId: itemId,
        quantity,
      });
    } catch (error) {
      console.error("Failed to sync cart with backend", error);
      toast.error("Failed to sync cart with server");
    }
  };

  //Get Cart Items Count
  const getCartCount = () => {
    let totalCount = 0;
    for (const item in cartItems) {
      totalCount += cartItems[item];
    }
    return totalCount;
  };

  //Get Cart Total Amount
  const getCartAmount= () => {
    let totalAmount = 0;
    for (const items in cartItems) {
      let itemInfo = products.find((product) => product._id === items);
      if(cartItems[items] >0){
        totalAmount += itemInfo.offerPrice * cartItems[items];
      }
    }
    return Math.floor(totalAmount * 100) / 100;
  }

  useEffect(() => {
    fetchUser();
    fetchSeller();
    fetchProducts();
  }, []);

  //Update Database Cart Items

  useEffect(() => {
    const updateCart = async () => {
      try {
        const { data } = await axios.post("/api/cart/update", { userId: user._id, cartItems });
        if (!data.success) {
          toast.error(data.message || "Failed to update cart");
        } 
      } catch (error) {
        toast.error(error.message || "Failed to update cart");
      }
    };

    if(user) {
      updateCart();
    }
  }, [cartItems, user]);

  useEffect(() => {
    if (!user) {
      const localCart = localStorage.getItem("cartItems");
      if (localCart) {
        setCartItems(JSON.parse(localCart));
      }
    }
  }, [user]);

  // Save cart to localStorage whenever it changes (for guests)
  useEffect(() => {
    if (!user) {
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }
  }, [cartItems, user]);

  const value = {
    navigate,
    user,
    setUser,
    setIsSeller,
    isSeller,
    showUserLogin,
    setShowUserLogin,
    products,
    currency,
    addToCart,
    updateCartItem,
    removeCartItem,
    cartItems,
    searchQuery,
    setSearchQuery,
    getCartCount,
    getCartAmount,
    axios,
    fetchProducts,
    setCartItems,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  return useContext(AppContext);
};
