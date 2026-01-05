const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const { adminOnly } = require("../middleware/adminMiddleware");

const {
    getUsers,
    getUserById,
    updateUser,
    deleteUser
} = require('../controllers/userController');


// Only admins can access this route
router.get('/users', protect, adminOnly, getUsers);

router.get('/', protect, adminOnly, getUsers);
router.get('/:id', protect, adminOnly, getUserById);
router.put('/:id', protect, adminOnly, updateUser);
router.delete('/:id', protect, adminOnly, deleteUser);

module.exports = router;