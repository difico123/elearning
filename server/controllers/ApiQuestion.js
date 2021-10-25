const QuizService = require('../dbservice/QuizService');
const QuestionService = require('../dbservice/QuestionService');
const ChoiceService = require('../dbservice/ChoiceService');

module.exports = class ApiQuestion {
    // @route   POST api/question/:courseId/:topicId/:quizId/createQuestion
    // @desc    create question by instructor
    // @access  Private
    static async createQuestion(req, res) {
        const question = {
            content: req.body.content,
            quiz: req.params.quizId,
            marks: req.body.marks,
        };
        try {

            QuizService.checkQuizTopic(req.params.quizId, req.params.topicId).then((data) => {
                if (data.length === 0) {
                    return res
                        .status(400)
                        .json({
                            error: true,
                            msg: 'quizId không nằm trong topic'
                        });
                } else {
                    console.log(req.params.quizId)
                    QuestionService.createQuestion(question).then((created) => {
                        if (!created) {
                            return res
                                .status(400)
                                .json({
                                    error: true,
                                    msg: 'Chưa tạo được câu hỏi'
                                });
                        }

                        return res
                            .status(200)
                            .json({
                                error: false,
                                msg: 'tạo câu hỏi thành công'
                            });
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
                        return res.status(400).json({
                            error: false,
                            msg: 'Không có câu hỏi',
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

    // @route   GET api/question/:courseId/:quizId/getQuestions
    // @desc    get question with quizId by instructor and student
    // @access  Private
    static async getQAsByquiz(req, res) {
        let quiz = {
            quizId: req.params.quizId,
        };
        try {
            await QuizService.getQuizById(req.params.quizId).then((quizes) => {
                if (quizes.length === 0) {
                    return res.status(400).json({
                        error: true,
                        msg: 'Bạn chưa có quiz',
                    });
                }
                quiz.quizContent = quizes[0].title;
            });

            let questions = [];

            await QuestionService.getQAsByQuizId(req.params.quizId).then(
                (data) => {

                    if (data.length == 0) {
                        let empQ = 'Không có câu hỏi';

                        questions.push(empQ);
                    } else {
                        data.map(async (v) => {

                            let answers = [];
                            await ChoiceService.getChoicesByQuestionId(v.id).then(
                                (choices) => {
                                    if (choices.length == 0) {
                                        let empA = 'Không có câu trả lời';
                                        answers.push(empA)
                                    } else {
                                        choices.map((choice) => {
                                            answers.push({
                                                choiceId: choice.id,
                                                contentA: choice.content
                                            });
                                        });

                                    }
                                },
                            );
                            questions.push({
                                id: v.id,
                                content: v.content,
                                aswers: answers
                            });

                            console.log(questions);
                        });
                    }
                },
            );

            quiz.questions = questions;
            return res.json({
                error: false,
                quiz
            });
        } catch (error) {
            console.log(error.message);
            res.status(500).send('Server error');
        }
    }
};