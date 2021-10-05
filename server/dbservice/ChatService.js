const pool = require('../config/db/db');

module.exports = class ChatService {
    static async addChat(chat) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = 'INSERT INTO chats SET ? ';

                pool.query(query, [chat], (err, result) => {
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
