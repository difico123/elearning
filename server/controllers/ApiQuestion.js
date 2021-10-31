const QuizService = require('../dbservice/QuizService');
const QuestionService = require('../dbservice/QuestionService');
const ChoiceService = require('../dbservice/ChoiceService');

module.exports = class ApiQuestion {
    // @route   POST api/course/:courseId/topic/:topicId/quiz/:quizId/question/create
    // @desc    create question by instructor
    // @access  Private
    static async createQuestion(req, res) {
        const question = {
            content: req.body.content,
            quiz: req.quizId,
            marks: req.body.marks,
        };
        try {
            QuestionService.createQuestion(question).then((created) => {
                if (!created) {
                    return res.status(400).json({
                        error: true,
                        msg: 'Chưa tạo được câu hỏi',
                    });
                }

                return res.status(200).json({
                    error: false,
                    msg: 'tạo câu hỏi thành công',
                    question,
                });
            });
        } catch (error) {
            console.log(error.message);
            res.status(500).send('Server error');
        }
    }

    // @route   GET api/course/:courseId/topic/:topicId/quiz/:quizId/question/getQuestions
    // @desc    get question with quizId by instructor and student
    // @access  Private
    static async getQuestions(req, res) {
        try {
            QuestionService.getQuestionByQuizId(req.quizId).then((data) => {
                if (data.length == 0) {
                    return res.status(400).json({
                        error: false,
                        msg: 'Không có câu hỏi',
                    });
                }
                res.status(200).json({
                    error: false,
                    questions: data,
                });
            });
        } catch (error) {
            console.log(error.message);
            res.status(500).send('Server error');
        }
    }

    // @route   GET api/course/:courseId/topic/:topicId/quiz/:quizId/question/getQuestionAswers/:questionId
    // @desc    getQuestionAswers by instructor and student
    // @access  Private
    static async getQuestionAswers(req, res) {
        let quiz = {
            quizId: req.quizId,
        };
        try {
            await QuizService.getQuizById(req.quizId).then((quizes) => {
                quiz.quizContent = quizes[0].title;
            });
            QuestionService.getQuestionByQuestionId(req.questionId).then(
                (questions) => {
                    let question = questions[0];
                    question.answers = [];
                    ChoiceService.getChoicesByQuestionId(question.id).then(
                        (choices) => {
                            if (choices.length === 0) {
                                let empA = 'Không có câu trả lời';
                                question.answers.push(empA);
                            } else {
                                question.answers = [...choices];
                            }
                            return res.status(200).json({
                                error: false,
                                question,
                            });
                        },
                    );
                },
            );
        } catch (error) {
            console.log(error.message);
            res.status(500).send('Server error');
        }
    }
};
