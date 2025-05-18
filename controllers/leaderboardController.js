const { User } = require('../models/UserModel');

exports.getLeaderboard = async (req, res) => {
    try {
        const users = await User.find({ totalPoints: { $exists: true } }, { name: 1, totalPoints: 1, _id: 0 })
            .sort({ points: -1 })
            .limit(10);

        res.json(users);
    } catch (err) {
        console.error("Leaderboard fetch error:", err);
        res.status(500).json({ message: "Server error while fetching leaderboard." });
    }
};