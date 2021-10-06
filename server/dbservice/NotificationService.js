const pool = require('../config/db/db');

module.exports = class NotificationService {
    static async addNotification(notification) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = 'INSERT INTO notifications SET ? ';

                pool.query(query, [notification], (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.affectedRows);
                });
            });
            return response === 1 ? true : false;
        } catch (error) {
            console.log(error);
        }
    }

    static async getConversation(courseId) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = 'SELECT * FROM chats WHERE course = ? ';

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
