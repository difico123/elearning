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

// @route   PUT api/course/activate/:id
// @desc    Activate course
// @access  Private
router.put('/activate/:id', auth, instructorAuth, ApiCourse.activateCourse);

// @route   PUT api/course/suspend/:id
// @desc    suspend course
// @access  Private
router.put('/suspend/:id', auth, instructorAuth, ApiCourse.suspendCourse);

// @route   GET api/course/show
// @desc    show instructor'courses
// @access  Private
router.get('/show', auth, instructorAuth, ApiCourse.showCourse);

module.exports = router;
