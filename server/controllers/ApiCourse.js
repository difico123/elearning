const { validationResult } = require('express-validator');
const CourseService = require('../dbservice/CourseService');

module.exports = class ApiCourse {
    // @route   POST api/courses/create
    // @desc    Create course
    // @access  Private
    static async createCourse(req, res) {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                error: errors.errors.map((item) => item.msg),
            });
        }

        const course = {
            instructor: req.user.id,
            name: req.body.name,
        };
        try {
            CourseService.addCourse(course).then((created) => {
                if(!created) {
                    return res.status(400).json({error:'Chưa đăng kí được khoá học'})
                }
                res.status(200).send('Đăng kí khoá học thành công')
            })
            
        } catch (error) {
            console.log(error.message);
            res.status(500).send('Server error');
        }
    }
};
