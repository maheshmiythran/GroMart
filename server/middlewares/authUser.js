import jwt from 'jsonwebtoken';

const authUser = async (req, res, next) => {
  try {
    const { userToken } = req.cookies;

    // Check for token in headers if not in cookies
    let token = userToken;
    if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No authentication token provided'
      });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = { id: decoded.id };

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
