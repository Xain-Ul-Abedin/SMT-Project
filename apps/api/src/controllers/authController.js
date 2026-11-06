const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');
const memoryStore = require('../models/memoryStore');

function generateTokenPayload(user) {
    const secret = process.env.JWT_SECRET || 'arts_gallery_super_secret_jwt_key_2026';
    const id = user._id || user.id;
    return jwt.sign(
        { id, role: user.role, email: user.email },
        secret,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
}

/**
 * Register User
 * POST /api/v1/auth/register
 */
exports.register = async (req, res) => {
    try {
        const { name, email, password, role, artistProfile } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: 'Please provide name, email, and password.' });
        }

        const isMongoConnected = mongoose.connection.readyState === 1;

        if (isMongoConnected) {
            const existing = await User.findOne({ email: email.toLowerCase() });
            if (existing) {
                return res.status(409).json({ success: false, message: 'An account with this email already exists.' });
            }

            const user = await User.create({
                name,
                email: email.toLowerCase(),
                password,
                role: role || 'customer',
                artistProfile: artistProfile || {}
            });

            const token = user.generateToken();

            return res.status(201).json({
                success: true,
                message: 'Account registered successfully.',
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    avatarUrl: user.avatarUrl,
                    artistProfile: user.artistProfile
                }
            });
        } else {
            // MemoryStore Dual-Mode Fallback
            const existing = memoryStore.findUserByEmail(email);
            if (existing) {
                return res.status(409).json({ success: false, message: 'An account with this email already exists.' });
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const user = memoryStore.addUser({
                name,
                email: email.toLowerCase(),
                password: hashedPassword,
                role: role || 'customer',
                avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
                artistProfile: artistProfile || {}
            });

            const token = generateTokenPayload(user);

            return res.status(201).json({
                success: true,
                message: 'Account registered successfully.',
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    avatarUrl: user.avatarUrl,
                    artistProfile: user.artistProfile
                }
            });
        }
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

/**
 * Login User
 * POST /api/v1/auth/login
 */
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Please provide email and password.' });
        }

        const isMongoConnected = mongoose.connection.readyState === 1;

        if (isMongoConnected) {
            const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
            if (!user) {
                return res.status(401).json({ success: false, message: 'Invalid credentials.' });
            }

            const isMatch = await user.matchPassword(password);
            if (!isMatch) {
                return res.status(401).json({ success: false, message: 'Invalid credentials.' });
            }

            const token = user.generateToken();

            return res.status(200).json({
                success: true,
                message: 'Authentication successful.',
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    avatarUrl: user.avatarUrl,
                    artistProfile: user.artistProfile
                }
            });
        } else {
            // MemoryStore Dual-Mode Fallback
            const user = memoryStore.findUserByEmail(email);
            if (!user) {
                return res.status(401).json({ success: false, message: 'Invalid credentials.' });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ success: false, message: 'Invalid credentials.' });
            }

            const token = generateTokenPayload(user);

            return res.status(200).json({
                success: true,
                message: 'Authentication successful.',
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    avatarUrl: user.avatarUrl,
                    artistProfile: user.artistProfile
                }
            });
        }
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

/**
 * Get Current Authenticated Profile
 * GET /api/v1/auth/me
 */
exports.getMe = async (req, res) => {
    try {
        return res.status(200).json({
            success: true,
            user: req.user
        });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};
