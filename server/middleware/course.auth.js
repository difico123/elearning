const CategoryService = require('../dbservice/CategoryService');
const CourseService = require('../dbservice/CourseService');
const TopicService = require('../dbservice/TopicService');
const QuizService = require('../dbservice/QuizService');
const QuestionService = require('../dbservice/QuestionService');

module.exports = {
    courseCategoryAuth: function (req, res, next) {
        let courseId =
            req.params.courseId === undefined
                ? req.courseId
                : req.params.courseId;
        let categoryId =
            req.params.categoryId === undefined
                ? req.categoryId
                : req.params.categoryId;
        try {
            CourseService.checkCourseCategory(courseId, categoryId).then(
                (data) => {
                    if (data.length === 0) {
                        return res.status(403).json({
                            error: true,
                            msg: 'Khoá học không nằm trong category',
                        });
                    }

                    next();
                },
            );
        } catch (error) {
            console.log(error.message);
            res.status(500).send('Server Error');
        }
    },
    topicCourseAuth: function (req, res, next) {
        let courseId =
            req.params.courseId === undefined
                ? req.courseId
                : req.params.courseId;
        let topicId =
            req.params.topicId === undefined ? req.topicId : req.params.topicId;
        try {
            TopicService.checkTopicInCource(topicId, courseId).then((data) => {
                if (data.length === 0) {
                    return res.status(403).json({
                        error: true,
                        msg: 'Topic không nằm trong khoá học',
                    });
                }

                next();
            });
        } catch (error) {
            console.log(error.message);
            res.status(500).send('Server Error');
        }
    },

    questionQuizAuth: function (req, res, next) {
        let questionId =
            req.params.questionId === undefined
                ? req.questionId
                : req.params.questionId;
        let quizId =
            req.params.quizId === undefined ? req.quizId : req.params.quizId;
        try {
            QuestionService.checkQuestionQuiz(questionId, quizId).then(
                (data) => {
                    if (data.length === 0) {
                        return res.status(403).json({
                            error: true,
                            msg: 'Question không nằm trong quiz',
                        });
                    }

                    next();
                },
            );
        } catch (error) {
            console.log(error.message);
            res.status(500).send('Server Error');
        }
    },
    quizTopicAuth: function (req, res, next) {
        let quizId =
            req.params.quizId === undefined ? req.quizId : req.params.quizId;
        let topicId =
            req.params.topicId === undefined ? req.topicId : req.params.topicId;
        try {
            QuizService.checkQuizTopic(quizId, topicId).then((data) => {
                if (data.length === 0) {
                    return res.status(403).json({
                        error: true,
                        msg: 'Quiz không nằm trong topic',
                    });
                }
                next();
            });
        } catch (error) {
            console.log(error.message);
            res.status(500).send('Server Error');
        }
    },
};
