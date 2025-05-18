const { allowedPositions, User } = require('../models/UserModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const JWT_SECRET = process.env.JWT_SECRET;

exports.signup = async (req, res) => {
    const { name, email, phone, position, role, password } = req.body;
    try {
        if (!name || !email || !phone || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check for existing email/phone
        const existingUser = await User.findOne({
            $or: [{ email }, { phone }]
        });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists with this Email or Phone" });
        }

        // Enforcing only one admin
        if (role === "admin") {
            const existingAdmin = await User.findOne({ role: "admin" });
            if (existingAdmin) {
                return res.status(400).json({ message: "An admin already exists. Only one admin is allowed" });
            }
        }

        // Enforce unique executive positions (Except Employee)
        const executivePositions = ["CEO", "CTO", "CFO", "CMO", "CLO", "COO"];
        const finalPosition = executivePositions.includes(position) ? position : "Employee";
        if (executivePositions.includes(finalPosition)) {
            const existingExec = await User.findOne({ position: finalPosition });
            if (existingExec) {
                return res.status(400).json({ message: `A user with position ${finalPosition} already exists.` });
            }
        }

        // Securing password
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            name,
            email,
            phone,
            position: allowedPositions.includes(position) ? position : "Employee",
            role: role === "admin" ? "admin" : "user",
            password: hashedPassword,
        })

        const token = jwt.sign({ id: user._id, position: user.position, role: user.role }, JWT_SECRET, { expiresIn: "1d" });

        res.status(201).json({ token, user: { id: user._id, name: user.name, role: user.role } });
    } catch (err) {
        res.status(400).json({ message: "Something went wrong. Please try again." });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }

        const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: "1d" });
        return res.status(200).json({ token, user: { id: user._id, name: user.name, role: user.role } });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// exports.getAllUsers = async (req, res) => {
//     try {
//         const users = await User.find({}, "_id name email");
//         res.json(users);
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// };

exports.getAllUsers = async (req, res) => {
    try {
        console.log("📢 getAllUsers hit");
        const users = await User.find({ role: "user" }).select("_id name");
        res.json(users);
    } catch (err) {
        console.error("❌ getAllUsers failed:", err);
        res.status(500).json({ error: "Failed to fetch users" });
    }
};

