const express = require('express');
const Router = express.Router();
const auth = require('../middleware/auth/auth');
const instructorAuth = require('../middleware/auth/instructor.auth');
const courseInstructorAuth = require('../middleware/auth/courseInstructor.auth');
const ApiQuizes = require('../controllers/ApiQuizes');
const ApiQuestion = require('../controllers/ApiQuestion');
const userCourseAuth = require('../middleware/auth/userCourse.auth');

// @route   POST api/question/:courseId/:quizId/createQuestion
// @desc    create question by instructor
// @access  Private
Router.post(
    '/:courseId/:quizId/createQuestion',
    auth,
    instructorAuth,
    courseInstructorAuth,
    ApiQuestion.createQuestion,
);

// @route   GET api/question/:courseId/:quizId/getQuestions
// @desc    get question with quizId by instructor and student
// @access  Private
Router.get(
    '/:courseId/:quizId/getQuestions',
    auth,
    userCourseAuth,
    ApiQuestion.getQuestions,
);

module.exports = Router;
