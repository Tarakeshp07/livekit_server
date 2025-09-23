const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// GET /api/users - Get all users
const getAllUsers = async (req, res) => {
    try {
        const { page = 1, limit = 10, role, institutionName } = req.query;

        // Build filter object
        const filter = {};
        if (role) filter.role = role;
        if (institutionName) filter.institutionName = new RegExp(institutionName, 'i');

        const users = await User.find(filter)
            .select('-password') // Exclude password from response
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ createdAt: -1 });

        const total = await User.countDocuments(filter);

        res.json({
            success: true,
            data: users,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
                totalUsers: total,
                hasNext: page < Math.ceil(total / limit),
                hasPrev: page > 1
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching users',
            error: error.message
        });
    }
};

// GET /api/users/:id - Get user by ID
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            data: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching user',
            error: error.message
        });
    }
};

// POST /api/users/login - User login
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Check password
        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Return user data and token
        res.json({
            success: true,
            data: {
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    role: user.role
                },
                token: `Bearer ${token}`
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error during login',
            error: error.message
        });
    }
};

// POST /api/users - Create new user (Signup)
const createUser = async (req, res) => {
    try {
        const {
            username,
            password,
            role = 'user',
            age,
            healthConditions = [],
            sleepData = 0,
            institutionName,
            email
        } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({
            $or: [{ email }, { username }]
        });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: existingUser.email === email ? 'Email already exists' : 'Username already exists'
            });
        }

        const user = new User({
            username,
            password,
            role,
            age,
            healthConditions,
            sleepData,
            institutionName,
            email
        });

        const savedUser = await user.save();

        // Remove password from response
        const userResponse = savedUser.toObject();
        delete userResponse.password;

        // Generate JWT token
        const token = jwt.sign(
            { userId: savedUser._id },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({
            success: true,
            message: 'User created successfully',
            data: {
                user: userResponse,
                token: `Bearer ${token}`
            }
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors
            });
        }

        res.status(500).json({
            success: false,
            message: 'Error creating user',
            error: error.message
        });
    }
};

// PUT /api/users/:id - Update user
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = { ...req.body };

        // Remove password from update data if present (handle separately)
        let passwordUpdate = null;
        if (updateData.password) {
            passwordUpdate = updateData.password;
            delete updateData.password;
        }

        // Hash new password if provided
        if (passwordUpdate) {
            const saltRounds = 12;
            updateData.password = await bcrypt.hash(passwordUpdate, saltRounds);
        }

        const user = await User.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            message: 'User updated successfully',
            data: user
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors
            });
        }

        res.status(500).json({
            success: false,
            message: 'Error updating user',
            error: error.message
        });
    }
};

// DELETE /api/users/:id - Delete user
const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            message: 'User deleted successfully',
            data: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting user',
            error: error.message
        });
    }
};

// GET /api/users/search - Search users
const searchUsers = async (req, res) => {
    try {
        const { q, page = 1, limit = 10 } = req.query;

        if (!q) {
            return res.status(400).json({
                success: false,
                message: 'Search query is required'
            });
        }

        const searchRegex = new RegExp(q, 'i');
        const filter = {
            $or: [
                { username: searchRegex },
                { email: searchRegex },
                { institutionName: searchRegex }
            ]
        };

        const users = await User.find(filter)
            .select('-password')
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ createdAt: -1 });

        const total = await User.countDocuments(filter);

        res.json({
            success: true,
            data: users,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
                totalUsers: total,
                hasNext: page < Math.ceil(total / limit),
                hasPrev: page > 1
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error searching users',
            error: error.message
        });
    }
};

// GET /api/users/stats - Get user statistics
const getUserStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const adminUsers = await User.countDocuments({ role: 'admin' });
        const regularUsers = await User.countDocuments({ role: 'user' });

        // Get users by institution
        const usersByInstitution = await User.aggregate([
            {
                $group: {
                    _id: '$institutionName',
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } },
            { $limit: 10 }
        ]);

        // Get average age
        const avgAgeResult = await User.aggregate([
            { $group: { _id: null, avgAge: { $avg: '$age' } } }
        ]);

        res.json({
            success: true,
            data: {
                totalUsers,
                adminUsers,
                regularUsers,
                usersByInstitution,
                averageAge: avgAgeResult[0]?.avgAge || 0
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching user statistics',
            error: error.message
        });
    }
};

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    searchUsers,
    getUserStats,
    login
};
