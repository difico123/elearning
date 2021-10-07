const pool = require('../config/db/db');

module.exports = class UserCourseService {
    static async add(userCourse) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = 'INSERT INTO user_courses SET ? ';
                pool.query(query, [userCourse], (err, result) => {
                    err
                        ? reject(new Error(err.message))
                        : resolve(result.affectedRows);
                });
            });
            return response === 1 ? true : false;
        } catch (error) {
            console.log(error);
        }
    }

    static async getUserCourseByUserId(id) {
        try {
            const response = new Promise((resolve, reject) => {
                const query =
                    'SELECT uc.id, u.role as userRole, uc.isComplete, uc.marks,c.id as courseId, c.name, uc.dateAdded as enrollDate ,' +
                    'c.instructor , concat(u.firstName," ", u.middleName, " ", u.lastName) as fullName, ' +
                    'u.email,u.address , u.city,u.phoneNumber ' +
                    'FROM user_courses uc ' +
                    'join courses c on c.id = uc.course ' +
                    'join users u on c.instructor = u.id ' +
                    'WHERE user = ?';
                pool.query(query, [id], (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result);
                });
            });
            return response;
        } catch (error) {
            console.log(error);
        }
    }

    static async getSingleUserCourse(userId, CourseId) {
        try {
            const response = new Promise((resolve, reject) => {
                const query =
                    'SELECT uc.id, u.role as userRole, uc.isComplete, uc.marks, c.name, uc.dateAdded as enrollDate ,' +
                    'c.instructor , concat(u.firstName," ", u.middleName, " ", u.lastName) as fullName, ' +
                    'u.email,u.address , u.city,u.phoneNumber ' +
                    'FROM user_courses uc ' +
                    'join courses c on c.id = uc.course ' +
                    'join users u on c.instructor = u.id ' +
                    'WHERE user = ? and course = ?';
                pool.query(query, [userId, CourseId], (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result);
                });
            });
            return response;
        } catch (error) {
            console.log(error);
        }
    }

    static async getCourseUsers(courseId) {
        try {
            const respond = await new Promise((resolve, reject) => {
                const query =
                    'select * from user_courses where course = ?';

                pool.query(query, [courseId], (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result);
                });
            });
            return respond;
        } catch (error) {
            console.log(error);
        }
    }
};
