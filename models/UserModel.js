const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, index: true },
        phone: { type: String, required: true, unique: true },
        position: { type: String, enum: ["Employee", "CEO", "CTO", "CFO", "CMO", "CLO", "COO"], default: "Employee" },
        role: { type: String, enum: ["admin", "user"], default: "user" },
        password: { type: String, required: true },
        totalPoints: { type: Number, default: 0 }
    },
    {
        timestamps: true
    }
);

const User = mongoose.model("User", userSchema);
const allowedPositions = ["CEO", "CTO", "CFO", "CMO", "CLO", "COO"];


module.exports = { User, allowedPositions };