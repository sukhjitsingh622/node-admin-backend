const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    // 1️⃣ Get token from cookie
    if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
    }
    const authHeader = req.headers.authorization || '';
    if (authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, token missing' });
    }

    try {
        // 2️⃣ Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 3️⃣ Attach user to request
        req.user = await User.findById(decoded.id).select('-password');

        next();
    } catch (error) {
        console.error('AUTH ERROR 👉', error.message);

        res.status(401).json({ message: 'Not authorized, token invalid' });
    }
};

module.exports = protect;