const CourseService = require('../dbservice/CourseService');
const UserCourseService = require('../dbservice/UserCourseService');
const NotificationService = require('../dbservice/NotificationService');
const UserService = require('../dbservice/UserService');

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
                    return res.status(400).json({
                        error: 'Bạn không thể đăng kí khoá học này',
                    });
                }
                // student can enroll course but studen enrolled this course will not enroll again
                let userCourse = {
                    user: studentId,
                    course: courseId,
                };
                UserCourseService.add(userCourse).then((added) => {
                    //duplication error
                    if (!added) {
                        return res.status(400).json({
                            error: 'Bạn đã đăng kí khoá học rồi',
                        });
                    }

                    UserService.getUserInfoById(studentId).then(
                        async (data) => {
                            let courseName = '';

                            await CourseService.getCourseById(courseId).then(
                                (courses) => {
                                    courseName = courses[0].name;
                                },
                            );
                            let student = data[0];

                            let details = `${student.lastName} vừa đăng kí khoá học ${courseName} của bạn`;
                            let notification = {
                                user: course.instructor,
                                topic: 'Đăng kí khoá học',
                                details: details,
                            };

                            NotificationService.addNotification(
                                notification,
                            ).then((notified) => {
                                if (!notified) {
                                    return res.status(400).json({
                                        error: true,
                                        msg: 'chưa thông báo được đến thầy ',
                                    });
                                }
                                return res.status(200).json({
                                    error: false,
                                    msg: 'tin nhắn đã thông báo đến instructor, Đăng kí khoá học thành công',
                                });
                            });
                        },
                    );
                });
            });
        } catch (error) {
            console.log(error.message);
            res.status(500).send('Server error');
        }
    }

    // @route   POST api/userCourse/rate/:courseId
    // @desc    rate the course
    // @access  private
    static async rate(req, res) {
        let rating = parseInt(req.body.rating);

        if (rating < 1 || rating > 5) {
            return res.status(400).json({
                error: 'Bạn phải đánh giá khoá học từ 1 - 5',
            });
        }
        let userCourse = {
            rating: req.body.rating,
            user: req.user.id,
            course: req.params.courseId,
        };
        try {
            UserCourseService.update(userCourse).then((updated) => {
                if (!updated) {
                    return res.status(400).json({
                        error: 'Bạn chưa đánh giá khoá học',
                    });
                }
                res.status(200).send('Bạn đã đánh giá khoá học');
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
                    ? res.status(400).json({
                          error: 'Bạn chưa đăng kí khoá học nào',
                      })
                    : res.status(200).json(data);
            });
        } catch (error) {
            console.log(error.message);
            res.status(500).send('Server error');
        }
    }
};
