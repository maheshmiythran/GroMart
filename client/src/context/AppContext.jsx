import { createContext, use, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  const [userAddress, setUserAddress] = useState(null);


  const [cartItems, setCartItems] = useState({});
  const [searchQuery, setSearchQuery] = useState("");

  //Fetch Seller Status
  const fetchSeller = async () => {
    try {
      const { data } = await axios.get('/api/seller/is-auth');
      if (data.success) {
        setIsSeller(true);
      } else {
        setIsSeller(false);
        if (window.location.pathname.includes('seller')) {
          navigate('/seller');
        }
      }
    } catch (error) {
      console.error('Seller auth error:', error.message);
      setIsSeller(false);
      if (window.location.pathname.includes('seller')) {
        navigate('/seller');
      }
    }
  };

  // Add useEffect to check seller status on mount and route change
  useEffect(() => {
    if (window.location.pathname.includes('seller')) {
      fetchSeller();
    }
  }, [window.location.pathname]);

  // Fetch User Auth Status, User Data and Cart Items
  const fetchUser = async () => {
    try {
      const res = await axios.get("/api/user/is-auth", { withCredentials: true });

      if (res.data.success) {
        setUser(res.data.user); // user = {_id, email, name, cartItems}
        
        // Fetch address using protected route
        const addrRes = await axios.get("/api/address/get", { withCredentials: true });
        if (addrRes.data.success) {
          setUserAddress(addrRes.data.addresses);
        }
      } else {
        setUser(null);
        setUserAddress([]);
      }
    } catch (err) {
      console.error("Error fetching user auth:", err);
      setUser(null);
      setUserAddress([]);
    }
  };

  useEffect(() => {
  fetchUser();
}, []);



  // Fetch All Products
  const fetchProducts = async () => {
    try {
      const { data } = await axios.get("/api/product/list", { withCredentials: true });
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
    const init = async () => {
      try {
        await fetchProducts();
        await fetchUser(); // Always try to fetch user, let backend decide
      } catch (error) {
        console.error('Initialization error:', error);
      }
    };
    init();
  }, []); // Run once on mount

  //Update Database Cart Items

  useEffect(() => {
    const updateCart = async () => {
      // Only attempt to update if we have a logged in user with an ID
      if (!user?._id) return;

      try {
        const { data } = await axios.post("/api/cart/update", 
          { 
            userId: user._id, 
            cartItems 
          }, 
          { 
            withCredentials: true,
            headers: {
              'Cache-Control': 'no-cache',
              'Pragma': 'no-cache'
            }
          }
        );

        if (!data.success) {
          toast.error(data.message || "Failed to update cart");
        }
      } catch (error) {
        // Only show error toast if it's not an auth error
        if (error.response?.status !== 401) {
          console.error("Cart update error:", error.message);
          toast.error("Failed to update cart");
        }
      }
    };

    // Only run updateCart if we have a user
    if (user?._id) {
      updateCart();
    } else {
      // For guests, save cart to localStorage
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
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

  const handleSellerLogout = async () => {
    try {
      const { data } = await axios.get('/api/seller/logout', { 
        withCredentials: true,
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      
      if (data.success) {
        setIsSeller(false);
        localStorage.removeItem('isSeller');
        navigate('/seller');
      } else {
        toast.error('Logout failed');
      }
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout');
    }
  };

  const handleUserLogout = async () => {
    try {
      const { data } = await axios.get('/api/user/logout', { withCredentials: true });
      if (data.success) {
        setUser(null);
        setCartItems({});
        toast.success('Logged out successfully');
        
      }
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout');
    }
  };

  const handleUserLogin = async (email, password) => {
    try {
      const { data } = await axios.post('/api/user/login', { email, password });
      if (data.success) {
        // DO NOT store token in localStorage
        await fetchUser(); // This will work because cookie is set
        setShowUserLogin(false);
        toast.success('Login successful');
      } else {
        toast.error(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed');
    }
  };

  // Add handleSellerLogout to the context value
  const value = {
    handleSellerLogout,
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
    handleUserLogin,
    handleUserLogout,
    fetchUser, // <-- ADD THIS LINE
    userAddress,
    setUserAddress,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  return useContext(AppContext);
};
