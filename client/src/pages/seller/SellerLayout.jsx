import { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { assets } from '../../assets/assets';
import { useAppContext } from '../../context/AppContext';
import { toast } from 'react-hot-toast';

const SellerLayout = () => {
  const { handleSellerLogout } = useAppContext();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const sidebarLinks = [
    { name: 'Analytics', path: '/seller', icon: assets.order_icon }, // using order_icon as placeholder or if available
    { name: 'Add Product', path: '/seller/add-product', icon: assets.add_icon },
    {
      name: 'ProductList',
      path: '/seller/product-list',
      icon: assets.product_list_icon,
    },
    { name: 'Orders', path: '/seller/orders', icon: assets.order_icon },
    { name: 'Users', path: '/seller/users', icon: assets.profile_icon },
  ];

  const onLogoutClick = async () => {
    await handleSellerLogout();
  };

  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      {/* Top Navbar */}
      <div className="flex items-center justify-between px-4 md:px-8 border-b border-gray-300 py-3 bg-white transition-all duration-300">
        <Link to="/">
          <img
            className="cursor-pointer w-25 md:w-26"
            src={assets.logo}
            alt="Logo"
          />
        </Link>

        <div className="flex items-center gap-5 text-gray-500">
          <p>Hi! Admin</p>
          <button
            onClick={onLogoutClick}
            className="border rounded-full text-sm px-4 py-1 hover:bg-gray-100 transition focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Body Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className={`${collapsed ? 'w-16' : 'w-20 md:w-64'} border-r border-gray-200 pt-4 flex flex-col overflow-y-auto`}>
          {sidebarLinks.map((item) => (
            <NavLink
              to={item.path}
              key={item.name}
              end={item.path === '/seller'}
              className={({ isActive }) =>
                `flex items-center py-3 px-4 gap-3 whitespace-nowrap transition-all duration-300 ease-in-out 
      ${isActive
                  ? 'border-r-4 md:border-r-[6px] bg-primary/10 border-primary text-primary'
                  : 'hover:bg-gray-100/90 border-white text-gray-700'
                } focus:outline-none focus:ring-2 focus:ring-primary`
              }
            >
              {({ isActive }) => (
                <>
                  <img
                    src={item.icon}
                    alt=""
                    className={`w-6 h-6 transition ${isActive ? 'filter brightness-0 saturate-100 invert-[33%] sepia-[99%] hue-rotate-[100deg] contrast-[1.2]' : ''}`}
                  />
                  {!collapsed && (
                    <p className="md:block hidden text-sm font-medium">
                      {item.name}
                    </p>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>

        {/* Main Content */}
        <div className="flex-1 px-4 md:px-6 py-6 overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default SellerLayout;
