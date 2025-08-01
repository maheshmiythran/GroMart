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
      req.user = decoded;
      next();
    } catch (error) {
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
