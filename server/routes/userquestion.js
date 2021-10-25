const express = require('express');
const Router = express.Router();
const auth = require('../middleware/auth/auth');
const instructorAuth = require('../middleware/auth/instructor.auth');
const courseInstructorAuth = require('../middleware/auth/courseInstructor.auth');
const ApiQuizes = require('../controllers/ApiQuizes');
const ApiUserQuestion = require('../controllers/ApiUserQuestion');
const userCourseAuth = require('../middleware/auth/userCourse.auth');

// @route   POST /api/userquestion/:courseId/answer/:questionId
// @desc    answer a question by student
// @access  Private
Router.post(
    '/:courseId/answer/:questionId',
    auth,
    userCourseAuth,
    ApiUserQuestion.answerQuestion,
);

// @route   GET /api/userquestion/:courseId/:quizId/getQuizScore
// @desc    rank quiz
// @access  Private
Router.get(
    '/:courseId/:quizId/getQuizScore',
    auth,
    userCourseAuth,
    ApiUserQuestion.getQuizScore,
);

module.exports = Router;