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

    static async getOtherChatUser(userId, courseId) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query =
                    'select DISTINCT(user), users.lastName from chats ' +
                    'join users on users.id = chats.user ' +
                    'where user != ? and course = ?';

                pool.query(query, [userId, courseId], (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result);
                });
            });
            return response;
        } catch (error) {
            console.log(error);
        }
    }
    // get the course info user chatted
    static async getCourseChatUser(userId, courseId) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query =
                    'SELECT DISTINCT(u.id), u.lastName as senderName, p.id, p.name, p.instructor, p.lastName as instructorName FROM users u ' +
                    'join chats ch on ch.user = u.id ' +
                    'join (SELECT o.instructor,e.lastName,o.id, o.name from users e JOIN courses o on o.instructor = e.id) ' +
                    'p on p.id = ch.course ' +
                    'WHERE u.id = ? and ch.course = ?';

                pool.query(query, [userId, courseId], (err, result) => {
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
