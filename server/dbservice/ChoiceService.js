const pool = require('../config/db/db');

module.exports = class ChoiceService {
    static async create(choice) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = 'INSERT INTO choices SET ? ';

                pool.query(query, [choice], (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.affectedRows);
                });
            });
            return response === 1 ? true : false;
        } catch (error) {
            console.log(error);
        }
    }

    static async getChoicesByQuestionId(questionId) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = 'select * from choices where question = ?';

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

    static async getChoicesInQuestion(choiceId, questionId) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = 'select * from choices c ' +
                    'join questions q on q.id = c.question ' +
                    'where q.id = ? and c.id = ?';

                pool.query(query, [questionId, choiceId], (err, result) => {
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