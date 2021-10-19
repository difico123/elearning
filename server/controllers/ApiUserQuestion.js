const QuizService = require('../dbservice/QuizService');
const QuestionService = require('../dbservice/QuestionService');
const UserQuestionService = require('../dbservice/UserQuestionService');

module.exports = class ApiUserQuestion {
    // @route   POST /api/userquestion/answer/:questionId
    // @desc    answer a question by student
    // @access  Private
    static async answerQuestion(req, res) {
        const answer = {
            user: req.user.id,
            choice: req.body.choice,
            question: req.params.questionId,
        };
        try {
            UserQuestionService.studentAnswer(answer).then((created) => {
                if (!created) {
                    return res
                        .status(400)
                        .json({ error: true, msg: 'Bạn chưa trả lời câu hỏi' });
                }

                return res
                    .status(200)
                    .json({ error: false, msg: 'Trả câu hỏi thành công' });
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
            QuestionService.getQuestionByQuizId(req.params.quizId).then(
                (data) => {
                    if (data.length == 0) {
                        return res
                            .status(400)
                            .json({
                                error: true,
                                msg: 'Bạn chưa có câu hỏi nào',
                            });
                    }
                    res.status(200).json({ error: false, data });
                },
            );
        } catch (error) {
            console.log(error.message);
            res.status(500).send('Server error');
        }
    }
};
