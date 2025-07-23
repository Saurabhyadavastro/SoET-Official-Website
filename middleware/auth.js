const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

module.exports = async (req, res, next) => {
    try {
        // Get token from header
        const token = req.header('Authorization');

        // Check if no token
        if (!token || !token.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'No token, authorization denied'
            });
        }

        // Extract token from Bearer string
        const actualToken = token.split(' ')[1];

        // Verify token
        const decoded = jwt.verify(actualToken, process.env.JWT_SECRET);

        // Check if admin exists and is active
        const admin = await Admin.findById(decoded.admin.id);
        if (!admin) {
            return res.status(401).json({
                success: false,
                message: 'Token is not valid - admin not found'
            });
        }

        if (!admin.isActive) {
            return res.status(401).json({
                success: false,
                message: 'Account is deactivated'
            });
        }

        // Add admin to request
        req.admin = decoded.admin;
        next();

    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Token is not valid'
            });
        } else if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token has expired'
            });
        }

        console.error('Auth middleware error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error in authentication'
        });
    }
};
