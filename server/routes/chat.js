const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth/auth');
const ApiChat = require('../controllers/ApiChat');
const userCourseAuth = require('../middleware/auth/userCourse.auth');
const { check } = require('express-validator');
const validateInput = require('../middleware/errors/validateInput');

// @route   POST api/chat/chats/:courseId
// @desc    user comment a course
// @access  Private
router.post(
    '/chats/:courseId',
    [
        check('message', 'Tin nhắn phải nhiều hơn 1 kí tự').isLength({
            min: 1,
        }),
    ],
    validateInput,
    auth,
    userCourseAuth,
    ApiChat.chat,
);

// @route   GET api/chat/getCourseChats/:courseId
// @desc    get conversation
// @access  Private
router.get(
    '/getCourseChats/:courseId',
    auth,
    userCourseAuth,
    ApiChat.getCourseChats,
);

module.exports = router;
