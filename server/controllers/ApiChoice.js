
const QuizService = require('../dbservice/QuizService')
const ChoiceService = require('../dbservice/ChoiceService')

module.exports = class ApiChoice {
// @route   POST api/question/:courseId/:questionId/createQuestion
// @desc    create question by instructor
// @access  Private
    static async createChoice(req, res) {
        
        const choice = {
            content: req.body.content,
            isAnswer: req.body.isAnswer,
            question: req.params.questionId,
        };
       
        try {
            ChoiceService.create(choice).then((created) => {
                if (!created) {
                    return res
                        .status(400)
                        .json({ error: true, msg: 'Chưa tạo được câu trả lời' });
                }

                return res.status(200).json({ error:false, msg: 'tạo câu trả lời thành công'})
            });
        } catch (error) {
            console.log(error.message);
            res.status(500).send('Server error');
        }
    }

// @route   GET api/question/:courseId/:questionId/getChoices
// @desc    get question with quizId by instructor and student
// @access  Private
    static async getChoices(req, res) {
        console.log(req.params.questionId);
        
        try {
            ChoiceService.getChoicesByQuestionId(req.params.questionId).then((data) => {
                if (data.length == 0) {
                    return res
                        .status(400)
                        .json({ error: true, msg: 'Bạn chưa có câu trả lời nào' });
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
