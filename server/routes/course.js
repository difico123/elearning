const express = require('express');
const router = express.Router();
const instructorAuth = require('../middleware/auth/instructor.auth');
const auth = require('../middleware/auth/auth');
const { check } = require('express-validator');
const ApiCourse = require('../controllers/ApiCourse');
const validateInput = require('../middleware/errors/validateInput');

// @route   POST api/course/create
// @desc    Create course
// @access  Private
router.post(
    '/create',
    [check('name', 'Không được bỏ trống tên').not().isEmpty()],
    auth,
    instructorAuth,
    validateInput,
    ApiCourse.createCourse,
);

// @route   PUT api/course/activate
// @desc    Activate course
// @access  Private
router.put(
    '/activateCourse',
    auth,
    instructorAuth,
    ApiCourse.activateCourse,
);

module.exports = router;
