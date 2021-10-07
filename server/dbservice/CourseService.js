const pool = require('../config/db/db');

module.exports = class CourseService {
    static async addCourse(course) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = 'INSERT INTO courses SET ? ';

                pool.query(query, [course], (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.affectedRows);
                });
            });
            return response === 1 ? true : false;
        } catch (error) {
            console.log(error);
        }
    }

    static async updateCourse(course) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = 'UPDATE courses SET ? WHERE id = ?';

                pool.query(query, [course, course.id], (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.affectedRows);
                });
            });
            return response === 1 ? true : false;
        } catch (error) {
            console.log(error);
        }
    }
    static async CourseStatus(instructorId, courseId, courseStatus) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query =
                    'UPDATE courses SET verified = ? WHERE id = ? and instructor = ?';

                pool.query(
                    query,
                    [courseStatus, courseId, instructorId],
                    (err, result) => {
                        if (err) reject(new Error(err.message));
                        resolve(result.affectedRows);
                    },
                );
            });
            return response === 1 ? true : false;
        } catch (error) {
            console.log(error);
        }
    }
    static async getCoursesByInstructorId(id) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query =
                    'SELECT courses.*, ' +
                    'concat(users.firstName, " " , users.middleName, " ", users.lastName) as instructorFullName, ' +
                    'users.email as instructorEmail FROM courses ' +
                    'join users on users.id = courses.instructor ' +
                    'WHERE instructor = ?';

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
    static async getAll() {
        try {
            const response = await new Promise((resolve, reject) => {
                const query =
                    'SELECT courses.id, courses.name, courses.instructor, ' +
                    'concat(users.firstName, " " , users.middleName, " ", users.lastName) as fullName, ' +
                    'users.email FROM courses ' +
                    'join users on users.id = courses.instructor ' +
                    'where verified = 1';
                pool.query(query, (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result);
                });
            });
            return response;
        } catch (error) {
            console.log(error);
        }
    }

    static async getCourseById(id) {
        try {
            const respond = await new Promise((resolve, reject) => {
                const query = 'SELECT * FROM courses WHERE id = ?';

                pool.query(query, [id], (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result);
                });
            });
            return respond;
        } catch (error) {
            console.log(error);
        }
    }

    static async getSingleInstructorCourse(instructorId, courseId) {
        try {
            const respond = await new Promise((resolve, reject) => {
                const query =
                    'SELECT * FROM courses WHERE id = ? and instructor = ?';

                pool.query(query, [courseId, instructorId], (err, result) => {
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
