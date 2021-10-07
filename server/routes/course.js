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

// @route   GET api/course/instructorCourses
// @desc    show instructor'courses
// @access  Private
router.get('/instructorCourses', auth, instructorAuth, ApiCourse.getCourses);

// @route   GET api/course/instructorCourse/:courseId
// @desc    show single instructor'course
// @access  Private
router.get(
    '/instructorCourse/:courseId',
    auth,
    instructorAuth,
    ApiCourse.getSingleCourse,
);

// @route   GET api/course/showAll
// @desc    Show all courses
// @access  public
router.get('/showAll', ApiCourse.showAll);

// @route   GET api/course/getUsers/:courseId
// @desc    Get all users in the course
// @access  private
router.get('/getUsers/:courseId',auth,instructorAuth, ApiCourse.showUsers);

module.exports = router;
