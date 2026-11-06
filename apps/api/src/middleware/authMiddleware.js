const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');
const memoryStore = require('../models/memoryStore');

/**
 * Authentication Middleware: Protect Routes
 * Extracts JWT Bearer token from Authorization header and attaches user to request.
 * Operates in Dual-Mode (MongoDB when online, memoryStore fallback when offline).
 */
async function protect(req, res, next) {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Access Denied: Authentication token is missing.'
        });
    }

    try {
        const secret = process.env.JWT_SECRET || 'arts_gallery_super_secret_jwt_key_2026';
        const decoded = jwt.verify(token, secret);

        const isMongoConnected = mongoose.connection.readyState === 1;

        if (isMongoConnected) {
            const user = await User.findById(decoded.id).select('-password');
            if (!user) {
                return res.status(401).json({ success: false, message: 'Authentication failed: User no longer exists.' });
            }
            req.user = user;
        } else {
            const user = memoryStore.findUserById(decoded.id) || memoryStore.findUserByEmail(decoded.email);
            if (!user) {
                return res.status(401).json({ success: false, message: 'Authentication failed: User no longer exists.' });
            }
            const { password, ...safeUser } = user;
            req.user = safeUser;
        }

        next();
    } catch (err) {
        return res.status(401).json({
            success: false,
            message: 'Authentication failed: Token is invalid or expired.'
        });
    }
}

/**
 * Authorization Middleware: Role-Based Access Control (RBAC) Guard
 * Restricts access to specified roles.
 * @param  {...string} roles - Permitted roles ('admin', 'artist', 'customer', 'visitor')
 */
function authorize(...roles) {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `Forbidden: Role [${req.user ? req.user.role : 'unauthenticated'}] does not have permission to access this resource.`
            });
        }
        next();
    };
}

module.exports = { protect, authorize };
