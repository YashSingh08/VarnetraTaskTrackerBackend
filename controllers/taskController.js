const Task = require("../models/TaskModel");
const { User } = require("../models/UserModel");

exports.createTask = async (req, res) => {
    const { title, description, assignedTo } = req.body;
    try {
        const task = await Task.create({ title, description, assignedTo });
        res.status(201).json(task);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getUserTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ assignedTo: req.user.id });
        return res.json(tasks);
    } catch (err) {
        console.error("getUserTasks error:", err);
        return res.status(500).json({ message: err.message });
    }
};

exports.updateTaskStatus = async (req, res) => {
    const { taskId } = req.params;
    const { status } = req.body;
    try {
        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ message: "Task not found or not assigned to you" });
        }
        if (task.assignedTo.toString() !== req.user.id) {
            return res.status(403).json({ message: "You are not authorized to update this task" });
        }

        if (task.status !== "done" && status === "done") {
            const user = await User.findById(req.user.id);
            user.totalPoints += 10;
            await user.save();
        }

        const validStatuses = ["pending", "in-progress", "done"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status value" });
        }
        task.status = status;
        await task.save();

        res.json(task);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.addComment = async (req, res) => {
    const { taskId } = req.params;
    const { text } = req.body;
    try {
        const task = await Task.findOne({ _id: taskId, assignedTo: req.user.id });
        if (!task) return res.status(404).json({ message: "Task not found" });

        task.comments.push({ text, user: req.user.id });
        await task.save();
        res.json(task);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getAllTasks = async (req, res) => {
    try {
        const tasks = await Task.find()
            .populate("assignedTo", "name") // ✅ this ensures you get { _id, name }
            .sort({ createdAt: -1 });
        res.json(tasks);
    } catch (err) {
        console.error("Error fetching tasks:", err);
        res.status(500).json({ message: "Failed to fetch tasks" });
    }
};


