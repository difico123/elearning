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

    static async deleteCourseById(id) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = 'DELETE FROM courses WHERE id = ?';

                pool.query(query, [id], (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.affectedRows);
                });
            });
            return response === 1 ? true : false;
        } catch (error) {
            console.log(error);
        }
    }

    static async deleteIntructorCourses(instructorId) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = 'DELETE FROM courses WHERE instructor = ?';

                pool.query(query, [instructorId], (err, result) => {
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
                    'SELECT courses.*, categories.name as categoryName, ' +
                    'concat(users.firstName, " " , users.middleName, " ", users.lastName) as instructorFullName, ' +
                    'users.email as instructorEmail FROM courses ' +
                    'join users on users.id = courses.instructor ' +
                    'join categories on categories.id = courses.category ' +
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
    static async getAll(query) {
        let { keyword, rating } = query;
        try {
            const response = await new Promise((resolve, reject) => {
                let nameQuery =
                    keyword !== undefined
                        ? `and c.name like "${keyword}%"`
                        : '';
                let ratingQuery =
                    rating !== undefined
                        ? ` having rating > " ${rating} "`
                        : '';
                const query =
                    'select c.id as courseId, c.name, c.des, ca.id as categoryId, ca.name as categoryName, ' +
                    'c.instructor as instructorId, concat(u.firstName," ", u.middleName," ", u.lastName) as instructorName, ' +
                    'u.email as instructorEmail, round(avg(uc.rating),1) as rating, ' +
                    'count(uc.id) as register from courses c ' +
                    'JOIN categories ca on ca.id = c.category ' +
                    'left join user_courses uc on uc.course = c.id ' +
                    'left join users u on u.id = c.instructor ' +
                    'where c.verified = 1 ' +
                    nameQuery +
                    'group by c.id' +
                    ratingQuery;
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
    static async checkCourseCategory(courseId, categoryId) {
        try {
            const respond = await new Promise((resolve, reject) => {
                const query =
                    'SELECT * FROM courses WHERE id = ? and category = ?';

                pool.query(query, [courseId, categoryId], (err, result) => {
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
                    'SELECT categories.id as categoryId, categories.name as categoryIdName, courses.* FROM courses ' +
                    'join categories on categories.id = courses.category ' +
                    'WHERE courses.id = ? and courses.instructor = ?';

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
    static async getCourseInstructorByCourceId(courseId) {
        try {
            const respond = await new Promise((resolve, reject) => {
                const query =
                'select c.id as courseId, c.name as courseName, concat(u.firstName," ", u.middleName, " ", u.lastName) as instructorFullName ' +
                'from courses c ' +
                'join users u on u.id = c.instructor ' +
                'WHERE c.id = ?';
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
