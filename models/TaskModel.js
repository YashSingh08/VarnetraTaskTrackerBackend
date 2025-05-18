const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ["pending", "in-progress", "done"], default: "pending" },
    comments: [
        {
            user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
            text: String,
            date: { type: Date, default: Date.now },
        },
    ],
},
    {
        timestamps: true
    }
);

const Task = mongoose.model("Task", taskSchema);
module.exports = Task;