const express = require('express');
const Router = express.Router();
const auth = require('../middleware/auth/auth');
const instructorAuth = require('../middleware/auth/instructor.auth');
const courseInstructorAuth = require('../middleware/auth/courseInstructor.auth');
const ApiTopic = require('../controllers/ApiTopic');
const userCourseAuth = require('../middleware/auth/userCourse.auth');

// @route   POST api/notification/create
// @desc    create topic by instructor
// @access  Private
Router.post(
    '/create/:courseId',
    auth,
    instructorAuth,
    courseInstructorAuth,
    ApiTopic.createTopic,
);

// @route   GET api/notification/getCourseTopics
// @desc    get All course topic
// @access  Private
Router.get(
    '/getCourseTopics/:courseId',
    auth,
    userCourseAuth,
    ApiTopic.getCourseTopics,
);

module.exports = Router;
