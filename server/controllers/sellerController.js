import jwt from "jsonwebtoken";

// Login Seller : /api/seller/login



export const sellerLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (password === process.env.SELLER_PASSWORD && email === process.env.SELLER_EMAIL) {
            const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '7d' });

            res.cookie('sellerToken', token, {
            httpOnly: true,
            secure: true, // true in production
            sameSite: 'None',
            maxAge: 7 * 24 * 60 * 60 * 1000
            });

            return res.json({ success: true, message: 'Login In' });
        }

        else {
            return res.json({ success: false, message: 'Invalid Credentials' });
        }
    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: error.message });

    }

}

// Seller Auth : /api/seller/is-auth

export const isSellerAuth = async (req, res) => {
  try {
    const { sellerToken } = req.cookies;

    if (!sellerToken) {
      console.error('No token provided');
      return res.status(401).json({ success: false, message: 'Unauthorized: No token provided' });
    }

    try {
      const decoded = jwt.verify(sellerToken, process.env.JWT_SECRET);
      console.log('Decoded Token:', decoded);

      if (decoded.email === process.env.SELLER_EMAIL) {
        return res.json({ success: true, message: 'Seller is Authenticated' });
      } else {
        console.error('Invalid email in token');
        return res.status(403).json({ success: false, message: 'Not authorized' });
      }
    } catch (error) {
      console.error('JWT Verification Error:', error.message);
      return res.status(401).json({ success: false, message: 'Invalid token' });
    }
  } catch (error) {
    console.error('Internal Server Error:', error.message);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

// Seller Logout : /api/seller/logout

export const sellerLogout = async (req, res) => {
    try {
        res.clearCookie('sellerToken', {
            httpOnly: true, // Secure cookies are only sent over HTTPS
            secure: process.env.NODE_ENV === 'production', // Set to true in production
            sameSite: 'None', // Adjust based on your environment
        });
        return res.json({ success: true, message: 'Seller Logged out Successful' });
    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: error.message });
    }   
};