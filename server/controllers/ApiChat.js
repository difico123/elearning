const ChatService = require('../dbservice/ChatService');

module.exports = class ApiChat {
    // @route   POST api/chat/chats
    // @desc    user comment a course
    // @access  Private
    static async chat(req, res) {
        let chat = {
            user: req.user.id,
            course: req.params.courseId,
            message: req.body.message,
        };
        try {
            ChatService.addChat(chat).then((added) => {
                if (!added) {
                    return res
                        .status(400)
                        .json({ error: 'Comment của bạn không gửi được' });
                }
                res.status(200).send('Commnent của bạn đã được gửi');
            });
        } catch (error) {
            console.log(error.message);
            res.status(500).send('Server error');
        }
    }


    // @route   GET api/chat/getCourseChats/:courseId
    // @desc    get conversation
    // @access  Private
    static async getCourseChats(req, res) {
        try {
            ChatService.getConversation(req.params.courseId).then((messages) => {
                if (messages.length === 0) {
                    return res
                        .status(400)
                        .json({ error: 'Không có cuộc nói chuyện nào' });
                }
                res.status(200).json(messages);
            });
        } catch (error) {
            console.log(error.message);
            res.status(500).send('Server error');
        }
    }
};
