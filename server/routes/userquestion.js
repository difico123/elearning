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

module.exports = Router;
