const ChatService = require('../dbservice/ChatService');
const NotificationService = require('../dbservice/NotificationService');

module.exports = class ApiChat {
    // @route   POST api/chat/chats/:courseId
    // @desc    user comment a course
    // @access  Private
    static async chat(req, res) {
        let chat = {
            user: req.user.id,
            course: parseInt(req.params.courseId),
            message: req.body.message,
        };

        try {
            ChatService.addChat(chat).then((added) => {
                if (!added) {
                    return res
                        .status(400)
                        .json({ error: 'Comment của bạn không gửi được' });
                }
                ChatService.getCourseChatUser(chat.user, chat.course).then(
                    (chattedCourse) => {
                        let firstDetailsMsg = `${chattedCourse[0].senderName} vừa mới nhắn tin trong khoá học ${chattedCourse[0].name} của`;

                        ChatService.getOtherChatUser(
                            chat.user,
                            chat.course,
                        ).then((users) => {
                            //chatUsers = undefined
                            let details = '';
                            let chatUsers = users.map((user) => {
                                switch (chattedCourse[0].instructor) {
                                    case chat.user:
                                        details = `${firstDetailsMsg} thầy/cô ấy`;
                                        break;
                                    case user.user:
                                        details = `${firstDetailsMsg} mình`;
                                        break;
                                    default:
                                        details = `${firstDetailsMsg} ${chattedCourse[0].instructorName}`;
                                }

                                let notification = {
                                    user: user.user,
                                    topic: 'tin nhắn khoá học',
                                    details: details,
                                };
                                NotificationService.addNotification(
                                    notification,
                                );
                            });

                            Promise.all([chatUsers]).then((values) => {
                                //values is undefined
                                return res
                                    .status(200)
                                    .send('Commnent của bạn đã được gửi');
                            });
                        });
                    },
                );
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
            ChatService.getConversation(req.params.courseId).then(
                (messages) => {
                    if (messages.length === 0) {
                        return res
                            .status(400)
                            .json({ error: 'Không có cuộc nói chuyện nào' });
                    }
                    res.status(200).json(messages);
                },
            );
        } catch (error) {
            console.log(error.message);
            res.status(500).send('Server error');
        }
    }

    // @route   GET api/chat/getOtherUserChat/:courseId
    // @desc    get conversation
    // @access  Private
    static async getOtherUserChat(req, res) {
        try {
            ChatService.getOtherChatUser(req.user.id, req.params.courseId).then(
                (users) => {
                    if (users.length === 0) {
                        return res
                            .status(400)
                            .json({ error: 'Không có cuộc nói chuyện nào' });
                    }
                    res.status(200).json(users);
                },
            );
        } catch (error) {
            console.log(error.message);
            res.status(500).send('Server error');
        }
    }

    // @route   GET api/chat/getOtherUserChat/:courseId
    // @desc    get conversation
    // @access  Private
    static async getCourseChatUser(req, res) {
        try {
            ChatService.getCourseChatUser(
                req.user.id,
                req.params.courseId,
            ).then((users) => {
                if (users.length === 0) {
                    return res
                        .status(400)
                        .json({ error: 'Không có cuộc nói chuyện nào' });
                }
                res.status(200).json(users);
            });
        } catch (error) {
            console.log(error.message);
            res.status(500).send('Server error');
        }
    }
};
