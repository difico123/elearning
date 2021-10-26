const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth/auth');
const instructorAuth = require('../middleware/auth/instructor.auth');
const courseInstructorAuth = require('../middleware/auth/courseInstructor.auth');
const ApiQuestion = require('../controllers/ApiQuestion');
const userCourseAuth = require('../middleware/auth/userCourse.auth');
const { check } = require('express-validator');
const validateInput = require('../middleware/errors/validateInput');

const { questionQuizAuth } = require('../middleware/course.auth');
const { questionPassport } = require('../middleware/passport');

// @route api/course/:courseId/topic/:topicId/quiz/:quizId/question/:questionId/choice
router.use(
    '/:questionId/choice',
    questionQuizAuth,
    questionPassport,
    require('./choice'),
);

// @route api/course/:courseId/topic/:topicId/quiz/:quizId/question/:questionId/userquestion
router.use(
    '/:questionId/userquestion',
    questionQuizAuth,
    questionPassport,
    require('./userquestion'),
);
// @route   POST api/course/:courseId/topic/:topicId/quiz/:quizId/question/create
// @desc    create question by instructor
// @access  Private
router.post(
    '/create',
    [
        check('content', 'Nội dung phải nhiều hơn 6 ký tự').isLength({
            min: 6,
        }),
    ],
    validateInput,
    auth,
    instructorAuth,
    courseInstructorAuth,
    ApiQuestion.createQuestion,
);

// @route   GET api/course/:courseId/topic/:topicId/quiz/:quizId/question/getQuestions
// @desc    get question with quizId by instructor and student
// @access  Private
router.get('/getQuestions', auth, userCourseAuth, ApiQuestion.getQuestions);

// @route   GET api/course/:courseId/topic/:topicId/quiz/:quizId/question/getQuestions/:questionId
// @desc    get questions and answers with quizId by instructor and student
// @access  Private
router.get(
    '/getQuestionAswers/:questionId',
    questionPassport,
    auth,
    userCourseAuth,
    ApiQuestion.getQuestionAswers,
);

module.exports = router;
