const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth/auth');
const instructorAuth = require('../middleware/auth/instructor.auth');
const courseInstructorAuth = require('../middleware/auth/courseInstructor.auth');
const ApiQuizes = require('../controllers/ApiQuizes');
const ApiUserQuestion = require('../controllers/ApiUserQuestion');
const userCourseAuth = require('../middleware/auth/userCourse.auth');

// @route   POST /api/course/:courseId/topic/:topicId/quiz/:quizId/question/:questionId/userquestion/answer
// @desc    answer a question by student
// @access  Private
router.post('/answer', auth, userCourseAuth, ApiUserQuestion.answerQuestion);

// @route   GET /api/userquestion/:courseId/:questionId/history
// @desc    history user question
// @access  Private
router.get('/history', auth, userCourseAuth, ApiUserQuestion.history);

module.exports = router;
