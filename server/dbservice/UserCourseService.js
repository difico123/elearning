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
    static async update(userCourse) {
        try {
            const response = await new Promise((resolve, reject) => {
                let query =
                    'UPDATE user_courses SET ? WHERE user = ? and course = ?';
                pool.query(
                    query,
                    [userCourse, userCourse.user, userCourse.course],
                    (err, result) => {
                        if (err) reject(new Error(err.message));
                        resolve(result.affectedRows);
                    },
                );
            });

            return response === 1 ? true : false;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    static async getUserCourseByUserId(id) {
        try {
            const response = new Promise((resolve, reject) => {
                const query =
                    'SELECT uc.id, u.role as userRole, uc.isComplete, uc.marks,c.id as courseId, c.name, uc.dateAdded as enrollDate ,' +
                    'c.instructor , concat(u.firstName," ", u.middleName, " ", u.lastName) as fullName, ' +
                    'u.email ,u.address , u.city,u.phoneNumber ' +
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
                'select uc.user as userId, uc.rating, uc.marks, concat(u.firstName," ", u.middleName," ",u.lastName) as student, ' +
                'u.email, u.phoneNumber from user_courses uc ' +
                'join users u on u.id = uc.user ' +
                'where uc.course =1;';
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
