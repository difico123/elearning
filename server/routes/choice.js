const express = require('express');
const Router = express.Router();
const auth = require('../middleware/auth/auth');
const instructorAuth = require('../middleware/auth/instructor.auth');
const courseInstructorAuth = require('../middleware/auth/courseInstructor.auth');
const ApiChoice = require('../controllers/ApiChoice');
const userCourseAuth = require('../middleware/auth/userCourse.auth');
const { check } = require('express-validator');
const validateInput = require('../middleware/errors/validateInput');
// @route   POST api/course/:courseId/topic/:topicId/quiz/:quizId/question/:questionId/choice/create
// @desc    create a choice by instructor
// @access  Private
Router.post(
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
    ApiChoice.createChoice,
);

// @route   GET api/course/:courseId/topic/:topicId/quiz/:quizId/question/:questionId/choice/getChoices
// @desc    get choices with questionId by instructor and student
// @access  Private
Router.get('/getChoices', auth, userCourseAuth, ApiChoice.getChoices);

module.exports = Router;
