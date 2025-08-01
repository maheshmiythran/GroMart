import jwt from 'jsonwebtoken';

const authSeller = async (req, res, next) => {
  try {
    const { sellerToken } = req.cookies;

    if (!sellerToken) {
      console.warn('Unauthorized: No token provided');
      return res.status(401).json({ success: false, message: 'Unauthorized: No token provided' });
    }

    try {
      const decoded = jwt.verify(sellerToken, process.env.JWT_SECRET);
      
      if (decoded.email === process.env.SELLER_EMAIL) {
        req.seller = decoded;
        next();
      } else {
        return res.status(403).json({ success: false, message: 'Not authorized as seller' });
      }
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        console.warn('Seller token expired');
        res.clearCookie('sellerToken');
        return res.status(401).json({ success: false, message: 'Session expired. Please log in again.' });
      }

      console.error('Authentication error:', error.message);
      res.clearCookie('sellerToken');
      return res.status(401).json({ success: false, message: 'Invalid token' });
    }
  } catch (error) {
    console.error('Server error:', error.message);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export default authSeller;
