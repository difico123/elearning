const QuizService = require('../dbservice/QuizService');
const QuestionService = require('../dbservice/QuestionService');
const UserQuestionService = require('../dbservice/UserQuestionService');
const ChoiceService = require('../dbservice/ChoiceService');

module.exports = class ApiUserQuestion {
    // @route   POST /api/userquestion/answer/:questionId
    // @desc    answer a question by student
    // @access  Private
    static async answerQuestion(req, res) {
        const answer = {
            user: req.user.id,
            choice: req.body.choice,
            question: parseInt(req.params.questionId),
        };
        try {
            ChoiceService.getChoicesInQuestion(req.body.choice, req.params.questionId).then(data => {
                if (data.length === 0) {
                    return res.status(200).json({
                        error: true,
                        msg: 'Câu trả lời không nằm trong câu hỏi',
                    });
                } else {

                    const addAnswer = UserQuestionService.studentAnswer(answer).then(
                        (created) => {
                            if (!created) {
                                return res.status(200).json({
                                    error: false,
                                    msg: 'Bạn chưa trả lời câu hỏi',
                                });
                            }
                        },
                    ).catch(err => {
                        return res.status(400).json({
                            error: true,
                            msg: 'lỗi bạn đã trả lời'
                        })
                    });

                    Promise.all([addAnswer]).then(() => {
                        UserQuestionService.checkCorrectAnswer(answer).then(
                            (correct) => {
                                return correct[0].isAnswer === 0 ?
                                    res.status(200).json({
                                        error: false,
                                        msg: 'Sai'
                                    }) :
                                    res
                                    .status(200)
                                    .json({
                                        error: false,
                                        msg: 'Đúng'
                                    });
                            },
                        );
                    });

                }
            })


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
            QuestionService.getQuestionByQuizId(req.params.quizId).then(
                (data) => {
                    if (data.length == 0) {
                        return res.status(200).json({
                            error: false,
                            msg: 'Bạn chưa có câu hỏi nào',
                        });
                    }
                    res.status(200).json({
                        error: false,
                        data
                    });
                },
            );
        } catch (error) {
            console.log(error.message);
            res.status(500).send('Server error');
        }
    }

    // @route   GET api/userquestion/:courseId/:quizId/getQuizScore
    // @desc    rank student by quizid
    // @access  Private
    static async getQuizScore(req, res) {
        try {
            QuestionService.rank(req.params.quizId).then(
                (data) => {
                    if (data.length == 0) {
                        return res.status(400).json({
                            error: true,
                            msg: '',
                        });
                    }
                    res.status(200).json({
                        error: false,
                        data
                    });
                },
            );
        } catch (error) {
            console.log(error.message);
            res.status(500).send('Server error');
        }
    }
};