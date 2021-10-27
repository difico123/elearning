const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth/auth');
const instructorAuth = require('../middleware/auth/instructor.auth');
const courseInstructorAuth = require('../middleware/auth/courseInstructor.auth');
const ApiTopic = require('../controllers/ApiTopic');
const userCourseAuth = require('../middleware/auth/userCourse.auth');

const { check } = require('express-validator');
const validateInput = require('../middleware/errors/validateInput');

const { topicCourseAuth } = require('../middleware/course.auth');
const { topicPassport } = require('../middleware/passport');

// @route api/course/:courseId/topic/:topicId/quiz
router.use(
    '/:topicId/quiz',
    topicPassport,
    topicCourseAuth,
    require('./quizes'),
);

// @route   POST api/course/:courseId/topic/create
// @desc    create topic by instructor
// @access  Private
router.post(
    '/create',
    [
        check('indexOrder', 'Không được bỏ trống thứ tự').not().isEmpty(),
        check('title', 'Tiêu đề phải nhiều hơn 6 ký tự').isLength({
            min: 6,
        }),
        check('content', 'Nội dung phải nhiều hơn 10 ký tự').isLength({
            min: 10,
        }),
    ],
    validateInput,
    auth,
    instructorAuth,
    courseInstructorAuth,
    ApiTopic.createTopic,
);

// @route   GET api/course/:courseId/topic/getCourseTopics
// @desc    get All course topic
// @access  Private
router.get('/getCourseTopics', auth, userCourseAuth, ApiTopic.getCourseTopics);

// @route   GET api/course/:courseId/topic/edit/:topicId
// @desc    edit Topics
// @access  Private
router.put(
    '/edit/:topicId',
    [
        check('indexOrder', 'Không được bỏ trống thứ tự').not().isEmpty(),
        check('title', 'Tiêu đề phải nhiều hơn 6 ký tự').isLength({
            min: 6,
        }),
        check('content', 'Nội dung phải nhiều hơn 10 ký tự').isLength({
            min: 10,
        }),
    ],
    validateInput,
    topicCourseAuth,
    auth,
    instructorAuth,
    courseInstructorAuth,
    ApiTopic.editTopic,
);

// @route   GET api/course/:courseId/topic/changeOrder/:topicId
// @desc    edit Topic
// @access  Private
router.put(
    '/changeOrder/:topicId',
    [check('indexOrder', 'Không được bỏ trống thứ tự').not().isEmpty()],
    validateInput,
    topicCourseAuth,
    auth,
    instructorAuth,
    courseInstructorAuth,
    ApiTopic.changeOrder,
);

// @route   delete api/course/:courseId/topic/delete/:topicId
// @desc    delete Topic
// @access  Private
router.delete(
    '/delete/:topicId',
    topicCourseAuth,
    auth,
    instructorAuth,
    courseInstructorAuth,
    ApiTopic.deleteTopic,
);

module.exports = router;
