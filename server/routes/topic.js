const express = require('express');
const Router = express.Router();
const auth = require('../middleware/auth/auth');
const instructorAuth = require('../middleware/auth/instructor.auth');
const courseInstructorAuth = require('../middleware/auth/courseInstructor.auth');
const ApiTopic = require('../controllers/ApiTopic');
const userCourseAuth = require('../middleware/auth/userCourse.auth');

// @route   POST api/topic/create
// @desc    create topic by instructor
// @access  Private
Router.post(
    '/create/:courseId',
    auth,
    instructorAuth,
    courseInstructorAuth,
    ApiTopic.createTopic,
);

// @route   GET api/topic/getCourseTopics
// @desc    get All course topic
// @access  Private
Router.get(
    '/getCourseTopics/:courseId',
    auth,
    userCourseAuth,
    ApiTopic.getCourseTopics,
);

// @route   GET api/topic/:courseId/edit/:topicId
// @desc    edit Topics
// @access  Private
Router.put(
    '/:courseId/edit/:topicId',
    auth,
    instructorAuth,
    courseInstructorAuth,
    ApiTopic.editTopic,
);

// @route   GET api/topic/:courseId/changeOrder/:topicId
// @desc    edit Topics
// @access  Private
Router.put(
    '/:courseId/changeOrder/:topicId',
    auth,
    instructorAuth,
    courseInstructorAuth,
    ApiTopic.changeOrder,
);

// @route   GET api/topic/:courseId/delete/:topicId
// @desc    edit Topics
// @access  Private
Router.delete(
    '/:courseId/delete/:topicId',
    auth,
    instructorAuth,
    courseInstructorAuth,
    ApiTopic.deleteTopic,
);

module.exports = Router;
