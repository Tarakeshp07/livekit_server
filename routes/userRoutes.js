const express = require('express');
const router = express.Router();
const {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    searchUsers,
    getUserStats,
    login
} = require('../controllers/userController');

// Validation middleware
const validateUser = (req, res, next) => {
    const { username, password, age, institutionName, email } = req.body;

    if (!username || !password || !age || !institutionName || !email) {
        return res.status(400).json({
            success: false,
            message: 'Missing required fields: username, password, age, institutionName, email'
        });
    }

    if (password.length < 6) {
        return res.status(400).json({
            success: false,
            message: 'Password must be at least 6 characters long'
        });
    }

    if (age < 0 || age > 150) {
        return res.status(400).json({
            success: false,
            message: 'Age must be between 0 and 150'
        });
    }

    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({
            success: false,
            message: 'Please provide a valid email address'
        });
    }

    next();
};

// Validation middleware for updates
const validateUserUpdate = (req, res, next) => {
    const { age, email, password } = req.body;

    if (age !== undefined && (age < 0 || age > 150)) {
        return res.status(400).json({
            success: false,
            message: 'Age must be between 0 and 150'
        });
    }

    if (email !== undefined) {
        const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid email address'
            });
        }
    }

    if (password !== undefined && password.length < 6) {
        return res.status(400).json({
            success: false,
            message: 'Password must be at least 6 characters long'
        });
    }

    next();
};

// GET /api/users - Get all users with pagination and filtering
router.get('/', getAllUsers);

// GET /api/users/search - Search users
router.get('/search', searchUsers);

// GET /api/users/stats - Get user statistics
router.get('/stats', getUserStats);

// GET /api/users/:id - Get user by ID
router.get('/:id', getUserById);

// POST /api/users/signup - User signup
router.post('/signup', validateUser, createUser);

// POST /api/users/login - User login
router.post('/login', login);

// PUT /api/users/:id - Update user
router.put('/:id', validateUserUpdate, updateUser);

// DELETE /api/users/:id - Delete user
router.delete('/:id', deleteUser);

module.exports = router;
