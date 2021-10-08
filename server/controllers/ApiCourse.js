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
            des: req.body.des,
            category: req.params.categoryId,
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

    // @route   PUT api/course/activate/:id
    // @desc    activate course
    // @access  Private
    static async activateCourse(req, res) {
        const instructorId = req.user.id;
        const courseId = req.params.courseId;
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
        const courseId = req.params.courseId;
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

    // @route   PUT api/course/edit/:courseId
    // @desc    edit course
    // @access  Private
    static async edit(req, res) {
        const newCourse = {
            instructor: req.user.id,
            name: req.body.name,
            des: req.body.des,
            id: req.params.courseId,
        };

        try {
            CourseService.updateCourse(newCourse).then((updated) => {
                if (!updated) {
                    return res
                        .status(400)
                        .json({ error: 'Bạn chưa sửa được khoá học' });
                }
                res.status(200).send('Khoá học đã được sửa thành công');
            });
        } catch (error) {
            console.log(error.message);
            res.status(500).send('Server error');
        }
    }

    // @route   PUT api/course/edit/:courseId
    // @desc    edit course
    // @access  Private
    static async delete(req, res) {
        try {
            //get user information by id
            CourseService.deleteCourseById(req.params.courseId).then((data) => {
                if (!data) {
                    return res.status(400).json({
                        error: 'Không xoá được khoá học',
                    });
                }
                res.status(200).send('Đã xoá khoá học ');
            });
        } catch (error) {
            console.log(error.message);
            res.status(500).send('Server error');
        }
    }

    // @route   GET api/course/show
    // @desc    show instructor'courses
    // @access  Private
    static async getCourses(req, res) {
        try {
            CourseService.getCoursesByInstructorId(req.user.id).then((data) => {
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

    // @route   GET api/course/instructorCourse/:courseId
    // @desc    show single instructor'course
    // @access  Private
    static async getSingleCourse(req, res) {
        try {
            CourseService.getSingleInstructorCourse(
                req.user.id,
                req.params.courseId,
            ).then((data) => {
                if (!data[0]) {
                    return res
                        .status(400)
                        .json({ error: 'Bạn không có khoá học này' });
                }
                res.status(200).json(data);
            });
        } catch (error) {
            console.log(error.message);
            res.status(500).send('Server error');
        }
    }

    // @route   GET api/course/show
    // @desc    show instructor'courses
    // @access  Private
    static async showSingleCourse(req, res) {
        try {
            CourseService.getCoursesByInstructorId(req.user.id).then((data) => {
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
            CourseService.getAll().then((data) => {
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

    // @route   GET api/course/getUsers/:courseId
    // @desc    Get all users in the course
    // @access  private
    static async showUsers(req, res) {
        try {
            UserCourseService.getCourseUsers(req.params.courseId).then(
                (data) => {
                    if (data.length == 0) {
                        return res.status(400).json({
                            error: 'Không có học sinh nào trong khoá học',
                        });
                    }
                    res.status(200).json(data);
                },
            );
        } catch (error) {
            console.log(error.message);
            res.status(500).send('Server error');
        }
    }
};
