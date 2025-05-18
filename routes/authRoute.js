const express = require('express');
const { login, signup, getAllUsers } = require('../controllers/authController');
const { isAdmin, auth } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/users", auth, isAdmin, getAllUsers);


module.exports = router;