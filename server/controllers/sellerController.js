import jwt from "jsonwebtoken";

// Login Seller : /api/seller/login



export const sellerLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (password === process.env.SELLER_PASSWORD && email === process.env.SELLER_EMAIL) {
      const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '30d' });

      // Always set these cookie options regardless of environment
      const cookieOptions = {
        httpOnly: true,
        secure: true,  // Always set to true
        sameSite: 'None',  // Always set to None for cross-origin
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        path: '/'
      };

      // Use these options for both setting and clearing cookies
      res.cookie('sellerToken', token, cookieOptions);
      return res.json({ success: true, token, message: 'Login successful' });
    } else {
      return res.json({ success: false, message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Login error:', error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Seller Auth : /api/seller/is-auth

export const isSellerAuth = async (req, res) => {
  try {
    // req.seller is set by the authSeller middleware
    if (!req.seller) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated'
      });
    }

    return res.json({
      success: true,
      seller: { email: req.seller.email },
      message: 'Seller is authenticated'
    });
  } catch (error) {
    console.error('Auth check error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    });
  }
};

// Seller Logout : /api/seller/logout

export const sellerLogout = async (req, res) => {
  try {
    // Use the same cookie options as login to ensure proper clearing
    const cookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: 'None',
      path: '/',
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    };

    // Use these options for both setting and clearing cookies
    res.clearCookie('sellerToken', cookieOptions);
    return res.json({ success: true, message: 'Seller Logged out Successfully' });
  } catch (error) {
    console.error('Logout error:', error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};