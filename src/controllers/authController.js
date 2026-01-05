const jwt = require('jsonwebtoken');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const createLog = require('../utils/createLog');

/**
 * @desc Register new user
 * @route POST /api/auth/register
 * @access Public
 */

exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        //validate inputs
        if (!name || !email || !password) {
            return res.status(400).json({
                message: "All fields are required."
            });
        }

        //check if user already existed.
        const existedUser = await User.findOne({ email });
        if (existedUser) {
            return res.status(409).json({
                message: "User already exists."
            });
        }

        //Create User
        const user = await User.create({
            name,
            email,
            password
        });
        // ✅ LOG AFTER SUCCESS
        await createLog({
            user: user._id,
            action: 'REGISTER',
            description: 'New user registered',
            ip: req.ip
        });

        //send response
        res.status(201).json({
            message: "User registered successfully.",
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "server error"
        });
    }
}

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({
                message: "All fields are required."
            });
        }

        //find user include password
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({
                message: "Invalid credentials"
            })
        }

        //compare passwrod
        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid credentials"
            })
        }

        //generate jwt
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        // ✅ LOG AFTER LOGIN
        await createLog({
            user: user._id,
            action: 'LOGIN',
            description: 'User logged in',
            ip: req.ip
        });

        //set login 
        user.lastLogin = new Date();
        await user.save();

        // send token in http only cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', //only in production
            maxAge: 7 * 24 * 60 * 60 * 1000 //7days
        });

        //respond with user info
        res.status(200).json({
            message: "Login successfully",
            token: token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });

    } catch (error) {
        console.error('LOGIN ERROR 👉', error.message);
        res.status(500).json({ message: 'Server error' });
    }
}

exports.logout = (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production'
    });

    res.status(200).json({
        message: 'Logged out successfully'
    });
};

exports.getMe = async (req, res) => {
    const user = await User.findById(req.user._id).select('-password');
    res.status(200).json(user);
};


exports.changePassword = async (req, res) => {
    try {
        const { curruntPassword, newPassword } = req.body;

        if (!curruntPassword || !newPassword) {
            return res.status(400).json({ message: "All fields are required." });
        }

        const user = await User.findById(req.user._id).select('+password');

        const isMatch = await bcrypt.compare(curruntPassword, user.password);

        if (!isMatch) {

            res.status(401).json({ message: "Currunt password is incorrect." })
        }

        user.password = newPassword;
        await user.save();  //pre save hash password

        // ✅ LOG AFTER PASSWORD CHANGE
        await createLog({
            user: req.user._id,
            action: 'CHANGE_PASSWORD',
            description: 'User changed password',
            ip: req.ip
        });

        res.status(200).json({ message: "Password updated successfully." });

    } catch (error) {
        res.status(500).json({ message: "Password not updated." })
    }
}

// Profile update
exports.updateProfile = async (req, res) => {

    try {
        const { name, email, avatar } = req.body;

        if (!name || !email || !avatar) {
            return res.status(401).json({ message: "All fields are required." });
        }

        const emailExists = await User.findOne({
            email,
            _id: { $ne: req.user._id }
        });

        if (emailExists) {
            return res.status(409).json({ message: "Email already in use" });
        }

        const user = await User.findByIdAndUpdate(
            req.user._id,
            { name, email, avatar },
            { new: true, runValidators: true }
        ).select("-password");

        if (!user) {
            req.status(404).json({ message: "User Not Found." })
        }

        // ✅ LOG AFTER PASSWORD CHANGE
        await createLog({
            user: req.user._id,
            action: 'PROFILE_UPDATE',
            description: 'User updated profile',
            ip: req.ip
        });

        res.status(200).json({
            message: "User updated successfully",
            user
        });
    } catch (error) {
        res.status(500).json("User updation failed.")
    }

}