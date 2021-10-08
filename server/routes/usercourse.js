const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth/auth');
const ApiUserCourse = require('../controllers/ApiUserCourse');
const userCourseAuth = require('../middleware/auth/userCourse.auth');
const { check } = require('express-validator');
const validateInput = require('../middleware/errors/validateInput');

// @route   POST api/userCourse/enroll/:courseId
// @desc    enroll a course by student
// @access  private
router.post('/enroll/:courseId', auth, ApiUserCourse.enroll);

// @route   Get api/userCourse/all
// @desc    get the list of user courses
// @access  private
router.get('/all', auth, ApiUserCourse.getAll);

// @route   POST api/userCourse/rate/:courseId
// @desc    rate the course
// @access  private
router.post(
    '/rate/:courseId',
    [check('rating', 'Bạn chưa đánh giá').not().isEmpty()],
    auth,
    userCourseAuth,
    validateInput,
    ApiUserCourse.rate,
);

module.exports = router;
