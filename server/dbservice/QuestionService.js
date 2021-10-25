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
    static async getQAsByQuizId(quizId) {
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
    static async checkQuestionQuiz(questionId, quizId) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = 'select * from questions where id = ? and quiz = ? ';

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
                const query = 'select u.id as userId, concat(u.firstName, " ",u.lastName) as fullName, ' +
                    'SUM(ch.isAnswer*q.marks) as score ' +
                    'from user_questions uq ' +
                    'join choices ch on ch.id = uq.choice ' +
                    'join users u on u.id = uq.user ' +
                    'join questions q on q.id = uq.question ' +
                    'join quizes qu on qu.id = q.quiz ' +
                    'where u.role = 0 and qu.id = ? ' +
                    'group by u.id ' +
                    'order by score DESC ' +
                    'limit 5;';

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