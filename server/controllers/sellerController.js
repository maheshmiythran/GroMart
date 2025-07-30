import jwt from "jsonwebtoken";

// Login Seller : /api/seller/login



export const sellerLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (password === process.env.SELLER_PASSWORD && email === process.env.SELLER_EMAIL) {
            const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '7d' });

            res.cookie('sellerToken', token, {
            httpOnly: true,
            secure: true,         // 🚨 This breaks on localhost if you're not using HTTPS
            sameSite: 'none',     // 🚨 Also needs HTTPS
            maxAge: 7 * 24 * 60 * 60 * 1000
          });

            return res.json({ success: true, message: 'Logged In' });
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
      return res.json({ success: true, message: 'Seller is authenticated' });
  } catch (error) {
    console.error('Internal Server Error:', error.message);
    return res.json({ success: false, message: 'Internal Server Error' });
  }
};

// Seller Logout : /api/seller/logout

export const sellerLogout = async (req, res) => {
    try {
        res.clearCookie('sellerToken', {
        httpOnly: true,
        secure: false,
        sameSite: 'lax'
      });
        return res.json({ success: true, message: 'Seller Logged out Successful' });
    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: error.message });
    }   
};