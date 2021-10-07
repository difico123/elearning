const CourseService = require('../../dbservice/CourseService');

module.exports = async function (req, res, next) {
    try {
        //check if instructor in this course
        let { courseId } = req.params;
        let { id } = req.user;
        CourseService.getSingleInstructorCourse(id, courseId).then(
            (instructorCourse) => {
                return !instructorCourse[0]
                    ? res.status(403).json({
                          error: 'Course instructor resources access denied',
                      })
                    : next();
            },
        );
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Server Error');
    }
};
