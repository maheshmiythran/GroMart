import jwt from "jsonwebtoken";

// Login Seller : /api/seller/login



export const sellerLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (password === process.env.SELLER_PASSWORD && email === process.env.SELLER_EMAIL) {
            const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1d' });

            res.cookie('sellerToken', token, {
            httpOnly: true,
            secure: true, // true in production
            sameSite: 'None',
            maxAge: 1 * 24 * 60 * 60 * 1000
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
    return res.json({ success: true , message: 'Seller is Authenticated' });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Seller Logout : /api/seller/logout

export const sellerLogout = async (req, res) => {
    try {
        res.clearCookie('sellerToken', {
            httpOnly: true, // Secure cookies are only sent over HTTPS
            secure: process.env.NODE_ENV === 'production', // Set to true in production
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict', // Adjust based on your environment
        });
        return res.json({ success: true, message: 'Seller Logged out Successful' });
    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: error.message });
    }   
};