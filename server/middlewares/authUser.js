import jwt from 'jsonwebtoken';

const authUser = async (req, res, next) => {
  try {
    const { userToken } = req.cookies;

    if (!userToken) {
      return res.status(401).json({ 
        success: false, 
        message: 'No authentication token provided' 
      });
    }

    try {
      const decoded = jwt.verify(userToken, process.env.JWT_SECRET);
      req.user = { _id: decoded.id }; // or decoded._id if that’s how you stored it

      next();
    } catch (error) {
      // If token is expired
      if (error.name === 'TokenExpiredError') {
        // Clear the cookie
        const isProduction = process.env.NODE_ENV === 'production';
        res.clearCookie('userToken', {
          httpOnly: true,
          secure: isProduction,
          sameSite: isProduction ? 'None' : 'Lax',
          path: '/', // Make sure this matches how the cookie was set
        });

        return res.status(401).json({ 
          success: false, 
          message: 'Session expired. Please log in again.' 
        });
      }

      return res.status(401).json({ 
        success: false, 
        message: 'Invalid token' 
      });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
};

export default authUser;
