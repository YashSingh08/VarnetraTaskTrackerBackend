const jwt = require("jsonwebtoken");
const { User } = require("../models/UserModel");

const JWT_SECRET = process.env.JWT_SECRET;

exports.auth = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Missing token" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        // req.user = await User.findById(decoded.id).select("-password");
        req.user = decoded;
        next();
    } catch (err) {
        console.error("Token verification error:", err);
        res.status(401).json({ message: "Invalid token" });
    }
};

exports.isAdmin = async (req, res, next) => {
    // if (req.user.role !== "admin") {
    //     return res.status(403).json({ message: "Access denied: Admins only" });
    // }
    try {
        const user = await User.findById(req.user.id);
        if (user && user.role === "admin") {
            next();
        } else {
            res.status(403).json({ message: "Access denied. Admins only." });
        }
    } catch (err) {
        console.error("Admin check error:", err);
        res.status(500).json({ message: "Internal server error" });
    }

};