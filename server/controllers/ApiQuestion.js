
const QuizService = require('../dbservice/QuizService')
const QuestionService = require('../dbservice/QuestionService')

module.exports = class ApiQuestion {
// @route   POST api/question/:courseId/:quizId/createQuestion
// @desc    create question by instructor
// @access  Private
    static async createQuestion(req, res) {
        
        const question = {
            content: req.body.content,
            quiz: req.params.quizId,
        };
        try {
            QuestionService.createQuestion(question).then((created) => {
                if (!created) {
                    return res
                        .status(400)
                        .json({ error: true, msg: 'Chưa tạo được câu hỏi' });
                }

                return res.status(200).json({ error:false, msg: 'tạo câu hỏi thành công'})
            });
        } catch (error) {
            console.log(error.message);
            res.status(500).send('Server error');
        }
    }

// @route   GET api/question/:courseId/:quizId/getQuestions
// @desc    get question with quizId by instructor and student
// @access  Private
    static async getQuestions(req, res) {
        
        try {
            QuestionService.getQuestionByQuizId(req.params.quizId).then((data) => {
                if (data.length == 0) {
                    return res
                        .status(400)
                        .json({ error: true, msg: 'Bạn chưa có câu hỏi nào' });
                }
                res.status(200).json({ error: false, data });
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
