import jwt from 'jsonwebtoken';

const authSeller = async (req, res, next) => {
  const { sellerToken } = req.cookies;

  if (!sellerToken) {
    console.error('Unauthorized: No token provided');
    return res.status(401).json({ success: false, message: 'Unauthorized: No token provided' });
  }

  try {
    const tokenDecode = jwt.verify(sellerToken, process.env.JWT_SECRET);
    if (tokenDecode.email === process.env.SELLER_EMAIL) {
      next();
    } else {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

export default authSeller;