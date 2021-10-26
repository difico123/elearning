const pool = require('../config/db/db');

module.exports = class TopicService {
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

    static async editTopic(topic) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = 'update topics SET ? where id = ?';

                pool.query(query, [topic, topic.id], (err, result) => {
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
                    'select * from topics  ' +
                    'where course = ? ' +
                    'order by indexOrder asc, id asc ';

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
    static async checkTopicInCource(topicId, courseId) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query =
                    'select * from topics where id = ? and course = ? ';

                pool.query(query, [topicId, courseId], (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result);
                });
            });
            return response;
        } catch (error) {
            console.log(error);
        }
    }
    static async getCourseTopicById(topicId) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = 'select * from topics where id = ?';

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
    static async getCourseTopicTitles(courseId) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query =
                    'select title from topics where course = ? order by indexOrder asc, dateAdded asc, title asc';

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

    static async deleteTopic(topicId) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = 'DELETE FROM topics WHERE id = ?';

                pool.query(query, [topicId], (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.affectedRows);
                });
            });
            return response === 1 ? true : false;
        } catch (error) {
            console.log(error);
        }
    }
};
