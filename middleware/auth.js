const jwt = require('jsonwebtoken');
const { findUserByUsername } = require('../model/User');

// Secret key for JWT (in production, this should be in environment variables)
const JWT_SECRET = 'your-secret-key-here';
const JWT_EXPIRES_IN = '1h';

// Authentication middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Token não informado ou inválido'
        });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({
                    success: false,
                    message: 'Token não informado ou inválido'
                });
            }
            return res.status(401).json({
                success: false,
                message: 'Token não informado ou inválido'
            });
        }

        // Verify user still exists
        const foundUser = findUserByUsername(user.username);
        if (!foundUser) {
            return res.status(401).json({
                success: false,
                message: 'Token não informado ou inválido'
            });
        }

        // Add user info including id to req.user
        req.user = {
            id: foundUser.username, // Using username as ID for simplicity
            username: user.username
        };
        next();
    });
};

// Generate JWT token
const generateToken = (user) => {
    return jwt.sign(
        { username: user.username },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
    );
};

module.exports = {
    authenticateToken,
    generateToken,
    JWT_SECRET
};