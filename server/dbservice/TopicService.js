const pool = require('../config/db/db');

module.exports = class NotificationService {
    static async addTopic(topic) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = 'INSERT INTO topics SET ? ';

                pool.query(query, [topic], (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.affectedRows);
                });
            });
            return response === 1 ? true : false;
        } catch (error) {
            console.log(error);
        }
    }

    static async getCourseTopics(courseId) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query =
                    'select * from topics where course = ?';

                pool.query(query, [courseId], (err, result) => {
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
