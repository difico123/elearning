const pool = require('../config/db/db');

module.exports = class UserQuestionService {
    static async studentAnswer(answer) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = 'INSERT INTO user_questions SET ? ';

                pool.query(query, [answer], (err, result) => {
                    if (err || result === undefined) {
                        reject(new Error(err.message));
                    }
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
                const query = 'select * from user_questions where quiz = ?';

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


    static async checkCorrectAnswer(answer) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query =
                    'select c.isAnswer from user_questions uq ' +
                    'join questions q on q.id = uq.question ' +
                    'join choices c on c.id = uq.choice ' +
                    'where uq.user = ? and uq.choice = ? and uq.question = ?;';
                pool.query(
                    query,
                    [answer.user, answer.choice, answer.question],
                    (err, result) => {
                        if (err) reject(new Error(err.message));

                        resolve(result);
                    },
                );
            });
            return response;
        } catch (error) {
            console.log(error);
        }
    }
};