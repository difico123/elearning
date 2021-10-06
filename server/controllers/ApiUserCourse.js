const CourseService = require('../dbservice/CourseService');
const UserCourseService = require('../dbservice/UserCourseService');

module.exports = class ApiCourse {
    // @route   GET api/userCourse/enroll/:courseId
    // @desc    enroll a course by student
    // @access  private
    static async enroll(req, res) {
        let courseId = req.params.courseId;
        let studentId = req.user.id;
        try {
            // check if the student is this course'instructor or this course is not activate
            CourseService.getCourseById(courseId).then((courses) => {
                let course = courses[0];
                if (
                    !course ||
                    course.instructor === studentId ||
                    course.verified === 0
                ) {
                    return res
                        .status(400)
                        .json({ error: 'Bạn không thể đăng kí khoá học này' });
                }
                // student can enroll course but studen enrolled this course will not enroll again
                let userCourse = {
                    user: studentId,
                    course: courseId,
                };
                UserCourseService.add(userCourse).then((added) => {
                    //duplication error
                    if (!added) {
                        return res
                            .status(400)
                            .json({ error: 'Bạn đã đăng kí khoá học rồi' });
                    }
                    res.status(200).send('Đăng kí khoá học thành công');
                });
            });
        } catch (error) {
            console.log(error.message);
            res.status(500).send('Server error');
        }
    }

    // @route   Get api/userCourse/all
    // @desc    get the list of user courses
    // @access  private
    static async getAll(req, res) {
        try {
            let { id } = req.user;
            UserCourseService.getUserCourseByUserId(id).then((data) => {
                return data.length === 0
                    ? res
                          .status(400)
                          .json({ error: 'Bạn chưa đăng kí khoá học nào' })
                    : res.status(200).json(data);
            });
        } catch (error) {
            console.log(error.message);
            res.status(500).send('Server error');
        }
    }
};
