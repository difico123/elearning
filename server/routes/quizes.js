const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth/auth');
const instructorAuth = require('../middleware/auth/instructor.auth');
const courseInstructorAuth = require('../middleware/auth/courseInstructor.auth');
const ApiQuizes = require('../controllers/ApiQuizes');
const ApiUserQuestion = require('../controllers/ApiUserQuestion');
const userCourseAuth = require('../middleware/auth/userCourse.auth');
const { check } = require('express-validator');
const validateInput = require('../middleware/errors/validateInput');

const { quizPassport } = require('../middleware/passport');
const { quizTopicAuth } = require('../middleware/course.auth');

// @route api/course/:courseId/topic/:topicId/quiz/:quizId/question
router.use(
    '/:quizId/question',
    quizTopicAuth,
    quizPassport,
    require('./question'),
);

// @route   POST api/course/:courseId/topic/:topicId/quiz/create
// @desc    create quize by instructor
// @access  Private
router.post(
    '/create',
    [
        check('shown', 'Không được bỏ trống xác thực').not().isEmpty(),
        check('title', 'Tiêu đề phải nhiều hơn 6 ký tự').isLength({
            min: 6,
        }),
    ],
    validateInput,
    auth,
    instructorAuth,
    courseInstructorAuth,
    ApiQuizes.createQuiz,
);

// @route   GET api/course/:courseId/topic/:topicId/quiz/getQuizes
// @desc    get quizzes by instructor and student
// @access  Private
router.get('/getQuizes', auth, userCourseAuth, ApiQuizes.getquizes);

// @route   GET /api/course/:courseId/topic/:topicId/quiz/getQuizScore/:quizId
// @desc    rank quiz
// @access  Private
router.get('/getQuizScore/:quizId',quizPassport, auth, userCourseAuth, ApiUserQuestion.getQuizScore);

module.exports = router;
