const TopicService = require('../dbservice/TopicService');
const NotificationService = require('../dbservice/NotificationService');
const CourseService = require('../dbservice/CourseService');

module.exports = class ApiCourse {
    // @route   POST api/course/create
    // @desc    Create course
    // @access  Private
    static async createTopic(req, res) {
        const topic = {
            topicNo: req.body.topicNo,
            title: req.body.title,
            content: req.body.content,
            course: req.params.courseId,
        };
        try {
            TopicService.addTopic(topic).then((created) => {
                if (!created) {
                    return res
                        .status(400)
                        .json({ error: 'Chưa tạo được topic' });
                }

                res.status(200).send('Tạo topic thành công');
            });
        } catch (error) {
            console.log(error.message);
            res.status(500).send('Server error');
        }
    }

// @route   GET api/notification/getCourseTopics
// @desc    get All course topics
// @access  Private
    static async getCourseTopics(req, res) {
        
        try {
            TopicService.getCourseTopics(req.params.courseId).then((data) => {
                if (data.length == 0) {
                    return res
                        .status(400)
                        .json({ error: 'Bạn chưa có topic nào' });
                }
                res.status(200).json(data);
            });
        } catch (error) {
            console.log(error.message);
            res.status(500).send('Server error');
        }
    }

}
