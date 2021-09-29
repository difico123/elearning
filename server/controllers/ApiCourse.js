const CourseService = require('../dbservice/CourseService');

module.exports = class ApiCourse {
    // @route   POST api/courses/create
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
                        .json({ error: 'Chưa đăng kí được khoá học' });
                }
                res.status(200).send('Đăng kí khoá học thành công');
            });
        } catch (error) {
            console.log(error.message);
            res.status(500).send('Server error');
        }
    }
    
    // @route   PUT api/courses/activate
    // @desc    activate course
    // @access  Private
    static async activateCourse(req, res) {
        const instructorId = req.user.id;
        const courseId = req.body.id;
        try {
            CourseService.activateCourse(course).then((updated) => {
                if (!updated) {
                    return res
                        .status(400)
                        .json({ error: 'Chưa kích hoạt được khoá học' });
                }
                res.status(200).send('Khoá học đã được kích hoạt thành công');
            });
        } catch (error) {
            console.log(error.message);
            res.status(500).send('Server error');
        }
    }
};
