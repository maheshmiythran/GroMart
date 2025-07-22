import React, { useEffect, useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';
import { assets } from '../../assets/assets';

const SellerLogin = () => {
  const { isSeller, setIsSeller, navigate, axios } = useAppContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

   const onSubmitHandler = async (event) => {
    event.preventDefault(); // ✅ move to top
    setLoading(true);       // ✅ start loading

    try {
      const { data } = await axios.post(
        '/api/seller/login',
        { email, password, remember },
        { withCredentials: true } // 🔥 THIS IS NECESSARY
      );

      if (data.success) {
        setIsSeller(true);
        toast.success('Seller logged in successfully!');
        navigate('/seller');
      } else {
        toast.error(data.message || 'Invalid email or password');
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || error.message || 'Something went wrong');
    } finally {
      setLoading(false); // ✅ stop loading after success or failure
    }
  };

  useEffect(() => {
    if (isSeller) navigate('/seller');
  }, [isSeller]);

  return !isSeller && (
    <div className="flex items-center justify-center min-h-screen max-h-[90vh] overflow-hidden px-4 bg-gray-50">
      {/* Optional Branded Banner or Tagline */}
      <div className="hidden md:flex w-1/2 justify-center items-center flex-col text-center p-6">
        <img
          src={assets.logo}
          alt="seller-banner"
          className="max-w-[780px] max-h-[300px] object-contain mb-4"
        />
        <h3 className="text-xl font-semibold text-primary">
          GroMart Seller Panel
        </h3>
        <p className="text-gray-500 text-sm mt-1">Manage your inventory and orders with ease.</p>
      </div>

      {/* Login Form */}
      <form
        onSubmit={onSubmitHandler}
        className="flex flex-col gap-5 items-start p-8 py-10 w-full max-w-md rounded-xl shadow-xl border border-gray-200 bg-white"
      >
        <p className="text-2xl font-medium text-center w-full">
          <span className="text-primary">Seller</span> Login
        </p>

        {/* Email Field */}
        <div className="w-full">
          <label className="text-sm">Email</label>
          <input
            type="email"
            placeholder="seller@gromart.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoFocus
            className={`w-full mt-1 p-2 border rounded-md outline-primary transition-all duration-200 ${
              error ? 'border-red-400' : 'border-gray-300'
            } focus:ring-2 focus:ring-primary/30`}
          />
        </div>

        {/* Password Field */}
        <div className="w-full relative">
          <label className="text-sm">Password</label>
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={`w-full mt-1 p-2 pr-10 border rounded-md outline-primary transition-all duration-200 ${
              error ? 'border-red-400' : 'border-gray-300'
            } focus:ring-2 focus:ring-primary/30`}
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-[38px] text-gray-500 cursor-pointer select-none"
          >
            {showPassword ? '🙈' : '👁️'}
          </span>
        </div>

        {/* Error Message */}
        {error && (
          <p className="text-red-500 text-sm mt-1 w-full">{error}</p>
        )}

        {/* Remember Me */}
        <div className="flex items-center gap-2 mt-1">
          <input
            type="checkbox"
            id="remember"
            checked={remember}
            onChange={() => setRemember(!remember)}
            className="accent-primary cursor-pointer"
          />
          <label htmlFor="remember" className="text-sm cursor-pointer">Remember me</label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full mt-4 bg-primary hover:bg-primary-dull text-white font-medium py-2 rounded-md transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default SellerLogin;
