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
    static async activateCourse(instructorId, courseId) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query =
                    'UPDATE courses SET verified = 1 WHERE id = ? and instructor = ?';

                pool.query(query, [courseId, instructorId], (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.affectedRows);
                });
            });
            return response === 1 ? true : false;
        } catch (error) {
            console.log(error);
        }
    }

    static async showCourseByInstructorId(id) {
        try {
            const respond = await new Promise((resolve, reject) => {
                const query = 'SELECT * FROM courses WHERE instructor = ?';

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
};
