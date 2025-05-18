const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/authRoute');
const taskRoutes = require('./routes/taskRoute');
const leaderboardRoutes = require('./routes/leaderboardRoute.js');

const app = express();
app.use(cors());
app.use(express.json());

// Sample route to test server
app.get('/', (req, res) => {
    res.send("API is running...");
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/leaderboard", leaderboardRoutes);

// connect to mongoDB and start the server
const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
}).catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
});
