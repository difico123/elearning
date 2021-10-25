const express = require('express');
const Router = express.Router();
const auth = require('../middleware/auth/auth');
const instructorAuth = require('../middleware/auth/instructor.auth');
const courseInstructorAuth = require('../middleware/auth/courseInstructor.auth');
const ApiChoice = require('../controllers/ApiChoice');
const userCourseAuth = require('../middleware/auth/userCourse.auth');

// @route   POST api/choice/:courseId/:quizId/:questionId/createchoice
// @desc    create a choice by instructor
// @access  Private
Router.post(
    '/:courseId/:quizId/:questionId/createchoice',
    auth,
    instructorAuth,
    courseInstructorAuth,
    ApiChoice.createChoice,
);

// @route   GET api/choice/:courseId/:questionId/getChoices
// @desc    get choices with questionId by instructor and student
// @access  Private
Router.get(
    '/:courseId/:questionId/getChoices',
    auth,
    userCourseAuth,
    ApiChoice.getChoices,
);

module.exports = Router;