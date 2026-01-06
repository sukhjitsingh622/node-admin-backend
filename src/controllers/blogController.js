const Blog = require('../models/Blog');
const createLog = require('../utils/createLog');

//create blog
exports.createBlog = async (req, res) => {
    try {
        const { title, content, image } = req.body;
        console.log({
            title,
            content,
            image,
            author: req.user._id
        });

        const blog = await Blog.create({
            title,
            content,
            image,
            author: req.user._id
        });

        await createLog({
            user: req.user._id,
            action: "CREATE_BLOG",
            description: `CREATED BLOG: ${title}`,
            ip: req.ip
        });
        res.status(201).json(blog.toObject());
    } catch (error) {
        res.status(500).json({ message: error });
        // res.status(500).json({ message: "Blog is not created, please try later" });
    }
}

/* ========== GET ALL BLOGS ========== */
// exports.getBlogs = async (req, res) => {
//     try {
//         if (!req.user) {
//             return res.status(401).json({ message: "Unauthorized" });
//         }

//         const blogs =
//             req.user.role === "admin"
//                 ? await Blog.find().sort({ createdAt: -1 })
//                 : await Blog.find({ author: req.user._id }).sort({ createdAt: -1 });

//         res.json(blogs);
//     } catch (err) {
//         res.status(500).json({ message: "Server error" });
//     }
// };

exports.getBlogs = async (req, res) => {
    try {
        console.log(req.user);
        const blogs = await Blog.find()
            .populate('author', 'name email')
            .sort({ createdAt: -1 })
            .lean();

        res.status(200).json(blogs);
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Something went wrong, please try later" })
    }
}

/* ========== GET SINGLE BLOG ========== */
exports.getBlogById = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id).populate('author', 'name email').lean();

        if (!blog) {
            res.status(404).json({ message: "Blog not found." });
        }

        res.status(200).json(blog);
    } catch (error) {
        res.status(500).json({ message: "Something went wrong, please try later" })
    }
}

/* ========== UPDATE BLOG ========== */
exports.updateBlog = async (req, res) => {
    try {
        const { title, content, avatar, isPublished } = req.body;

        const blog = await Blog.findByIdAndUpdate(
            req.params.id,
            { title, content, avatar, isPublished },
            { new: true, runValidators: true }
        );

        if (!blog) {
            res.status(404).json({ message: "Blog not found, try later." });
        }
        await createLog({
            user: req.user._id,
            action: 'UPDATE_BLOG',
            description: `Updated blog: ${blog.title}`,
            ip: req.ip
        });

        res.json(blog);

    } catch (error) {
        res.status(500).json({ message: "Something went wrong, please try later" })
    }
}

/* ========== DELETE BLOG ========== */
exports.deleteBlog = async (req, res) => {
    try {
        const blog = await Blog.findByIdAndDelete(req.params.id);

        if (!blog) {
            res.status(404).json({ message: "Blog not found, try later." });
        }
        await createLog({
            user: req.user._id,
            action: 'DELETE_BLOG',
            description: `Deleted blog: ${blog.title}`,
            ip: req.ip
        });

        res.status(200).json({ message: "Blog deleted successfully." });

    } catch (error) {
        res.status(500).json({ message: "Something went wrong, please try later" })
    }
}