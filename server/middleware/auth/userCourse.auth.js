const UserCourseService = require('../../dbservice/UserCourseService');
const UserService = require('../../dbservice/UserService');
const CourseService = require('../../dbservice/CourseService');

module.exports = async function (req, res, next) {
    try {
        //check if user in this course
        let { courseId } = req.params;
        let { id } = req.user;
        CourseService.getSingleInstructorCourse(id, courseId).then(
            (instructorCourse) => {
                if (!instructorCourse[0]) {
                    UserCourseService.getSingleUserCourse(id, courseId).then(
                        (studentCourse) => {
                            if (!studentCourse[0]) {
                                return res.status(403).json({
                                    error: 'Bạn không có quyền trong khoá học này',
                                });
                            }
                            next();
                        },
                    );
                } else {
                    next();
                }
            },
        );
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Server Error');
    }
};
