const express = require('express');
const router = express.Router();

const {
    createBlog,
    getBlogs,
    getBlogById,
    updateBlog,
    deleteBlog
} = require('../controllers/blogController');

const protect = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');


// public
router.get('/', getBlogs);
router.get('/:id', getBlogById);

//admin
router.post('/', protect, adminOnly, createBlog);
router.put('/:id', protect, adminOnly, updateBlog);
router.delete('/:id', protect, adminOnly, deleteBlog);

module.exports = router;