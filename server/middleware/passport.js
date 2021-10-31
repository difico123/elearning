const CategoryService = require('../dbservice/CategoryService');
const CourseService = require('../dbservice/CourseService');
const TopicService = require('../dbservice/TopicService');
const QuizService = require('../dbservice/QuizService');
const QuestionService = require('../dbservice/QuestionService');

module.exports = {
    categoryPassport: function (req, res, next) {
        let categoryId = req.params.categoryId;

        CategoryService.checkCourseCategory(categoryId).then((categories) => {
            if (categories.length === 0) {
                return res.status(404).json({
                    error: true,
                    msg: 'Không có loại khoá học',
                });
            } else {
                req.categoryId = categoryId;
                next();
            }
        });
    },

    coursePassport: function (req, res, next) {
        let courseId = req.params.courseId;

        CourseService.getCourseById(courseId).then((courses) => {
            if (courses.length === 0) {
                return res.status(404).json({
                    error: true,
                    msg: 'Không có khoá học',
                });
            } else {
                req.courseId = courseId;
                next();
            }
        });
    },

    topicPassport: function (req, res, next) {
        let topicId = req.params.topicId;
        TopicService.getCourseTopicById(topicId).then((topics) => {
            if (topics.length === 0) {
                return res.status(404).json({
                    error: true,
                    msg: 'Không có Topic',
                });
            } else {
                req.topicId = topicId;
                next();
            }
        });
    },

    quizPassport: function (req, res, next) {
        let quizId = req.params.quizId;
        QuizService.getQuizById(quizId).then((quizes) => {
            if (quizes.length === 0) {
                return res.status(404).json({
                    error: true,
                    msg: 'Không có Quiz',
                });
            } else {
                req.quizId = quizId;
                next();
            }
        });
    },

    questionPassport: function (req, res, next) {
        let questionId = req.params.questionId;
        QuestionService.getQuestionByQuestionId(questionId).then(
            (questions) => {
                if (questions.length === 0) {
                    return res.status(404).json({
                        error: true,
                        msg: 'Không có câu hỏi',
                    });
                } else {
                    req.questionId = questionId;

                    next();
                }
            },
        );
    },
};
