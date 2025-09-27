import React, { useEffect, useRef, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { toast } from 'react-hot-toast';

const Login = () => {
  const { setShowUserLogin, setUser, axios, navigate, fetchUser } = useAppContext();

  const [state, setState] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [animateIn, setAnimateIn] = useState(false);
  const [animateOut, setAnimateOut] = useState(false);

  const modalRef = useRef(null);

  const isMismatch = state === 'register' && confirmPassword && password !== confirmPassword;
  const isMatch = state === 'register' && confirmPassword && password === confirmPassword;

  useEffect(() => {
    setAnimateIn(true);

    const handleEscape = (e) => {
      if (e.key === 'Escape') handleClose();
    };

    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) handleClose();
    };

    document.addEventListener('keydown', handleEscape);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleClose = () => {
    setAnimateOut(true);
    setTimeout(() => {
      setShowUserLogin(false);
    }, 300);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (state === 'register' && password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const { data } = await axios.post(
        `/api/user/${state}`,
        { name, email, password },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json"
          }
        }
      );

      if (data.success) {
        setTimeout(async () => {
          await fetchUser();
          navigate('/');
          setShowUserLogin(false);
          toast.success(
            state === 'register'
              ? 'Registered successfully!'
              : 'Logged in successfully!'
          );
        }, 50);
      } else {
        toast.error(data.message || "Something went wrong");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        error.message ||
        "Something went wrong"
      );
    }
  };

  return (
    <div
      id="login-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm overflow-y-auto"
    >
      <div
        ref={modalRef}
        id="login-modal"
        className={`bg-white w-[90%] max-w-md p-8 rounded-xl shadow-xl relative transform transition-all duration-300 ${animateIn && !animateOut
          ? 'opacity-100 scale-100 translate-y-0'
          : 'opacity-0 scale-95 translate-y-2'
          }`}
      >
        {/* Close Button */}
        <button
          id="close-button"
          className="absolute top-3 right-4 text-gray-400 hover:text-gray-600 text-2xl"
          onClick={handleClose}
        >
          &times;
        </button>

        <h2 id="form-title" className="text-center text-2xl font-semibold mb-6 text-[#4fbf8b]">
          {state === 'login' ? 'Login' : 'Sign Up'}
        </h2>

        <form id="auth-form" onSubmit={handleSubmit} className="space-y-4">
          {state === 'register' && (
            <div>
              <label className="text-sm" htmlFor="name-input">Name</label>
              <input
                id="name-input"
                type="text"
                placeholder="Your name"
                className="w-full p-2 mt-1 border border-gray-300 rounded-md outline-[#4fbf8b]"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}

          <div>
            <label className="text-sm" htmlFor="email-input">Email</label>
            <input
              id="email-input"
              type="email"
              placeholder="you@GroMart.com"
              className="w-full p-2 mt-1 border border-gray-300 rounded-md outline-[#4fbf8b]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div className="relative">
            <label className="text-sm" htmlFor="password-input">Password</label>
            <input
              id="password-input"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter New Password"
              className="w-full p-2 mt-1 border border-gray-300 rounded-md outline-[#4fbf8b] pr-10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              id="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[38px] cursor-pointer text-gray-500"
            >
              {showPassword ? '🙈' : '👁️'}
            </span>
          </div>

          {/* Confirm Password */}
          {state === 'register' && (
            <div className="relative">
              <label className="text-sm" htmlFor="confirm-password-input">Confirm Password</label>
              <input
                id="confirm-password-input"
                type={showConfirm ? 'text' : 'password'}
                placeholder="Re-Enter New Password"
                className={`w-full p-2 mt-1 rounded-md outline-[#4fbf8b] pr-10 ${isMismatch
                  ? 'border border-red-400'
                  : isMatch
                    ? 'border border-green-400'
                    : 'border border-gray-300'
                  }`}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <span
                id="toggle-confirm-password"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-[38px] cursor-pointer text-gray-500"
              >
                {showConfirm ? '🙈' : '👁️'}
              </span>
              {isMismatch && (
                <p id="password-mismatch-warning" className="text-red-500 text-sm mt-1">
                  Passwords do not match
                </p>
              )}
            </div>
          )}

          <p id="switch-auth-text" className="text-sm">
            {state === 'login' ? (
              <>
                Don’t have an account?{' '}
                <span
                  id="switch-to-register"
                  className="text-[#4fbf8b] cursor-pointer hover:underline"
                  onClick={() => setState('register')}
                >
                  Sign up
                </span>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <span
                  id="switch-to-login"
                  className="text-[#4fbf8b] cursor-pointer hover:underline"
                  onClick={() => setState('login')}
                >
                  Log in
                </span>
              </>
            )}
          </p>

          <button
            id="submit-button"
            type="submit"
            disabled={state === 'register' && isMismatch}
            className="w-full py-2 px-4 bg-[#4fbf8b] hover:bg-[#44ae7c] text-white font-medium rounded-md transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {state === 'login' ? 'Login' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;

