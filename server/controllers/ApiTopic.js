const TopicService = require('../dbservice/TopicService');
const NotificationService = require('../dbservice/NotificationService');
const UserCourseService = require('../dbservice/UserCourseService');

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

                UserCourseService.getCourseUsers(topic.course).then((users) => {
                    if(users.length === 0) {
                        return res
                        .status(400)
                        .json({ error: 'Không học sinh nào trong khoá học này' });
                    }
                    let notifyToUser = users.map(user => {
                        let notification = {
                            user: user.userId,
                            topic: 'Thông báo topic của khoá học',
                            details: `${user.instructorName} vừa tạo thêm topic trong khoá học ${user.courseName} của thầy ấy`
                        }
                        NotificationService.addNotification(notification)
                    })

                    Promise.all([notifyToUser]).then((values) => {
                        return res.status(200).send('Tạo topic thành công');
                    });

                })
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
