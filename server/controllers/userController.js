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
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '1d'})

        res.cookie("token", token, {
        httpOnly: true,
        secure: true, // Must be true in production (https)
        sameSite: 'None', // VERY IMPORTANT for cross-origin cookies
        maxAge: 1 * 24 * 60 * 60 * 1000, // 1 week
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

        res.cookie("token", token, {
        httpOnly: true,
        secure: true, // Must be true in production (https)
        sameSite: 'None', // VERY IMPORTANT for cross-origin cookies
        maxAge: 1 * 24 * 60 * 60 * 1000, // 1 week
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
    const userId = req.user.id; // ✅ Comes from JWT middleware

    if (!userId) {
      return res.json({ success: false, message: 'User not found' });
    }

    const user = await User.findById(userId).select('-password'); // only hide password

    if (!user) {
      return res.json({ success: false, message: 'User not found' });
    }

    return res.json({ success: true, user });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Logout User : /api/user/logout
export const logout = async (req, res) => {
    try {
        res.clearCookie('token', '', {
            httpOnly: true,
            secure: true, // Set to true in production
            sameSite: 'None',
        });
        return res.json({success: true, message: 'Logged out'});
    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message})
    }       
}