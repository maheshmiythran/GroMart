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
    axios,
    handleUserLogout
  } = useAppContext();

  useEffect(() => {
    if (searchQuery.length > 0) {
      navigate("/products");
    }
  }, [searchQuery]);

  return (
    <nav
      id="navbar"
      className="z-50 flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 border-b border-gray-300 bg-white top-0 left-0 w-full transition-all"
    >
      <NavLink id="logo-link" to="/" onClick={() => setOpen(false)}>
        <img id="logo-img" className="h-24 md:h-28" src={assets.logo} alt="GroMartLogo" />
      </NavLink>

      {/* Desktop Menu */}
      <div id="desktop-menu" className="hidden sm:flex items-center gap-8">
        <NavLink id="nav-home" to="/">Home</NavLink>
        <NavLink id="nav-products" to="/products">AllProducts</NavLink>
        <NavLink id="nav-contact" to="/contact">Contact</NavLink>

        <div
          id="search-bar"
          className="hidden lg:flex items-center text-sm gap-2 border border-gray-300 px-3 rounded-full"
        >
          <input
            id="search-input"
            onChange={(e) => setSearchQuery(e.target.value)}
            className="py-1.5 w-full bg-transparent outline-none placeholder-gray-500"
            type="text"
            placeholder="Search products"
          />
          <img id="search-icon" src={assets.search_icon} alt="search" className="w-4 h-4" />
        </div>

        <div
          id="cart-button-desktop"
          onClick={() => navigate("/cart")}
          className="relative cursor-pointer"
        >
          <img
            id="cart-icon-desktop"
            src={assets.nav_cart_icon}
            alt="cart"
            className="w-6 opacity-80"
          />
          {getCartCount() > 0 && (
            <button id="cart-count-desktop" className="absolute -top-2 -right-3 text-xs text-white bg-green-500 w-[18px] h-[18px] rounded-full flex items-center justify-center">
              {getCartCount()}
            </button>
          )}
        </div>

        {!user ? (
          <button
            id="login-button-desktop"
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
          <div id="profile-menu" className="relative group">
            <img id="profile-icon" src={assets.profile_icon} className="w-10" alt="profile" />
            <ul
              id="profile-dropdown"
              className="hidden group-hover:flex absolute top-10 right-0 bg-white shadow border border-gray-200 py-2.5 w-30 rounded-md flex-col text-sm"
            >
              <li
                id="my-orders-link"
                onClick={() => navigate("/my-orders")}
                className="p-1.5 pl-3 hover:bg-primary/10 cursor-pointer"
              >
                My Orders
              </li>
              <li
                id="logout-button-desktop"
                onClick={handleUserLogout}
                className="p-1.5 pl-3 hover:bg-primary/10 cursor-pointer"
              >
                Logout
              </li>
            </ul>
          </div>
        )}
      </div>

      <div id="mobile-menu-toggle" className="sm:hidden flex items-center gap-4">
        {/* Cart Icon with badge */}
        <div
          id="cart-button-mobile"
          onClick={() => navigate("/cart")}
          className="relative cursor-pointer"
        >
          <img
            id="cart-icon-mobile"
            src={assets.nav_cart_icon}
            alt="cart"
            className="w-6 opacity-80"
          />
          {getCartCount() > 0 && (
            <span id="cart-count-mobile" className="absolute -top-1.5 -right-2 text-[10px] text-white bg-green-500 w-4 h-4 flex items-center justify-center rounded-full leading-none">
              {getCartCount()}
            </span>
          )}
        </div>

        {/* Menu Button */}
        <button
          id="menu-button"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
          className="cursor-pointer"
        >
          <img id="menu-icon" src={assets.menu_icon} alt="menu" />
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div
          id="mobile-menu"
          className={`${open ? "flex" : "hidden"} absolute top-[79px] left-0 w-full bg-white shadow-md py-4 flex-col items-start gap-2 px-5 text-sm md:hidden z-50`}
        >
          <NavLink id="mobile-nav-home" to="/" onClick={() => setOpen(false)}>
            Home
          </NavLink>
          <NavLink id="mobile-nav-products" to="/products" onClick={() => setOpen(false)}>
            All Products
          </NavLink>
          <NavLink id="mobile-nav-contact" to="/contact" onClick={() => setOpen(false)}>
            Contact
          </NavLink>

          {user ? (
            <>
              <NavLink id="mobile-my-orders" to="/my-orders" onClick={() => setOpen(false)}>
                My Orders
              </NavLink>
              <button
                id="logout-button-mobile"
                onClick={() => {
                  setOpen(false);
                  handleUserLogout();
                }}
                style={{ backgroundColor: "#4fbf8b" }}
                className="cursor-pointer px-8 py-2 transition text-white rounded-full"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              id="login-button-mobile"
              onClick={() => {
                setOpen(false);
                setShowUserLogin(true);
              }}
              style={{ backgroundColor: "#4fbf8b" }}
              className="cursor-pointer px-8 py-2 transition text-white rounded-full"
            >
              Login
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
