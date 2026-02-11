import User from "../models/User.js"
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Register User : /api/user/register
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.json({ success: false, message: 'Missing Details' })
    }

    const existingUser = await User.findOne({ email })
    if (existingUser)
      return res.json({ success: false, message: 'User already Exists' })
    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await User.create({
      name,
      email,
      password: hashedPassword
    })
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })

    const isProduction = process.env.NODE_ENV === 'production';

    res.cookie("userToken", token, {
      httpOnly: true,
      secure: isProduction,           // only true in prod
      sameSite: isProduction ? 'None' : 'Lax',  // more relaxed in dev
      path: '/',
      maxAge: 1 * 24 * 60 * 60 * 1000
    });


    return res.json({ success: true, user: { email: user.email, name: user.name } })

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message })


  }
}


// Login User : /api/user/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.json({ success: false, message: 'Email and password required' });
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: 'Invalid Email or Password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: 'Invalid Email or Password' });

    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' })

    const isProduction = process.env.NODE_ENV === 'production';

    res.cookie("userToken", token, {
      httpOnly: true,
      secure: isProduction,           // only true in prod
      sameSite: isProduction ? 'None' : 'Lax',  // more relaxed in dev
      path: '/',
      maxAge: 1 * 24 * 60 * 60 * 1000
    });

    return res.json({ success: true, user: { email: user.email, name: user.name } })
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message })

  }
}


// Check Auth : /api/user/is-auth

export const isAuth = async (req, res) => {
  try {
    const userId = req.user?.id; // from authUser middleware

    if (!userId) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const user = await User.findById(userId).select('-password'); // exclude password
    if (!user) {
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

// Get all users (Seller only)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json({ success: true, users });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Delete User (Seller only)
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.body;
    const user = await User.findByIdAndDelete(id);
    if (user) {
      res.json({ success: true, message: 'User deleted successfully' });
    } else {
      res.json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Update User (Seller only)
export const updateUser = async (req, res) => {
  try {
    const { id, name, email } = req.body;
    const user = await User.findByIdAndUpdate(id, { name, email }, { new: true });
    if (user) {
      res.json({ success: true, message: 'User updated successfully' });
    } else {
      res.json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Update User Profile (User itself)
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, phone, password, newPassword } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.json({ success: false, message: 'User not found' });
    }

    if (name) user.name = name;
    if (phone) user.phone = phone;

    if (password && newPassword) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.json({ success: false, message: 'Incorrect current password' });
      }
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
    }

    await user.save();
    res.json({ success: true, message: 'Profile updated successfully' });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Delete My Account (User itself)
export const deleteMyAccount = async (req, res) => {
  try {
    const userId = req.user.id;

    // Optional: Delete associated addresses/orders if needed. 
    // For now, just deleting the user.

    await User.findByIdAndDelete(userId);

    // Clear cookie
    const isProduction = process.env.NODE_ENV === 'production';
    res.clearCookie("userToken", {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'None' : 'Lax',
      path: '/'
    });

    res.json({ success: true, message: 'Account deleted successfully' });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
