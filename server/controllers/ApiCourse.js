const CourseService = require('../dbservice/CourseService');
const UserCourseService = require('../dbservice/UserCourseService');

module.exports = class ApiCourse {
    // @route   POST api/course/create
    // @desc    Create course
    // @access  Private
    static async createCourse(req, res) {
        const course = {
            instructor: req.user.id,
            name: req.body.name,
        };
        try {
            CourseService.addCourse(course).then((created) => {
                if (!created) {
                    return res
                        .status(400)
                        .json({ error: 'Chưa tạo được khoá học' });
                }
                res.status(200).send('Tạo khoá học thành công');
            });
        } catch (error) {
            console.log(error.message);
            res.status(500).send('Server error');
        }
    }

    // @route   PUT api/course/activate
    // @desc    activate course
    // @access  Private
    static async activateCourse(req, res) {
        const instructorId = req.user.id;
        const courseId = req.params.id;
        const activeStatus = 1;
        try {
            CourseService.CourseStatus(
                instructorId,
                courseId,
                activeStatus,
            ).then((updated) => {
                if (!updated) {
                    return res
                        .status(400)
                        .json({ error: 'Bạn chưa kích hoạt được khoá học' });
                }
                res.status(200).send('Khoá học đã được kích hoạt thành công');
            });
        } catch (error) {
            console.log(error.message);
            res.status(500).send('Server error');
        }
    }

    // @route   PUT api/course/suspend/:id
    // @desc    Suspend course
    // @access  Private
    static async suspendCourse(req, res) {
        const instructorId = req.user.id;
        const courseId = req.params.id;
        const suspendStatus = 0;
        try {
            CourseService.CourseStatus(
                instructorId,
                courseId,
                suspendStatus,
            ).then((updated) => {
                if (!updated) {
                    return res
                        .status(400)
                        .json({ error: 'Chưa tạm dừng khoá học' });
                }
                res.status(200).send('Khoá học đã được tạm dừng');
            });
        } catch (error) {
            console.log(error.message);
            res.status(500).send('Server error');
        }
    }

    // @route   GET api/course/show
    // @desc    show instructor'courses
    // @access  Private
    static async showCourse(req, res) {
        try {
            CourseService.showCourseByInstructorId(req.user.id).then((data) => {
                if (data.length == 0) {
                    return res
                        .status(400)
                        .json({ error: 'Bạn chưa có khoá học nào' });
                }
                res.status(200).json(data);
            });
        } catch (error) {
            console.log(error.message);
            res.status(500).send('Server error');
        }
    }
    // @route   GET api/course/showAll
    // @desc    show all courses
    // @access  public
    static async showAll(req, res) {
        try {
            CourseService.showAll().then((data) => {
                if (data.length == 0) {
                    return res
                        .status(400)
                        .json({ error: 'Không có khoá học nào' });
                }
                res.status(200).json(data);
            });
        } catch (error) {
            console.log(error.message);
            res.status(500).send('Server error');
        }
    }

    // @route   GET api/course/enroll
    // @desc    enroll a course by student
    // @access  private
    static async enroll(req, res) {
        try {
            let courseId = req.params.id;
            let studentId = req.user.id;

            // check if the student is this course'instructor
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
                // student can enroll course
                let userCourse = {
                    user: studentId,
                    course: courseId,
                };
                UserCourseService.add(userCourse).then((added) => {
                    if (!added) {
                        return res
                            .status(400)
                            .json({ error: 'Chưa đăng kí được khoá học' });
                    }
                    res.status(200).send('Đăng kí khoá học thành công');
                });
            });
        } catch (error) {
            console.log(error.message);
            res.status(500).send('Server error');
        }
    }
};
