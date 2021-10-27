const pool = require('../config/db/db');

module.exports = class QuestionService {
    static async createQuestion(question) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = 'INSERT INTO questions SET ? ';

                pool.query(query, [question], (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.affectedRows);
                });
            });
            return response === 1 ? true : false;
        } catch (error) {
            console.log(error);
        }
    }

    static async getQuestionByQuizId(quizId) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = 'select * from questions where quiz = ?';

                pool.query(query, [quizId], (err, result) => {
                    if (err) reject(new Error(err.message));

                    resolve(result);
                });
            });
            return response;
        } catch (error) {
            console.log(error);
        }
    }
    static async getQuestionByQuestionId(questionId) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = 'select * from questions where id = ?';

                pool.query(query, [questionId], (err, result) => {
                    if (err) reject(new Error(err.message));

                    resolve(result);
                });
            });
            return response;
        } catch (error) {
            console.log(error);
        }
    }
    static async getQAsByQuizId(quizId) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query =
                    'select id as questionId, content as questionContent from questions where quiz = ?';

                pool.query(query, [quizId], (err, result) => {
                    if (err) reject(new Error(err.message));

                    resolve(result);
                });
            });
            return response;
        } catch (error) {
            console.log(error);
        }
    }
    static async checkQuestionQuiz(questionId, quizId) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query =
                    'select * from questions where id = ? and quiz = ? ';

                pool.query(query, [questionId, quizId], (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result);
                });
            });
            return response;
        } catch (error) {
            console.log(error);
        }
    }
    static async rank(quizId) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query =
                    'select uq.user,concat(u.firstName, " ",u.lastName) as fullName,  ' +
                    'sum(c.isAnswer*qu.marks) as score from user_questions uq ' +
                    'join users u on u.id = uq.user ' +
                    'join choices c on c.id = uq.choice ' +
                    'join questions qu on qu.id = c.question ' +
                    'join quizes qui on qui.id = qu.quiz ' +
                    'where u.role = 0 and qui.id = ? ' +
                    'group by uq.user ' +
                    'order by score desc ' +
                    'limit 5 ';

                pool.query(query, [quizId], (err, result) => {
                    if (err) reject(new Error(err.message));

                    resolve(result);
                });
            });
            return response;
        } catch (error) {
            console.log(error);
        }
    }
};
