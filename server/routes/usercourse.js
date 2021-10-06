const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth/auth');
const ApiUserCourse = require('../controllers/ApiUserCourse');

// @route   POST api/userCourse/enroll/:courseId
// @desc    enroll a course by student
// @access  private
router.post('/enroll/:courseId', auth, ApiUserCourse.enroll);

// @route   Get api/userCourse/all
// @desc    get the list of user courses
// @access  private
router.get('/all', auth, ApiUserCourse.getAll);

module.exports = router;
