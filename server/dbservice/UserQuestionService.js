const pool = require('../config/db/db');

module.exports = class UserQuestionService {
    static async studentAnswer(answer) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = 'INSERT INTO user_questions SET ? ';

                pool.query(query, [answer], (err, result) => {
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
};
