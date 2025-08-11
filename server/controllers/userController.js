import User from "../models/User.js"
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Register User : /api/user/register
export const register = async (req, res)=>{
    try {
        const {name,email,password} = req.body;
        if (!name || !email || !password){
            return res.json({success: false, message: 'Missing Details'})
        }

        const existingUser = await User.findOne({email})
        if(existingUser)
            return res.json({success: false, message: 'User already Exists'})  
        const hashedPassword = await bcrypt.hash(password,10)
        const user = await User.create({
            name,
            email,
            password: hashedPassword
        })
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '7d'})

        const isProduction = process.env.NODE_ENV === 'production';

        res.cookie("userToken", token, {
            httpOnly: true,
            secure: isProduction,           // only true in prod
            sameSite: isProduction ? 'None' : 'Lax',  // more relaxed in dev
            path: '/',
            maxAge: 1 * 24 * 60 * 60 * 1000
        });


        return res.json({success: true, user: {email: user.email, name: user.name}})

    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message})
        
        
    }
}


// Login User : /api/user/login
export const login = async (req, res)=>{
    try {
        const {email, password} = req.body;
        if (!email || !password)
            return res.json({success: false, message: 'Email and password required'});
        const user = await User.findOne({email});
        if (!user){
            return res.json({success: false, message: 'Invalid Email or Password'});
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch){
            return res.json({success: false, message: 'Invalid Email or Password'});

        }

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '1d'})

        const isProduction = process.env.NODE_ENV === 'production';

        res.cookie("userToken", token, {
            httpOnly: true,
            secure: isProduction,           // only true in prod
            sameSite: isProduction ? 'None' : 'Lax',  // more relaxed in dev
            path: '/',
            maxAge: 1 * 24 * 60 * 60 * 1000
        });

        return res.json({success: true, user: {email: user.email, name: user.name}})
    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message})
        
    }
}


// Check Auth : /api/user/is-auth

export const isAuth = async (req, res) => {
  try {
    req.user = { _id: decoded.id };

    if (!userId) {
      console.error('User ID not found in request');
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const user = await User.findById(userId).select('-password'); // Exclude password

    if (!user) {
      console.error('User not found in database');
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.json({ success: true, user });
  } catch (error) {
    console.error('Error in isAuth:', error.message);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

// Logout User : /api/user/logout
export const logout = async (req, res) => {
  try {
    const isProduction = process.env.NODE_ENV === 'production';

    res.clearCookie("userToken", {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'None' : 'Lax',
      path: '/'
    });

    return res.json({ success: true, message: 'Logged out' });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
