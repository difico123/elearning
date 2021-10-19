const express = require('express');
const Router = express.Router();
const auth = require('../middleware/auth/auth');
const instructorAuth = require('../middleware/auth/instructor.auth');
const courseInstructorAuth = require('../middleware/auth/courseInstructor.auth');
const ApiQuizes = require('../controllers/ApiQuizes');
const userCourseAuth = require('../middleware/auth/userCourse.auth');

// @route   POST api/quizes/:courseId/:topicId/create
// @desc    create quize by instructor
// @access  Private
Router.post(
    '/:courseId/:topicId/create',
    auth,
    instructorAuth,
    courseInstructorAuth,
    ApiQuizes.createQuiz,
);

// @route   POST api/quizes/:courseId/:topicId/getQuizes
// @desc    get quizzes by instructor and student
// @access  Private
Router.get(
    '/:courseId/:topicId/getQuizes',
    auth,
    userCourseAuth,
    ApiQuizes.getquizes,
);

module.exports = Router;
