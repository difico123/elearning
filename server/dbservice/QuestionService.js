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
};
