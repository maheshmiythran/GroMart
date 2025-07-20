import React, { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { assets } from "../assets/assets.js";
import { useAppContext } from "../context/AppContext.jsx";
import { toast } from "react-hot-toast";

const Navbar = () => {
  const [open, setOpen] = React.useState(false);
  const {
    user,
    setUser,
    setShowUserLogin,
    navigate,
    setSearchQuery,
    searchQuery,
    getCartCount,
    axios
  } = useAppContext();

  const logout = async () => {
    try {
      const { data } = await axios.get("/api/user/logout");
      if (data.success) {
        setUser(null);
        setSearchQuery("");
        toast.success("Logged out successfully");
        navigate("/");
      }
      else {
        toast.error("Logout failed");
      }
    } catch (error) {
      toast.error(error.message || "Logout failed");
    }
  };

  useEffect(() => {
    if (searchQuery.length > 0) {
      navigate("/products");
    }
  }, [searchQuery]);
  return (
    <nav className="z-50 flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 border-b border-gray-300 bg-white top-0 left-0 w-full transition-all">
      <NavLink to="/" onClick={() => setOpen(false)}>
        <img className="h-20" src={assets.logo} alt="GroMartLogo1" />
      </NavLink>

      {/* Desktop Menu */}
      <div className="hidden sm:flex items-center gap-8">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/products">AllProducts</NavLink>
        <NavLink to="/contact">Contact</NavLink>

        <div className="hidden lg:flex items-center text-sm gap-2 border border-gray-300 px-3 rounded-full">
          <input
            onChange={(e) => setSearchQuery(e.target.value)}
            className="py-1.5 w-full bg-transparent outline-none placeholder-gray-500"
            type="text"
            placeholder="Search products"
          />
          <img src={assets.search_icon} alt="search" className="w-4 h-4" />
        </div>

        <div
          onClick={() => navigate("/cart")}
          className="relative cursor-pointer"
        >
          <img
            src={assets.nav_cart_icon}
            alt="cart"
            className="w-6 opacity-80"
          />
          {getCartCount() > 0 && (
            <button className="absolute -top-2 -right-3 text-xs text-white bg-green-500 w-[18px] h-[18px] rounded-full flex items-center justify-center">
              {getCartCount()}
            </button>
          )}
        </div>

        {!user ? (
          <button
            onClick={() => {
              setOpen(false);
              setShowUserLogin(true);
            }}
            style={{ backgroundColor: "#4fbf8b" }}
            className="cursor-pointer px-8 py-2 transition text-white rounded-full"
          >
            Login
          </button>
        ) : (
          <div className="relative group">
            <img src={assets.profile_icon} className="w-10" alt="profile" />
            <ul className="hidden group-hover:flex absolute top-10 right-0 bg-white shadow border border-gray-200 py-2.5 w-30 rounded-md flex-col text-sm">
              <li
                onClick={() => navigate("my-orders")}
                className="p-1.5 pl-3 hover:bg-primary/10 cursor-pointer"
              >
                {" "}
                My Orders{" "}
              </li>
              <li
                onClick={logout}
                className="p-1.5 pl-3 hover:bg-primary/10 cursor-pointer"
              >
                {" "}
                Logout{" "}
              </li>
            </ul>
          </div>
        )}
      </div>

      <div className="sm:hidden flex items-center gap-4">
        {/* Cart Icon with badge */}
        <div
          onClick={() => navigate("/cart")}
          className="relative cursor-pointer"
        >
          <img
            src={assets.nav_cart_icon}
            alt="cart"
            className="w-6 opacity-80"
          />
          {getCartCount() > 0 && (
            <span className="absolute -top-1.5 -right-2 text-[10px] text-white bg-green-500 w-4 h-4 flex items-center justify-center rounded-full leading-none">
              {getCartCount()}
            </span>
          )}
        </div>

        {/* Menu Button */}
        <button
          onClick={() => setOpen(!open)}
          aria-label="Menu"
          className="cursor-pointer"
        >
          <img src={assets.menu_icon} alt="menu" />
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className={`${open ? "flex" : "hidden"} absolute top-[79px] left-0 w-full bg-white shadow-md py-4 flex-col items-start gap-2 px-5 text-sm md:hidden z-50`}
        >
          <NavLink to="/" onClick={() => setOpen(false)}>
            Home
          </NavLink>
          <NavLink to="/products" onClick={() => setOpen(false)}>
            All Products
          </NavLink>
          {user && (
            <NavLink to="/orders" onClick={() => setOpen(false)}>
              My Orders
            </NavLink>
          )}
          <NavLink to="/contact" onClick={() => setOpen(false)}>
            Contact
          </NavLink>
          {!user ? (
            <button
              onClick={() => {
                setOpen(false);
                setShowUserLogin(true);
              }}
              style={{ backgroundColor: "#4fbf8b" }}
              className="cursor-pointer px-8 py-2 transition text-white rounded-full"
            >
              Login
            </button>
          ) : (
            <button
              onClick={logout}
              style={{ backgroundColor: "#4fbf8b" }}
              className="cursor-pointer px-8 py-2 transition text-white rounded-full"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
