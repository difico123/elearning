const pool = require('../config/db/db');

module.exports = class UserCourseService {
    static async add(userCourse) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = 'INSERT INTO user_courses SET ? ';

                pool.query(query, [userCourse], (err, result) => {
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
