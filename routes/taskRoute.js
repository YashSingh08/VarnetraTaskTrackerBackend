const express = require('express');
const { auth, isAdmin } = require('../middlewares/authMiddleware');
const { createTask, getAllTasks, getUserTasks, updateTaskStatus, addComment } = require('../controllers/taskController');
const router = express.Router();

// Admin routes
router.post("/create", auth, isAdmin, createTask);
router.get("/all", auth, isAdmin, getAllTasks);

// User routes
router.get("/my", auth, getUserTasks);
router.put("/:taskId/status", auth, updateTaskStatus);
router.post("/:taskId/comment", auth, addComment);

module.exports = router;