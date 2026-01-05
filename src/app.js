const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const logRoutes = require('./routes/logRoutes');
const blogRoutes = require('./routes/blogRoutes');
const profileRoutes = require('./routes/profileRoutes')

// app.use(cors());
app.use(cors({
    origin: 'http://localhost:5173', // React (Vite) URL
    credentials: true                // 🔥 REQUIRED for cookies
}));
app.use(express.json());
app.use(cookieParser());
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/logs', logRoutes);
app.use('/api/blogs', blogRoutes);
app.use("/api/profile", profileRoutes);

app.get('/', (req, res) => {
    res.send('Admin Panel Running.');
});

module.exports = app;