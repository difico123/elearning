const express = require('express');
const router = express.Router();
const instructorAuth = require('../middleware/instructor.auth');
const auth = require('../middleware/auth');
const { check } = require('express-validator');
const ApiCourse = require('../controllers/ApiCourse');

    // @route   POST api/courses/create
    // @desc    Create course
    // @access  Private
router.post(
    '/create',
    [
        check('name', 'Không được bỏ trống tên').not().isEmpty()
    ],
    auth,
    instructorAuth,
    ApiCourse.createCourse,
);

module.exports = router;
