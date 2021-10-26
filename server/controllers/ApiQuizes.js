const TopicService = require('../dbservice/TopicService');
const NotificationService = require('../dbservice/NotificationService');
const UserCourseService = require('../dbservice/UserCourseService');
const QuizService = require('../dbservice/QuizService');

module.exports = class ApiQuizes {
    // @route   POST api/quizes/:courseId/:topicId/create
    // @desc    create quizes by instructor
    // @access  Private
    static async createQuiz(req, res) {
        const quize = {
            title: req.body.title,
            shown: req.body.shown,
            topic: req.topicId,
        };
        try {
            QuizService.createQuiz(quize).then((created) => {
                if (!created) {
                    return res.status(400).json({
                        error: true,
                        msg: 'Chưa tạo được topic',
                    });
                }

                return res.status(200).json({
                    error: false,
                    msg: 'tạo quiz thành công',
                });
            });
        } catch (error) {
            console.log(error.message);
            res.status(500).send('Server error');
        }
    }

    // @route   GET api/quizes/:courseId/:topicId/create/getQuizes
    // @desc    get quizzes by instructor and student
    // @access  Private
    static async getquizes(req, res) {
        try {
            QuizService.getQuizesByTopic(req.topicId).then((data) => {
                if (data.length == 0) {
                    return res.status(400).json({
                        error: true,
                        msg: 'Không có quiz',
                    });
                }
                res.status(200).json({
                    error: false,
                    data,
                });
            });
        } catch (error) {
            console.log(error.message);
            res.status(500).send('Server error');
        }
    }

    // @route   GET api/topic/edit/:topicId
    // @desc    edit Topics
    // @access  Private
    // static async editTopic(req, res) {
    //     let topic = {
    //         id: req.params.topicId,
    //         indexOrder: req.body.indexOrder,
    //         title: req.body.title,
    //         content: req.body.content,
    //     };
    //     try {
    //         TopicService.editTopic(topic).then((updated) => {
    //             if (!updated) {
    //                 return res.status(400).json({
    //                     error: true,
    //                     msg: 'Bạn chưa cập nhật được topic',
    //                 });
    //             }
    //             res.status(200).json({
    //                 error: true,
    //                 msg: 'cập nhật topic thành công',
    //             });
    //         });
    //     } catch (error) {
    //         console.log(error.message);
    //         res.status(500).send('Server error');
    //     }
    // }
};
