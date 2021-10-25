const pool = require('../config/db/db');

module.exports = class QuizService {
    static async createQuiz(quiz) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = 'INSERT INTO quizes SET ? ';

                pool.query(query, [quiz], (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.affectedRows);
                });
            });
            return response === 1 ? true : false;
        } catch (error) {
            console.log(error);
        }
    }

    static async getQuizesByTopic(topicId) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = 'select * from quizes where topic = ?';

                pool.query(query, [topicId], (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result);
                });
            });
            return response;
        } catch (error) {
            console.log(error);
        }
    }

    static async checkQuizTopic(quizId, topicId) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = 'select * from quizes where id = ? and topic = ? ';

                pool.query(query, [quizId, topicId], (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result);
                });
            });
            return response;
        } catch (error) {
            console.log(error);
        }
    }
    static async getQuizById(quizId) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = 'select * from quizes where id = ?';

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