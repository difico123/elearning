const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth/auth');
const ApiChat = require('../controllers/ApiChat');
const userCourseAuth = require('../middleware/auth/userCourse.auth');

// @route   POST api/chat/chats
// @desc    user comment a course
// @access  Private
router.post('/chats/:courseId', auth, userCourseAuth, ApiChat.chat);

// @route   GET api/chat/getCourseChats/:courseId
// @desc    get conversation
// @access  Private
router.get('/getCourseChats/:courseId', auth, userCourseAuth, ApiChat.getCourseChats);

module.exports = router;
