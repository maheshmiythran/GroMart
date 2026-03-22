import { useState, useEffect } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { assets } from '../../assets/assets';
import { useAppContext } from '../../context/AppContext';
import { toast } from 'react-hot-toast';

const SellerLayout = () => {
  const { handleSellerLogout, axios } = useAppContext();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [expiringCount, setExpiringCount] = useState(0);

  useEffect(() => {
    const fetchExpiringCodes = async () => {
      try {
        const { data } = await axios.get('/api/promocode/list');
        if (data.success && data.promoCodes) {
          const now = new Date();
          const nextWeek = new Date();
          nextWeek.setDate(now.getDate() + 7);

          const count = data.promoCodes.filter(c => {
            const expiry = new Date(c.expiryDate);
            return c.status === 'active' && expiry > now && expiry <= nextWeek;
          }).length;
          setExpiringCount(count);
        }
      } catch (e) {
        console.error("Failed to fetch expiring codes", e);
      }
    };
    fetchExpiringCodes();
  }, [axios]);

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
    { name: 'Promo Codes', path: '/seller/promo-codes', icon: assets.product_list_icon },
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
                    <div className="flex items-center justify-between w-full">
                      <p className="md:block hidden text-sm font-medium">
                        {item.name}
                      </p>
                      {item.name === 'Promo Codes' && expiringCount > 0 && (
                        <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5 ml-auto hidden md:block" title={`${expiringCount} codes expiring soon`}>
                          {expiringCount}
                        </span>
                      )}
                    </div>
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
